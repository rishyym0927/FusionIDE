import { useState, useEffect } from 'react'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'

export const useSocket = (project, user, setFileTree) => {
    const [messages, setMessages] = useState([])
    console.log('useSocket initialized with project:', project)
    console.log('useSocket initialized with user:', user)

    useEffect(() => {
        if (project?._id) {
            const socket = initializeSocket(project._id)

            // Handle loading existing messages
            receiveMessage('load-messages', (existingMessages) => {
                const formattedMessages = existingMessages.map(msg => ({
                    message: msg.message,
                    sender: msg.sender,
                    timestamp: new Date(msg.timestamp)
                }));
                setMessages(formattedMessages);
            });

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
                            setFileTree(prev => {
                                const newFileTree = {
                                    ...prev,
                                    ...aiResponse.fileTree
                                };
                                
                                // Auto-save the updated fileTree to database
                                saveFileTreeToDatabase(newFileTree);
                                
                                return newFileTree;
                            });
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
        if (!user || !user.email) {
            console.error('User or user.email is missing')
            return
        }

        const messageData = {
            message: currentMessage,
            sender: {
                _id: user.email,
                email: user.email
            }
        }

        sendMessage('project-message', messageData)
        
        setMessages(prev => [...prev, {
            ...messageData,
            timestamp: new Date()
        }])

        setCurrentMessage('')
    }

    const saveFileTreeToDatabase = async (fileTree) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/update-filetree`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    projectId: project._id,
                    fileTree: fileTree
                })
            });

            if (response.ok) {
                console.log('FileTree auto-saved successfully');
            } else {
                console.error('Failed to auto-save fileTree');
            }
        } catch (error) {
            console.error('Error auto-saving fileTree:', error);
        }
    };

    return {
        messages,
        handleSendMessage
    }
}
