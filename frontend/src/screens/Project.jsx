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
import CollaboratorPanel from '../components/project/CollaboratorPanel'

const Project = () => {
    // Basic state
    const [showLogs, setShowLogs] = useState(false)
    const [fileTree, setFileTree] = useState({})
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [currentMessage, setCurrentMessage] = useState('')
    const [selectedFile, setSelectedFile] = useState('README.md')
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
        const loadProjectFileTree = async () => {
            if (project?._id) {
                try {
                    // Fetch the latest file tree from backend
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${project._id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (response.ok) {
                        const projectData = await response.json();
                        if (projectData.fileTree && Object.keys(projectData.fileTree).length > 0) {
                            setFileTree(projectData.fileTree);
                            // Set selectedFile to first available file
                            const files = Object.keys(projectData.fileTree);
                            if (files.length > 0) {
                                if (projectData.fileTree['README.md']) {
                                    setSelectedFile('README.md');
                                } else {
                                    setSelectedFile(files[0]);
                                }
                            }
                            return; // Exit early if we loaded from backend
                        }
                    }
                } catch (error) {
                    console.error('Error loading project file tree:', error);
                }
            }

            // Fallback to project state or default README
            if (project?.fileTree && Object.keys(project.fileTree).length > 0) {
                setFileTree(project.fileTree);
                const files = Object.keys(project.fileTree);
                if (files.length > 0) {
                    if (project.fileTree['README.md']) {
                        setSelectedFile('README.md');
                    } else {
                        setSelectedFile(files[0]);
                    }
                }
            } else {
                // Default README.md file with comprehensive instructions
                const defaultFileTree = {
                    "README.md": {
                        "file": {
                            "contents": `# Welcome to Your Collaborative Development Environment

## 🚀 Getting Started

Welcome to your interactive development workspace! This platform provides a complete collaborative coding environment with real-time features and integrated tools.

## 📋 Platform Features

### 1. **File Management**
- **Create Files**: Click the "+" button in the file explorer to create new files
- **Delete Files**: Right-click on any file and select delete, or use the delete button
- **File Types**: Supports all common file types (JS, HTML, CSS, JSON, MD, etc.)
- **Auto-Save**: Your changes are automatically saved as you type

### 2. **Code Editor**
- **Syntax Highlighting**: Full syntax highlighting for multiple programming languages
- **Auto-Completion**: Intelligent code completion and suggestions
- **Keyboard Shortcuts**: 
  - \`Ctrl/Cmd + S\`: Save file
  - \`Ctrl/Cmd + Z\`: Undo
  - \`Ctrl/Cmd + Y\`: Redo
  - \`Ctrl/Cmd + F\`: Find in file
- **Line Numbers**: Navigate easily with line number references
- **Code Folding**: Collapse and expand code blocks

### 3. **Project Execution**
- **Run Button**: Execute your project with a single click
- **Stop Button**: Terminate running processes
- **Live Preview**: See your application running in real-time
- **Status Indicators**: Visual feedback on project status (Running, Stopped, Installing)

### 4. **Collaboration Features**
- **Real-Time Chat**: Communicate with team members instantly
- **Live Collaboration**: See changes from other developers in real-time
- **User Presence**: Know who's currently working on the project
- **Message History**: Access previous conversations and discussions

### 5. **Development Tools**
- **Console Logs**: View application output and debug information
- **Error Tracking**: Monitor and debug runtime errors
- **Process Management**: Control application lifecycle
- **Integrated Terminal**: Access to command-line tools

## 🛠️ How to Use This Platform

### Creating Your First Project

1. **Set Up Your Files**
   - Delete this README.md file when you're ready to start coding
   - Create your main application file (e.g., \`app.js\`, \`index.html\`)
   - Add a \`package.json\` if you're building a Node.js application

2. **Example Node.js Setup**
   \`\`\`json
   // package.json
   {
     "name": "my-project",
     "version": "1.0.0",
     "main": "app.js",
     "scripts": {
       "start": "node app.js"
     },
     "dependencies": {
       "express": "^4.18.2"
     }
   }
   \`\`\`

3. **Example Express Server**
   \`\`\`javascript
   // app.js
   import express from 'express';
   const app = express();
   const PORT = 3000;

   app.get('/', (req, res) => {
     res.send('Hello World!');
   });

   app.listen(PORT, () => {
     console.log(\`Server running on port \${PORT}\`);
   });
   \`\`\`

### Running Your Project

1. **Click the "Run" button** in the top toolbar
2. **Monitor the logs** panel for output and errors
3. **View your application** in the preview panel on the right
4. **Stop the project** when you need to make changes

### Collaborating with Others

1. **Share your project** with team members
2. **Use the chat panel** to communicate in real-time
3. **See live updates** as others make changes
4. **Coordinate work** through the collaboration features

## 🎯 Best Practices

### Code Organization
- Use meaningful file and folder names
- Keep related files together
- Comment your code for better collaboration
- Follow consistent coding standards

### Collaboration Tips
- Communicate changes through chat before making major edits
- Use descriptive commit messages
- Test your code before sharing
- Respect others' work and coordinate conflicts

### Performance Optimization
- Keep file sizes reasonable for better loading times
- Use efficient coding practices
- Monitor console logs for performance issues
- Clean up unused files and dependencies

## 🔧 Troubleshooting

### Common Issues

**Project Won't Start**
- Check your \`package.json\` syntax
- Ensure all dependencies are properly defined
- Look for syntax errors in your main file

**Files Not Saving**
- Check your internet connection
- Ensure you have proper permissions
- Try refreshing the page if issues persist

**Collaboration Issues**
- Verify all team members have access
- Check that real-time updates are working
- Restart the project if sync issues occur

### Getting Help
- Use the chat feature to ask team members for help
- Check the console logs for detailed error messages
- Review your code for syntax errors
- Ensure all required files are present

## 📚 Supported Technologies

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- React, Vue.js, Angular
- Bootstrap, Tailwind CSS
- jQuery and other libraries

### Backend
- Node.js with Express
- Python with Flask/Django
- PHP applications
- Static file serving

### Databases & APIs
- REST API integration
- JSON data handling
- LocalStorage for client-side data
- External API connections

## 🌟 Advanced Features

### Custom Configurations
- Environment variables support
- Custom build scripts
- Multi-file project structures
- Package management

### Deployment Options
- Export your project files
- Share project links
- Download complete project
- Integration with Git repositories

---

## 🎉 Ready to Start Coding?

1. **Delete this README.md file**
2. **Create your project files**
3. **Start building something amazing!**

Happy coding! 🚀

---

*This collaborative development environment is designed to make coding together seamless and enjoyable. Explore all the features and make the most of your development experience!*`
                        }
                    }
                };
                
                setFileTree(defaultFileTree);
                setSelectedFile('README.md');
                
                // Save the default file tree to backend if project exists
                if (project?._id) {
                    autoSaveFileTree(defaultFileTree);
                }
            }
        };

        loadProjectFileTree();
    }, [project])

    // Auto-save functionality with better error handling
    const autoSaveFileTree = async (newFileTree) => {
        if (!project?._id) {
            console.log('No project ID available for auto-save');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/update-filetree`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    projectId: project._id,
                    fileTree: newFileTree
                })
            });

            if (response.ok) {
                console.log('FileTree auto-saved successfully');
            } else {
                const errorData = await response.json();
                console.error('Failed to auto-save fileTree:', errorData);
            }
        } catch (error) {
            console.error('Error auto-saving fileTree:', error);
        }
    };

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
            const newFileTree = {
                ...fileTree,
                [fileName]: {
                    file: {
                        contents: ''
                    }
                }
            };
            setFileTree(newFileTree);
            setSelectedFile(fileName);
            
            // Auto-save immediately after creating file
            autoSaveFileTree(newFileTree);
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
            
            // Auto-save immediately after deleting file
            autoSaveFileTree(newFileTree);
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
                        
                        <div className="flex items-center gap-3">
                            <CollaboratorPanel 
                                project={project}
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