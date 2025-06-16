import React, { useState, useEffect } from 'react'

const CodeEditor = ({ fileTree, selectedFile, isFileModified, onFileContentChange, onSaveFile, isDarkMode }) => {
    const [content, setContent] = useState('')

    useEffect(() => {
        if (selectedFile && fileTree[selectedFile]?.file?.contents !== undefined) {
            setContent(fileTree[selectedFile].file.contents)
        } else {
            setContent('')
        }
    }, [selectedFile, fileTree])

    const getLanguage = (fileName) => {
        const ext = fileName.split('.').pop()
        const langMap = {
            'js': 'JavaScript',
            'json': 'JSON',
            'html': 'HTML',
            'css': 'CSS',
            'md': 'Markdown'
        }
        return langMap[ext] || 'Text'
    }

    const handleContentChange = (e) => {
        const newContent = e.target.value
        setContent(newContent)
        if (selectedFile) {
            onFileContentChange(selectedFile, newContent)
        }
    }

    const handleKeyDown = (e) => {
        // Save with Ctrl+S
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault()
            onSaveFile()
        }
    }

    return (
        <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Editor Header */}
            <div className={`px-6 py-3 border-b flex items-center justify-between ${
                isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
            }`}>
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        {selectedFile}
                        {isFileModified && (
                            <span className="ml-1 text-orange-500">●</span>
                        )}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {isFileModified && (
                        <button
                            onClick={onSaveFile}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                            Save (Ctrl+S)
                        </button>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                        isDarkMode 
                            ? 'text-gray-400 bg-gray-700' 
                            : 'text-gray-600 bg-gray-200'
                    }`}>
                        {getLanguage(selectedFile)}
                    </span>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-hidden">
                {selectedFile && fileTree[selectedFile] ? (
                    <textarea
                        value={content}
                        onChange={handleContentChange}
                        onKeyDown={handleKeyDown}
                        className={`w-full h-full p-6 font-mono text-sm leading-relaxed resize-none border-0 outline-none ${
                            isDarkMode 
                                ? 'bg-gray-900 text-gray-300' 
                                : 'bg-white text-gray-800'
                        }`}
                        placeholder="Start typing your code here..."
                        spellCheck={false}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className={`text-center ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                            <i className="ri-file-line text-4xl mb-4"></i>
                            <p className="text-lg mb-2">No file selected</p>
                            <p className="text-sm">Choose a file from the sidebar to view its contents</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CodeEditor
