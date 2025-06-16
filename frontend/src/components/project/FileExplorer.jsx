import React from 'react'

const FileExplorer = ({ fileTree, selectedFile, handleFileSelect }) => {
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

    return (
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                    <i className="ri-folder-open-line text-primary-500"></i>
                    <h3 className="font-semibold text-gray-800">Files</h3>
                </div>
            </div>

            {/* File List */}
            <div className="flex-1 p-2 space-y-1 custom-scrollbar overflow-auto">
                {Object.keys(fileTree).map((fileName) => (
                    <button
                        key={fileName}
                        onClick={() => handleFileSelect(fileName)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 hover:bg-white hover:shadow-sm ${
                            selectedFile === fileName 
                                ? 'bg-primary-50 border border-primary-200 text-primary-700' 
                                : 'text-gray-700 hover:text-gray-900'
                        }`}
                    >
                        <i className={getFileIcon(fileName)}></i>
                        <span className="text-sm font-medium truncate">{fileName}</span>
                        {selectedFile === fileName && (
                            <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 bg-white">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                    <i className="ri-file-list-line"></i>
                    <span>{Object.keys(fileTree).length} files</span>
                </div>
            </div>
        </div>
    )
}

export default FileExplorer
