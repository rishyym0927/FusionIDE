import React from 'react'

const CodeEditor = ({ fileTree, selectedFile }) => {
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

    return (
        <div className="flex-1 flex flex-col bg-dark-900">
            {/* Editor Header */}
            <div className="bg-dark-800 px-6 py-3 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm font-medium">{selectedFile}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                        {getLanguage(selectedFile)}
                    </span>
                </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-6 overflow-auto custom-scrollbar">
                <div className="font-mono text-sm leading-relaxed">
                    {fileTree[selectedFile]?.file?.contents ? (
                        <pre className="text-gray-300 whitespace-pre-wrap">
                            {fileTree[selectedFile].file.contents}
                        </pre>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-gray-500">
                                <i className="ri-file-line text-4xl mb-4"></i>
                                <p className="text-lg mb-2">No file selected</p>
                                <p className="text-sm">Choose a file from the sidebar to view its contents</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CodeEditor
