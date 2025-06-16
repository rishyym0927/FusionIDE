import React, { useState, useEffect } from 'react'

const PreviewArea = ({ isChatOpen, iframeUrl, isDarkMode }) => {
    const [currentUrl, setCurrentUrl] = useState('')
    const [inputUrl, setInputUrl] = useState('')

    useEffect(() => {
        if (iframeUrl) {
            setCurrentUrl(iframeUrl)
            setInputUrl(iframeUrl)
        }
    }, [iframeUrl])

    const handleUrlChange = (e) => {
        setInputUrl(e.target.value)
    }

    const handleNavigate = (e) => {
        e.preventDefault()
        let url = inputUrl.trim()
        
        // If it's a relative path, append to base URL
        if (url.startsWith('/') && iframeUrl) {
            const baseUrl = new URL(iframeUrl).origin
            url = baseUrl + url
        }
        // If it doesn't have protocol, assume it's a path
        else if (!url.startsWith('http') && iframeUrl) {
            const baseUrl = new URL(iframeUrl).origin
            url = baseUrl + (url.startsWith('/') ? url : '/' + url)
        }
        
        setCurrentUrl(url)
    }

    const handleRefresh = () => {
        setCurrentUrl(prev => prev + '?refresh=' + Date.now())
    }

    const handleGoBack = () => {
        const iframe = document.getElementById('preview-iframe')
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.history.back()
        }
    }

    const handleGoForward = () => {
        const iframe = document.getElementById('preview-iframe')
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.history.forward()
        }
    }

    return (
        <div className={`${isChatOpen ? 'w-3/5' : 'w-96'} ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-l flex flex-col`}>
            {/* Preview Header */}
            <div className={`p-4 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
                <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                    }`}>
                        <i className={`ri-global-line text-sm ${
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}></i>
                    </div>
                    <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Preview</h3>
                </div>
                
                {/* Navigation Controls */}
                <div className="flex items-center gap-2 mb-2">
                    <button
                        onClick={handleGoBack}
                        className={`p-2 rounded-md transition-colors ${
                            isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Go Back"
                    >
                        <i className="ri-arrow-left-line text-sm"></i>
                    </button>
                    
                    <button
                        onClick={handleGoForward}
                        className={`p-2 rounded-md transition-colors ${
                            isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Go Forward"
                    >
                        <i className="ri-arrow-right-line text-sm"></i>
                    </button>
                    
                    <button
                        onClick={handleRefresh}
                        className={`p-2 rounded-md transition-colors ${
                            isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Refresh"
                    >
                        <i className="ri-refresh-line text-sm"></i>
                    </button>
                </div>

                {/* URL Input */}
                <form onSubmit={handleNavigate} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={handleUrlChange}
                            placeholder="Enter URL or path (e.g., /api/users)"
                            className={`w-full px-3 py-2 rounded-md border text-sm ${
                                isDarkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                        Go
                    </button>
                </form>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-hidden">
                {currentUrl ? (
                    <iframe
                        id="preview-iframe"
                        src={currentUrl}
                        className="w-full h-full border-0"
                        title="Project Preview"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                    />
                ) : (
                    <div className={`h-full flex flex-col items-center justify-center ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        <i className="ri-global-line text-4xl mb-4"></i>
                        <p className="text-center">
                            Start your project to see the preview
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PreviewArea
