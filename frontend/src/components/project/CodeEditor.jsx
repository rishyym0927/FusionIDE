import React, { useState, useEffect, useRef } from 'react'

const CodeEditor = ({ fileTree, selectedFile, isFileModified, onFileContentChange, onSaveFile, isDarkMode }) => {
    const [content, setContent] = useState('')
    const textareaRef = useRef(null)
    const lineNumbersRef = useRef(null)

    useEffect(() => {
        console.log('CodeEditor: selectedFile changed to:', selectedFile)
        console.log('CodeEditor: fileTree keys:', Object.keys(fileTree))
        
        if (selectedFile && fileTree[selectedFile]?.file?.contents !== undefined) {
            console.log('CodeEditor: Setting content for file:', selectedFile)
            setContent(fileTree[selectedFile].file.contents)
        } else if (selectedFile) {
            console.log('CodeEditor: File not found in fileTree:', selectedFile)
            setContent('')
        } else {
            console.log('CodeEditor: No file selected')
            setContent('')
        }
    }, [selectedFile, fileTree])

    const getLanguage = (fileName) => {
        if (!fileName) return 'Text'
        const ext = fileName.split('.').pop()
        const langMap = {
            'js': 'JavaScript',
            'jsx': 'React',
            'ts': 'TypeScript',
            'tsx': 'React TypeScript',
            'json': 'JSON',
            'html': 'HTML',
            'css': 'CSS',
            'scss': 'SCSS',
            'md': 'Markdown',
            'py': 'Python',
            'java': 'Java',
            'cpp': 'C++',
            'c': 'C'
        }
        return langMap[ext] || 'Text'
    }

    const getLanguageIcon = (fileName) => {
        if (!fileName) return '📄'
        const ext = fileName.split('.').pop()
        const iconMap = {
            'js': '📄',
            'jsx': '⚛️',
            'ts': '🔷',
            'tsx': '⚛️',
            'json': '📋',
            'html': '🌐',
            'css': '🎨',
            'scss': '🎨',
            'md': '📝',
            'py': '🐍',
            'java': '☕',
            'cpp': '⚙️',
            'c': '⚙️'
        }
        return iconMap[ext] || '📄'
    }

    const handleContentChange = (e) => {
        const newContent = e.target.value
        setContent(newContent)
        updateLineNumbers(newContent)
        if (selectedFile) {
            onFileContentChange(selectedFile, newContent)
        }
    }

    const updateLineNumbers = (text) => {
        const lines = text.split('\n').length
        if (lineNumbersRef.current) {
            lineNumbersRef.current.innerHTML = Array.from(
                { length: lines },
                (_, i) => `<div class="line-number">${i + 1}</div>`
            ).join('')
        }
    }

    const handleScroll = (e) => {
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = e.target.scrollTop
        }
    }

    const handleKeyDown = (e) => {
        // Save with Ctrl+S
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault()
            onSaveFile()
        }
        
        // Tab handling for better indentation
        if (e.key === 'Tab') {
            e.preventDefault()
            const start = e.target.selectionStart
            const end = e.target.selectionEnd
            const newContent = content.substring(0, start) + '    ' + content.substring(end)
            setContent(newContent)
            onFileContentChange(selectedFile, newContent)
            
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4
            }, 0)
        }
    }

    useEffect(() => {
        updateLineNumbers(content)
    }, [content])

    const getFileSize = () => {
        return new Blob([content]).size
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    return (
        <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'} relative min-h-0`}>
            {/* Editor Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between flex-shrink-0 ${
                isDarkMode 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
            }`}>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                    </div>
                    {selectedFile && (
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{getLanguageIcon(selectedFile)}</span>
                            <span className={`text-sm font-medium ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                {selectedFile}
                                {isFileModified && (
                                    <span className="ml-2 w-2 h-2 bg-orange-500 rounded-full inline-block animate-pulse"></span>
                                )}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {selectedFile && (
                        <div className={`text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            {content.split('\n').length} lines • {formatFileSize(getFileSize())}
                        </div>
                    )}
                    {isFileModified && (
                        <button
                            onClick={onSaveFile}
                            className="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            💾 Save (Ctrl+S)
                        </button>
                    )}
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                        isDarkMode 
                            ? 'text-blue-300 bg-blue-900/30 border border-blue-700/30' 
                            : 'text-blue-700 bg-blue-50 border border-blue-200'
                    }`}>
                        {getLanguage(selectedFile)}
                    </span>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 min-h-0 relative">
                {selectedFile && fileTree[selectedFile] ? (
                    <div className="flex h-full">
                        {/* Line Numbers */}
                        <div 
                            ref={lineNumbersRef}
                            className={`w-16 overflow-hidden select-none flex-shrink-0 ${
                                isDarkMode 
                                    ? 'bg-gray-800 text-gray-500 border-r border-gray-700' 
                                    : 'bg-gray-50 text-gray-400 border-r border-gray-200'
                            }`}
                            style={{
                                fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                                fontSize: '13px',
                                lineHeight: '1.5',
                                paddingTop: '24px',
                                textAlign: 'right',
                                paddingRight: '12px'
                            }}
                        >
                            <div className="line-number">1</div>
                        </div>
                        
                        {/* Code Area */}
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={handleContentChange}
                            onKeyDown={handleKeyDown}
                            onScroll={handleScroll}
                            className={`flex-1 p-6 resize-none border-0 outline-none custom-scrollbar ${
                                isDarkMode 
                                    ? 'bg-gray-900 text-gray-300 caret-blue-400' 
                                    : 'bg-white text-gray-800 caret-blue-600'
                            }`}
                            style={{
                                fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                tabSize: 4,
                                minHeight: '100%',
                                maxHeight: 'none'
                            }}
                            placeholder="// Start coding here..."
                            spellCheck={false}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className={`text-center max-w-md ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                            }`}>
                                <i className="ri-code-line text-3xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Ready to Code</h3>
                            <p className="text-sm leading-relaxed">
                                Select a file from the sidebar to start editing.<br/>
                                Your changes will be saved automatically.
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Status Bar */}
            {selectedFile && (
                <div className={`px-6 py-2 border-t flex items-center justify-between text-xs flex-shrink-0 ${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-gray-400' 
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}>
                    <div className="flex items-center gap-4">
                        <span>Ln {content.split('\n').length}, Col 1</span>
                        <span>Spaces: 4</span>
                        <span>UTF-8</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isFileModified ? (
                            <span className="text-orange-500">● Unsaved changes</span>
                        ) : (
                            <span className="text-green-500">✓ All changes saved</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CodeEditor
