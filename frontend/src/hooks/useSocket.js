import { useState, useEffect } from 'react'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'

export const useSocket = (project, user, setFileTree) => {
    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (project?._id) {
            const socket = initializeSocket(project._id)

            receiveMessage('project-message', (data) => {
                const { message, sender } = data
                
                if (sender._id === 'ai') {
                    try {
                        const aiResponse = JSON.parse(message)
                        
                        setMessages(prev => [...prev, {
                            message: aiResponse.text,
                            sender: { _id: 'ai', email: 'AI Assistant' },
                            timestamp: new Date()
                        }])

                        if (aiResponse.fileTree) {
                            setFileTree(prev => ({
                                ...prev,
                                ...aiResponse.fileTree
                            }))
                        }
                    } catch (error) {
                        console.error('Error parsing AI response:', error)
                        setMessages(prev => [...prev, {
                            message: 'Error processing AI response',
                            sender: { _id: 'ai', email: 'AI Assistant' },
                            timestamp: new Date()
                        }])
                    }
                } else {
                    setMessages(prev => [...prev, {
                        ...data,
                        timestamp: new Date()
                    }])
                }
            })

            return () => {
                socket.disconnect()
            }
        }
    }, [project, setFileTree])

    const handleSendMessage = (currentMessage, setCurrentMessage) => {
        if (!currentMessage.trim()) return

        const messageData = {
            message: currentMessage,
            sender: user
        }

        sendMessage('project-message', messageData)
        
        setMessages(prev => [...prev, {
            ...messageData,
            timestamp: new Date()
        }])

        setCurrentMessage('')
    }

    return {
        messages,
        handleSendMessage
    }
}
