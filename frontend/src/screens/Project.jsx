import React, { useState, useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import { useTheme } from '../context/theme.context'
import { useWebContainer } from '../hooks/useWebContainer'
import { useSocket } from '../hooks/useSocket'
import { useProject } from '../hooks/useProject'
import { useFileOperations } from '../hooks/useFileOperations'
import { useProjectLoader } from '../hooks/useProjectLoader'

// Import components
import StatusIndicator from '../components/project/StatusIndicator'
import ActionButtons from '../components/project/ActionButtons'
import FileExplorer from '../components/project/FileExplorer'
import CodeEditor from '../components/project/CodeEditor'
import LogsPanel from '../components/project/LogsPanel'
import ChatPanel from '../components/project/ChatPanel'
import PreviewArea from '../components/project/PreviewArea'
import CollaboratorPanel from '../components/project/CollaboratorPanel'

const Project = () => {
    // Basic state
    const [showLogs, setShowLogs] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [currentMessage, setCurrentMessage] = useState('')
    const [projectData, setProjectData] = useState(null)

    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()
    const { project: locationProject } = location.state || {}
    
    // Use project from location.state or create a basic project object with ID from params
    const project = locationProject || { _id: params.projectId, name: 'Loading...' }
    
    const { user } = useContext(UserContext)
    const { isDarkMode } = useTheme()

    // Custom hooks
    const {
        fileTree,
        setFileTree,
        selectedFile,
        setSelectedFile,
        isFileModified,
        setIsFileModified,
        autoSaveFileTree,
        handleSaveFile
    } = useProject(project)

    const fileOperations = useFileOperations({
        fileTree,
        setFileTree,
        selectedFile,
        setSelectedFile,
        setIsFileModified,
        autoSaveFileTree
    })

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

    // Load project data - pass setProjectData to update project info
    useProjectLoader(project, setFileTree, setSelectedFile, autoSaveFileTree, setProjectData)

    const handleRunProjectClick = () => {
        // Ensure we're using the most current file tree
        console.log('Running project with current file tree:', fileTree)
        setRunLogs(prev => [...prev, '[Info] Preparing to run project with latest changes...'])
        handleRunProject(fileTree)
    }

    const handleSendMessageClick = (e) => {
        e.preventDefault()
        handleSendMessage(currentMessage, setCurrentMessage)
    }

    // Use projectData if available, otherwise fall back to project
    const displayProject = projectData || project

    return (
        <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Modern Header */}
            <div className={`border-b ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <div className="px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isDarkMode 
                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <i className="ri-arrow-left-line text-sm"></i>
                                Back
                            </button>
                            
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                    <i className={`ri-code-box-line text-sm ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}></i>
                                </div>
                                <div>
                                    <h1 className={`text-lg font-semibold ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>{displayProject?.name || 'Untitled Project'}</h1>
                                    <p className={`text-xs ${
                                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                    }`}>Development Environment</p>
                                </div>
                            </div>
                            
                            <StatusIndicator runStatus={runStatus} isDarkMode={isDarkMode} />
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <CollaboratorPanel 
                                project={displayProject}
                                isDarkMode={isDarkMode}
                            />
                            
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
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Sidebar - File Explorer */}
                <FileExplorer 
                    fileTree={fileTree}
                    selectedFile={selectedFile}
                    handleFileSelect={fileOperations.handleFileSelect}
                    handleCreateFile={fileOperations.handleCreateFile}
                    handleDeleteFile={fileOperations.handleDeleteFile}
                    isDarkMode={isDarkMode}
                />

                {/* Center - Code Editor */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <CodeEditor 
                        fileTree={fileTree}
                        selectedFile={selectedFile}
                        isFileModified={isFileModified}
                        onFileContentChange={fileOperations.handleFileContentChange}
                        onSaveFile={handleSaveFile}
                        isDarkMode={isDarkMode}
                    />
                    
                    {/* Logs Panel */}
                    {showLogs && (
                        <LogsPanel 
                            showLogs={showLogs}
                            runLogs={runLogs}
                            setRunLogs={setRunLogs}
                            isDarkMode={isDarkMode}
                        />
                    )}
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