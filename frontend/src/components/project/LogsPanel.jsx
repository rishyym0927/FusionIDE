import React from 'react'

const LogsPanel = ({ showLogs, runLogs, setRunLogs, isDarkMode }) => {
    if (!showLogs) return null

    return (
        <div className={`logs-panel text-green-400 border-t animate-slide-up ${
            isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-900 border-gray-300'
        }`}>
            <div className={`px-6 py-3 border-b flex justify-between items-center ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-800 border-gray-600'
            }`}>
                <div className="flex items-center gap-3">
                    <i className="ri-terminal-line text-green-400"></i>
                    <h3 className="text-white font-semibold">Console Output</h3>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                        {runLogs.length} entries
                    </span>
                </div>
                <button
                    onClick={() => setRunLogs([])}
                    className="flex items-center gap-2 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                    <i className="ri-delete-bin-line"></i>
                    Clear
                </button>
            </div>
            
            <div className="p-6 h-64 overflow-auto font-mono text-sm custom-scrollbar">
                {runLogs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <i className="ri-terminal-box-line text-3xl mb-3"></i>
                            <p>No console output yet</p>
                            <p className="text-xs mt-1">Logs will appear here when you run your project</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {runLogs.map((log, index) => (
                            <div key={index} className="flex items-start gap-3 py-1 hover:bg-gray-800 hover:bg-opacity-50 rounded px-2 -mx-2 transition-colors duration-150">
                                <span className="text-gray-500 text-xs mt-0.5 flex-shrink-0">
                                    {String(index + 1).padStart(3, '0')}
                                </span>
                                <span className="text-green-400 leading-relaxed">{log}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default LogsPanel
