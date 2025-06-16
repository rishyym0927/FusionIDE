import React, { useState, useEffect, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import { useTheme } from '../context/theme.context'
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
    const [isFileModified, setIsFileModified] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()
    const { project } = location.state || {}
    const { user } = useContext(UserContext)
    const { isDarkMode } = useTheme()

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
        // Ensure we're using the most current file tree
        console.log('Running project with current file tree:', fileTree)
        setRunLogs(prev => [...prev, '[Info] Preparing to run project with latest changes...'])
        handleRunProject(fileTree)
    }

    const handleFileSelect = (fileName) => {
        setSelectedFile(fileName)
        setIsFileModified(false)
    }

    const handleFileContentChange = (fileName, newContent) => {
        setFileTree(prev => ({
            ...prev,
            [fileName]: {
                ...prev[fileName],
                file: {
                    ...prev[fileName]?.file,
                    contents: newContent
                }
            }
        }))
        setIsFileModified(true)
    }

    const handleSaveFile = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/projects/update-filetree`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    projectId: project._id,
                    fileTree: fileTree
                })
            })

            if (response.ok) {
                setIsFileModified(false)
                console.log('File saved successfully')
            }
        } catch (error) {
            console.error('Error saving file:', error)
        }
    }

    const handleCreateFile = (fileName) => {
        if (fileName && !fileTree[fileName]) {
            setFileTree(prev => ({
                ...prev,
                [fileName]: {
                    file: {
                        contents: ''
                    }
                }
            }))
            setSelectedFile(fileName)
        }
    }

    const handleDeleteFile = (fileName) => {
        if (fileName && fileTree[fileName]) {
            const newFileTree = { ...fileTree }
            delete newFileTree[fileName]
            setFileTree(newFileTree)
            
            // Select another file if the deleted file was selected
            if (selectedFile === fileName) {
                const remainingFiles = Object.keys(newFileTree)
                setSelectedFile(remainingFiles.length > 0 ? remainingFiles[0] : null)
            }
        }
    }

    const handleSendMessageClick = (e) => {
        e.preventDefault()
        handleSendMessage(currentMessage, setCurrentMessage)
    }

    return (
        <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Modern Header */}
            <div className={`border-b shadow-sm ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                                    isDarkMode 
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <i className="ri-arrow-left-line"></i>
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    isDarkMode ? 'bg-primary-900' : 'bg-primary-100'
                                }`}>
                                    <i className={`ri-code-box-line text-lg ${
                                        isDarkMode ? 'text-primary-400' : 'text-primary-600'
                                    }`}></i>
                                </div>
                                <div>
                                    <h1 className={`text-xl font-bold ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>{project?.name || 'Untitled Project'}</h1>
                                    <p className={`text-sm ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>Interactive Development Environment</p>
                                </div>
                            </div>
                            <StatusIndicator runStatus={runStatus} isDarkMode={isDarkMode} />
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
                            isDarkMode={isDarkMode}
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
                    handleCreateFile={handleCreateFile}
                    handleDeleteFile={handleDeleteFile}
                    isDarkMode={isDarkMode}
                />

                {/* Center - Code Editor */}
                <div className="flex-1 flex flex-col">
                    <CodeEditor 
                        fileTree={fileTree}
                        selectedFile={selectedFile}
                        isFileModified={isFileModified}
                        onFileContentChange={handleFileContentChange}
                        onSaveFile={handleSaveFile}
                        isDarkMode={isDarkMode}
                    />
                    
                    {/* Logs Panel */}
                    <LogsPanel 
                        showLogs={showLogs}
                        runLogs={runLogs}
                        setRunLogs={setRunLogs}
                        isDarkMode={isDarkMode}
                    />
                </div>

                {/* Right Side - Preview and Chat */}
                <div className="flex">
                    <PreviewArea 
                        isChatOpen={isChatOpen}
                        iframeUrl={iframeUrl}
                        isDarkMode={isDarkMode}
                    />
                    
                    <ChatPanel 
                        isChatOpen={isChatOpen}
                        setIsChatOpen={setIsChatOpen}
                        messages={messages}
                        currentMessage={currentMessage}
                        setCurrentMessage={setCurrentMessage}
                        handleSendMessage={handleSendMessageClick}
                        user={user}
                        isDarkMode={isDarkMode}
                    />
                </div>
            </div>
        </div>
    )
}

export default Project