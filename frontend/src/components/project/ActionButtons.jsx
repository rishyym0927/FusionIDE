import React from 'react'

const ActionButtons = ({ 
    isRunning, 
    isInstalling, 
    handleRunProject, 
    handleStopProject, 
    showLogs, 
    setShowLogs, 
    isChatOpen, 
    setIsChatOpen 
}) => {
    return (
        <div className="flex items-center gap-3">
            {/* Run/Stop Button */}
            {!isRunning ? (
                <button
                    onClick={handleRunProject}
                    disabled={isInstalling}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-200 ${
                        isInstalling 
                            ? 'bg-yellow-500 cursor-not-allowed' 
                            : 'bg-green-500 hover:bg-green-600 btn-hover shadow-lg hover:shadow-green-200'
                    }`}
                >
                    {isInstalling ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Installing...
                        </>
                    ) : (
                        <>
                            <i className="ri-play-fill"></i>
                            Run Project
                        </>
                    )}
                </button>
            ) : (
                <button
                    onClick={handleStopProject}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium btn-hover shadow-lg hover:shadow-red-200 transition-all duration-200"
                >
                    <i className="ri-stop-fill"></i>
                    Stop
                </button>
            )}

            {/* Logs Toggle Button */}
            <button
                onClick={() => setShowLogs(!showLogs)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 btn-hover ${
                    showLogs 
                        ? 'bg-gray-700 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                <i className="ri-terminal-line"></i>
                Logs
            </button>

            {/* Chat Toggle Button */}
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 btn-hover ${
                    isChatOpen 
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' 
                        : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                }`}
            >
                <i className="ri-chat-3-line"></i>
                AI Assistant
            </button>
        </div>
    )
}

export default ActionButtons
