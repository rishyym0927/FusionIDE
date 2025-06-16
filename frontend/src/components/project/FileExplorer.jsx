import React, { useState } from 'react'

const FileExplorer = ({ fileTree, selectedFile, handleFileSelect, handleCreateFile, handleDeleteFile, isDarkMode }) => {
    const [isCreating, setIsCreating] = useState(false)
    const [newFileName, setNewFileName] = useState('')

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop()
        switch (ext) {
            case 'js': return 'ri-javascript-fill text-yellow-500'
            case 'json': return 'ri-file-code-line text-orange-500'
            case 'html': return 'ri-html5-line text-red-500'
            case 'css': return 'ri-css3-line text-blue-500'
            case 'md': return 'ri-markdown-line text-gray-600'
            default: return 'ri-file-text-line text-gray-500'
        }
    }

    const handleCreateFileSubmit = (e) => {
        e.preventDefault()
        if (newFileName.trim()) {
            handleCreateFile(newFileName.trim())
            setNewFileName('')
            setIsCreating(false)
        }
    }

    const handleDeleteFileClick = (e, fileName) => {
        e.stopPropagation()
        if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
            handleDeleteFile(fileName)
        }
    }

    return (
        <div className={`w-64 border-r border-gray-200 flex flex-col ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
            {/* Header */}
            <div className={`p-4 border-b ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <i className={`ri-folder-open-line ${
                            isDarkMode ? 'text-primary-400' : 'text-primary-500'
                        }`}></i>
                        <h3 className={`font-semibold ${
                            isDarkMode ? 'text-white' : 'text-gray-800'
                        }`}>Files</h3>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className={`p-1 rounded transition-colors ${
                            isDarkMode 
                                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                        }`}
                        title="New File"
                    >
                        <i className="ri-add-line text-sm"></i>
                    </button>
                </div>
            </div>

            {/* File List */}
            <div className="flex-1 p-2 space-y-1 custom-scrollbar overflow-auto">
                {/* New File Input */}
                {isCreating && (
                    <form onSubmit={handleCreateFileSubmit} className="mb-2">
                        <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            placeholder="filename.ext"
                            className={`w-full px-2 py-1 text-sm rounded border ${
                                isDarkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            autoFocus
                            onBlur={() => {
                                if (!newFileName.trim()) {
                                    setIsCreating(false)
                                }
                            }}
                        />
                    </form>
                )}

                {Object.keys(fileTree).map((fileName) => (
                    <div key={fileName} className="group relative">
                        <button
                            onClick={() => handleFileSelect(fileName)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                                selectedFile === fileName 
                                    ? (isDarkMode 
                                        ? 'bg-primary-900 border border-primary-700 text-primary-300' 
                                        : 'bg-primary-50 border border-primary-200 text-primary-700'
                                    )
                                    : (isDarkMode 
                                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                                    )
                            }`}
                        >
                            <i className={getFileIcon(fileName)}></i>
                            <span className="text-sm font-medium truncate flex-1">{fileName}</span>
                            {selectedFile === fileName && (
                                <div className={`w-2 h-2 rounded-full ${
                                    isDarkMode ? 'bg-primary-400' : 'bg-primary-500'
                                }`}></div>
                            )}
                        </button>
                        
                        {/* Delete Button */}
                        <button
                            onClick={(e) => handleDeleteFileClick(e, fileName)}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                                isDarkMode 
                                    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-600' 
                                    : 'text-gray-500 hover:text-red-600 hover:bg-gray-200'
                            }`}
                            title="Delete File"
                        >
                            <i className="ri-close-line text-xs"></i>
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className={`p-3 border-t ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <div className={`text-xs flex items-center gap-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                    <i className="ri-file-list-line"></i>
                    <span>{Object.keys(fileTree).length} files</span>
                </div>
            </div>
        </div>
    )
}

export default FileExplorer
