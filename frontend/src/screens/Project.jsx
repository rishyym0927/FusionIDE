import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { getWebContainer } from '../config/webContainer'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import { UserContext } from '../context/user.context'

const Project = () => {
    // State variables
    const [isInstalling, setIsInstalling] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const [runStatus, setRunStatus] = useState('idle') // 'idle', 'installing', 'running', 'error'
    const [runLogs, setRunLogs] = useState([])
    const [showLogs, setShowLogs] = useState(false)
    const [webContainer, setWebContainer] = useState(null)
    const [runProcess, setRunProcess] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)
    const [fileTree, setFileTree] = useState({})

    // Chat-related state variables
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [currentMessage, setCurrentMessage] = useState('')
    const [selectedFile, setSelectedFile] = useState('app.js')

    const location = useLocation()
    const { project } = location.state || {}
    const { user } = useContext(UserContext)

    // Initialize WebContainer
    useEffect(() => {
        const initWebContainer = async () => {
            const container = await getWebContainer()
            setWebContainer(container)
        }
        initWebContainer()
    }, [])

    // Set initial file tree from project data or default
    useEffect(() => {
        if (project?.fileTree && Object.keys(project.fileTree).length > 0) {
            setFileTree(project.fileTree)
        } else {
            // Default file tree from temp.md
            setFileTree({
                "app.js": {
                    "file": {
                        "contents": `import express from 'express';
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});`
                    }
                },
                "package.json": {
                    "file": {
                        "contents": `{
    "name": "express-server",
    "version": "1.0.0",
    "description": "Express server with ES6 features",
    "main": "app.js",
    "type": "module",
    "scripts": {
        "start": "node app.js"
    },
    "keywords": [
        "express",
        "es6",
        "server"
    ],
    "author": "Your Name",
    "license": "ISC",
    "dependencies": {
        "express": "^4.18.2"
    }
}`
                    }
                }
            })
        }
    }, [project])

    // Socket connection useEffect
    useEffect(() => {
        if (project?._id) {
            const socket = initializeSocket(project._id)

            receiveMessage('project-message', (data) => {
                const { message, sender } = data
                
                // Handle AI responses
                if (sender._id === 'ai') {
                    try {
                        const aiResponse = JSON.parse(message)
                        
                        // Add AI message to chat
                        setMessages(prev => [...prev, {
                            message: aiResponse.text,
                            sender: { _id: 'ai', email: 'AI Assistant' },
                            timestamp: new Date()
                        }])

                        // If AI response contains fileTree, update the project files
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
                    // Regular user message
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
    }, [project])

    // Handle Run Project
    const handleRunProject = async () => {
        if (!webContainer) {
            setRunLogs(prev => [...prev, '[Error] WebContainer not initialized'])
            return
        }

        try {
            setRunStatus('installing')
            setIsInstalling(true)
            setRunLogs([])
            
            // Mount the file tree
            await webContainer.mount(fileTree)
            
            // Install dependencies
            const installProcess = await webContainer.spawn("npm", ["install"])
            
            installProcess.output.pipeTo(new WritableStream({
                write(chunk) {
                    console.log('Install:', chunk)
                    setRunLogs(prev => [...prev, `[Install] ${chunk}`])
                }
            }))
            
            // Wait for installation to complete
            await installProcess.exit
            setIsInstalling(false)
            
            // Kill existing process if running
            if (runProcess) {
                runProcess.kill()
                setIsRunning(false)
            }
            
            setRunStatus('running')
            setIsRunning(true)
            
            // Start the application
            let tempRunProcess = await webContainer.spawn("npm", ["start"])
            
            tempRunProcess.output.pipeTo(new WritableStream({
                write(chunk) {
                    console.log('Run:', chunk)
                    setRunLogs(prev => [...prev, `[Run] ${chunk}`])
                }
            }))
            
            setRunProcess(tempRunProcess)
            
            // Listen for server ready
            webContainer.on('server-ready', (port, url) => {
                console.log('Server ready:', port, url)
                setIframeUrl(url)
                setRunLogs(prev => [...prev, `[Success] Server running on ${url}`])
            })
            
        } catch (error) {
            console.error('Error running project:', error)
            setRunStatus('error')
            setIsInstalling(false)
            setIsRunning(false)
            setRunLogs(prev => [...prev, `[Error] ${error.message}`])
        }
    }

    const handleStopProject = () => {
        if (runProcess) {
            runProcess.kill()
            setRunProcess(null)
            setIsRunning(false)
            setRunStatus('idle')
            setIframeUrl(null)
            setRunLogs(prev => [...prev, '[Stop] Application stopped'])
        }
    }

    // Chat handlers
    const handleSendMessage = (e) => {
        e.preventDefault()
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

    const handleFileSelect = (fileName) => {
        setSelectedFile(fileName)
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 text-white p-4">
                <h1 className="text-xl font-bold">{project?.name || 'Project'}</h1>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Code Editor Area */}
                <div className="flex-1 flex flex-col">
                    {/* Actions Bar */}
                    <div className="actions flex gap-2 items-center p-2 bg-gray-100 border-b">
                        
                        {/* Status Indicator */}
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                                runStatus === 'idle' ? 'bg-gray-400' :
                                runStatus === 'installing' ? 'bg-yellow-400 animate-pulse' :
                                runStatus === 'running' ? 'bg-green-400 animate-pulse' :
                                'bg-red-400'
                            }`}></div>
                            <span className="text-sm font-medium">
                                {runStatus === 'idle' ? 'Ready' :
                                 runStatus === 'installing' ? 'Installing...' :
                                 runStatus === 'running' ? 'Running' :
                                 'Error'}
                            </span>
                        </div>

                        {/* Run/Stop Button */}
                        {!isRunning ? (
                            <button
                                onClick={handleRunProject}
                                disabled={isInstalling}
                                className={`flex items-center gap-2 px-4 py-2 rounded text-white font-medium ${
                                    isInstalling 
                                        ? 'bg-yellow-500 cursor-not-allowed' 
                                        : 'bg-green-500 hover:bg-green-600'
                                }`}
                            >
                                {isInstalling ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Installing
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-play-fill"></i>
                                        Run
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleStopProject}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium"
                            >
                                <i className="ri-stop-fill"></i>
                                Stop
                            </button>
                        )}

                        {/* Logs Toggle Button */}
                        <button
                            onClick={() => setShowLogs(!showLogs)}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                        >
                            <i className="ri-terminal-line"></i>
                            Logs
                        </button>

                        {/* Chat Toggle Button */}
                        <button
                            onClick={() => setIsChatOpen(!isChatOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                            <i className="ri-chat-3-line"></i>
                            AI Chat
                        </button>
                    </div>

                    {/* File Explorer and Editor */}
                    <div className="flex-1 flex">
                        <div className="w-1/3 border-r bg-gray-50 p-4">
                            <h3 className="font-semibold mb-2">Files</h3>
                            <div className="space-y-1">
                                {Object.keys(fileTree).map((fileName) => (
                                    <div 
                                        key={fileName} 
                                        onClick={() => handleFileSelect(fileName)}
                                        className={`flex items-center gap-2 p-2 hover:bg-gray-200 rounded cursor-pointer ${
                                            selectedFile === fileName ? 'bg-blue-100' : ''
                                        }`}
                                    >
                                        <i className="ri-file-text-line"></i>
                                        <span className="text-sm">{fileName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex-1 p-4 bg-gray-900 text-white">
                            <div className="h-full font-mono text-sm">
                                <div className="bg-gray-800 px-3 py-2 mb-4 rounded">
                                    <span className="text-gray-400">{selectedFile}</span>
                                </div>
                                <pre className="whitespace-pre-wrap overflow-auto h-full">
                                    {fileTree[selectedFile]?.file?.contents || 'Select a file to view its contents'}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Logs Panel */}
                    {showLogs && (
                        <div className="logs-panel bg-black text-green-400 p-4 h-48 overflow-auto font-mono text-sm border-t">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-white font-semibold">Console Logs</h3>
                                <button
                                    onClick={() => setRunLogs([])}
                                    className="text-gray-400 hover:text-white"
                                >
                                    Clear
                                </button>
                            </div>
                            {runLogs.map((log, index) => (
                                <div key={index} className="mb-1">
                                    {log}
                                </div>
                            ))}
                            {runLogs.length === 0 && (
                                <div className="text-gray-500">No logs yet...</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Chat Panel */}
                {isChatOpen && (
                    <div className="w-1/3 border-l flex flex-col bg-white">
                        <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
                            <h3 className="font-semibold">AI Assistant</h3>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="text-white hover:bg-blue-600 rounded px-2 py-1"
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-auto p-4 space-y-3">
                            {messages.length === 0 && (
                                <div className="text-gray-500 text-center">
                                    <p>Start chatting with AI!</p>
                                    <p className="text-sm mt-2">Use @ai to get help with your code</p>
                                </div>
                            )}
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        message.sender._id === user?._id ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                            message.sender._id === user?._id
                                                ? 'bg-blue-500 text-white'
                                                : message.sender._id === 'ai'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-200 text-gray-800'
                                        }`}
                                    >
                                        <div className="text-xs opacity-75 mb-1">
                                            {message.sender.email}
                                        </div>
                                        <div className="text-sm whitespace-pre-wrap">
                                            {message.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    placeholder="Type @ai for AI help..."
                                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!currentMessage.trim()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="ri-send-plane-fill"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Preview Area */}
                <div className={`${isChatOpen ? 'w-1/3' : 'w-1/2'} border-l`}>
                    <div className="bg-gray-100 p-2 border-b">
                        <span className="text-sm font-medium">Preview</span>
                    </div>
                    <div className="h-full">
                        {iframeUrl ? (
                            <iframe
                                src={iframeUrl}
                                className="w-full h-full border-0"
                                title="Application Preview"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <i className="ri-window-line text-4xl mb-2"></i>
                                    <p>Click "Run" to see your application</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Project