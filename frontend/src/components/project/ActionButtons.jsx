import React from 'react'

const ActionButtons = ({ 
    isRunning, 
    isInstalling, 
    handleRunProject, 
    handleStopProject, 
    showLogs, 
    setShowLogs, 
    isChatOpen, 
    setIsChatOpen,
    isDarkMode 
}) => {
    return (
        <div className="flex items-center gap-3">
            {/* Run/Stop Button - Primary Action */}
            {!isRunning ? (
                <button
                    onClick={handleRunProject}
                    disabled={isInstalling}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isInstalling 
                            ? isDarkMode
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : isDarkMode
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                    {isInstalling ? (
                        <>
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>Installing...</span>
                        </>
                    ) : (
                        <>
                            <i className="ri-play-fill text-sm"></i>
                            <span>Run</span>
                        </>
                    )}
                </button>
            ) : (
                <button
                    onClick={handleStopProject}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDarkMode
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                    <i className="ri-stop-fill text-sm"></i>
                    <span>Stop</span>
                </button>
            )}

            {/* Logs Toggle Button */}
            <button
                onClick={() => setShowLogs(!showLogs)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showLogs 
                        ? isDarkMode
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-700 text-white'
                        : isDarkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
                <i className="ri-terminal-line text-sm"></i>
                <span>Logs</span>
            </button>

            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isChatOpen 
                        ? isDarkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-600 text-white'
                        : isDarkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
                <i className="ri-robot-line text-sm"></i>
                <span>AI Chat</span>
            </button>
        </div>
    )
}

export default ActionButtons
