import React from 'react'

const StatusIndicator = ({ runStatus, isDarkMode }) => {
    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
                runStatus === 'idle' ? 'bg-gray-400' :
                runStatus === 'installing' ? 'bg-yellow-400 animate-pulse' :
                runStatus === 'running' ? 'bg-green-400 animate-pulse' :
                'bg-red-400'
            }`}></div>
            <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
                {runStatus === 'idle' ? 'Ready' :
                 runStatus === 'installing' ? 'Installing...' :
                 runStatus === 'running' ? 'Running' :
                 'Error'}
            </span>
        </div>
    )
}

export default StatusIndicator
