import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import { useWebContainer } from '../hooks/useWebContainer'
import { useSocket } from '../hooks/useSocket'

// Import components
import StatusIndicator from '../components/project/StatusIndicator'
import ActionButtons from '../components/project/ActionButtons'
import FileExplorer from '../components/project/FileExplorer'
import CodeEditor from '../components/project/CodeEditor'
import LogsPanel from '../components/project/LogsPanel'
import ChatPanel from '../components/project/ChatPanel'
import PreviewArea from '../components/project/PreviewArea'

const Project = () => {
    // Basic state
    const [showLogs, setShowLogs] = useState(false)
    const [fileTree, setFileTree] = useState({})
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [currentMessage, setCurrentMessage] = useState('')
    const [selectedFile, setSelectedFile] = useState('app.js')

    const location = useLocation()
    const { project } = location.state || {}
    const { user } = useContext(UserContext)

    // Custom hooks
    const {
        isInstalling,
        isRunning,
        runStatus,
        runLogs,
        setRunLogs,
        iframeUrl,
        handleRunProject,
        handleStopProject
    } = useWebContainer()

    const { messages, handleSendMessage } = useSocket(project, user, setFileTree)

    // Set initial file tree
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

    const handleRunProjectClick = () => {
        handleRunProject(fileTree)
    }

    const handleFileSelect = (fileName) => {
        setSelectedFile(fileName)
    }

    const handleSendMessageClick = (e) => {
        e.preventDefault()
        handleSendMessage(currentMessage, setCurrentMessage)
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Modern Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <i className="ri-code-box-line text-primary-600 text-lg"></i>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">{project?.name || 'Untitled Project'}</h1>
                                    <p className="text-sm text-gray-500">Interactive Development Environment</p>
                                </div>
                            </div>
                            <StatusIndicator runStatus={runStatus} />
                        </div>
                        
                        <ActionButtons 
                            isRunning={isRunning}
                            isInstalling={isInstalling}
                            handleRunProject={handleRunProjectClick}
                            handleStopProject={handleStopProject}
                            showLogs={showLogs}
                            setShowLogs={setShowLogs}
                            isChatOpen={isChatOpen}
                            setIsChatOpen={setIsChatOpen}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - File Explorer */}
                <FileExplorer 
                    fileTree={fileTree}
                    selectedFile={selectedFile}
                    handleFileSelect={handleFileSelect}
                />

                {/* Center - Code Editor */}
                <div className="flex-1 flex flex-col">
                    <CodeEditor 
                        fileTree={fileTree}
                        selectedFile={selectedFile}
                    />
                    
                    {/* Logs Panel */}
                    <LogsPanel 
                        showLogs={showLogs}
                        runLogs={runLogs}
                        setRunLogs={setRunLogs}
                    />
                </div>

                {/* Right Side - Preview and Chat */}
                <div className="flex">
                    <PreviewArea 
                        isChatOpen={isChatOpen}
                        iframeUrl={iframeUrl}
                    />
                    
                    <ChatPanel 
                        isChatOpen={isChatOpen}
                        setIsChatOpen={setIsChatOpen}
                        messages={messages}
                        currentMessage={currentMessage}
                        setCurrentMessage={setCurrentMessage}
                        handleSendMessage={handleSendMessageClick}
                        user={user}
                    />
                </div>
            </div>
        </div>
    )
}

export default Project