import React, { useState } from 'react'

const FileExplorer = ({ fileTree, selectedFile, handleFileSelect, handleCreateFile, handleDeleteFile, isDarkMode }) => {
    const [isCreating, setIsCreating] = useState(false)
    const [newFileName, setNewFileName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop()
        switch (ext) {
            case 'js': return 'ri-javascript-fill text-yellow-500'
            case 'jsx': return 'ri-reactjs-line text-blue-400'
            case 'ts': return 'ri-file-code-line text-blue-600'
            case 'tsx': return 'ri-file-code-line text-blue-500'
            case 'json': return 'ri-brackets-line text-yellow-600'
            case 'html': return 'ri-html5-line text-orange-500'
            case 'css': return 'ri-css3-line text-blue-500'
            case 'scss': return 'ri-css3-line text-pink-500'
            case 'md': return 'ri-markdown-line text-blue-600'
            case 'py': return 'ri-file-code-line text-green-500'
            case 'java': return 'ri-file-code-line text-red-600'
            default: return 'ri-file-text-line text-gray-500'
        }
    }

    const handleCreateFileSubmit = async (e) => {
        e.preventDefault()
        if (newFileName.trim()) {
            setIsLoading(true)
            try {
                await handleCreateFile(newFileName.trim())
                setNewFileName('')
                setIsCreating(false)
            } catch (error) {
                console.error('Error creating file:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleDeleteFileClick = async (e, fileName) => {
        e.stopPropagation()
        if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
            setIsLoading(true)
            try {
                await handleDeleteFile(fileName)
            } catch (error) {
                console.error('Error deleting file:', error)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <div className={`w-72 border-r flex flex-col shadow-lg ${
            isDarkMode 
                ? 'bg-gray-900 border-gray-700 shadow-gray-900/20' 
                : 'bg-white border-gray-200 shadow-gray-200/50'
        }`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b ${
                isDarkMode 
                    ? 'bg-gray-900 border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
            }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white shadow-sm'
                        }`}>
                            <i className={`ri-folder-3-line text-lg ${
                                isDarkMode ? 'text-primary-400' : 'text-primary-600'
                            }`}></i>
                        </div>
                        <div>
                            <h3 className={`font-semibold text-base ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>Project Files</h3>
                            <p className={`text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>Explorer</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className={`p-2.5 rounded-lg transition-all duration-200 ${
                            isDarkMode 
                                ? 'text-gray-400 hover:text-white hover:bg-gray-800 hover:shadow-lg' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 hover:shadow-md'
                        }`}
                        title="Create New File"
                    >
                        <i className="ri-add-line text-lg"></i>
                    </button>
                </div>
            </div>

            {/* File List */}
            <div className="flex-1 p-4 space-y-2 custom-scrollbar overflow-auto">
                {/* New File Input */}
                {isCreating && (
                    <div className={`p-3 rounded-lg border-2 border-dashed mb-4 ${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-600' 
                            : 'bg-blue-50 border-blue-200'
                    }`}>
                        <form onSubmit={handleCreateFileSubmit}>
                            <div className="flex items-center gap-2 mb-2">
                                <i className={`ri-file-add-line ${
                                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                }`}></i>
                                <span className={`text-sm font-medium ${
                                    isDarkMode ? 'text-blue-400' : 'text-blue-700'
                                }`}>New File</span>
                            </div>
                            <input
                                type="text"
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                                placeholder="Enter filename with extension..."
                                className={`w-full px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                                    isDarkMode 
                                        ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-800' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-gray-50'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                autoFocus
                                disabled={isLoading}
                                onBlur={() => {
                                    if (!newFileName.trim() && !isLoading) {
                                        setIsCreating(false)
                                    }
                                }}
                            />
                            {isLoading && (
                                <div className="flex items-center gap-2 mt-2 text-xs">
                                    <i className={`ri-loader-4-line animate-spin ${
                                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                    }`}></i>
                                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                        Creating file...
                                    </span>
                                </div>
                            )}
                        </form>
                    </div>
                )}

                {/* File Items */}
                {Object.keys(fileTree).length === 0 ? (
                    <div className={`text-center py-8 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                        <i className="ri-folder-open-line text-3xl mb-2 block"></i>
                        <p className="text-sm">No files yet</p>
                        <p className="text-xs mt-1">Create your first file</p>
                    </div>
                ) : (
                    Object.keys(fileTree).map((fileName) => (
                        <div key={fileName} className="group relative">
                            <button
                                onClick={() => {
                                    console.log('FileExplorer: File clicked:', fileName)
                                    console.log('FileExplorer: Current selectedFile:', selectedFile)
                                    console.log('FileExplorer: Available files:', Object.keys(fileTree))
                                    handleFileSelect(fileName)
                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 relative overflow-hidden ${
                                    selectedFile === fileName 
                                        ? (isDarkMode 
                                            ? 'bg-gradient-to-r from-primary-900 to-primary-800 border border-primary-700 text-white shadow-lg transform scale-[1.02]' 
                                            : 'bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 text-primary-900 shadow-md transform scale-[1.02]'
                                        )
                                        : (isDarkMode 
                                            ? 'text-gray-300 hover:text-white hover:bg-gray-800 hover:shadow-lg hover:transform hover:scale-[1.01]' 
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md hover:transform hover:scale-[1.01]'
                                        )
                                } ${selectedFile === fileName ? 'ring-2 ring-primary-500/20' : ''}`}
                            >
                                <div className={`p-1.5 rounded-lg ${
                                    selectedFile === fileName 
                                        ? (isDarkMode ? 'bg-primary-800' : 'bg-white/80')
                                        : (isDarkMode ? 'bg-gray-700' : 'bg-gray-100')
                                }`}>
                                    <i className={`${getFileIcon(fileName)} text-sm`}></i>
                                </div>
                                <span className="text-sm font-medium truncate flex-1">{fileName}</span>
                                {selectedFile === fileName && (
                                    <>
                                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                                            isDarkMode ? 'bg-primary-400' : 'bg-primary-600'
                                        }`}></div>
                                        <div className={`absolute inset-0 bg-gradient-to-r opacity-10 ${
                                            isDarkMode 
                                                ? 'from-primary-400 to-transparent' 
                                                : 'from-primary-500 to-transparent'
                                        }`}></div>
                                    </>
                                )}
                            </button>
                            
                            {/* Delete Button */}
                            <button
                                onClick={(e) => handleDeleteFileClick(e, fileName)}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                                    isDarkMode 
                                        ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30 hover:shadow-lg' 
                                        : 'text-gray-500 hover:text-red-600 hover:bg-red-50 hover:shadow-md'
                                }`}
                                title="Delete File"
                            >
                                <i className="ri-delete-bin-7-line text-xs"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t ${
                isDarkMode 
                    ? 'bg-gray-900 border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
            }`}>
                <div className="flex items-center justify-between">
                    <div className={`text-xs flex items-center gap-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        <div className={`p-1.5 rounded ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <i className="ri-file-list-3-line text-xs"></i>
                        </div>
                        <span className="font-medium">
                            {Object.keys(fileTree).length} file{Object.keys(fileTree).length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    {isLoading && (
                        <div className="flex items-center gap-2">
                            <i className={`ri-loader-4-line animate-spin text-xs ${
                                isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}></i>
                            <span className={`text-xs ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>Saving...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileExplorer
