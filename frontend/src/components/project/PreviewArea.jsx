import React, { useState, useEffect } from 'react'

const PreviewArea = ({ isChatOpen, iframeUrl, isDarkMode }) => {
    const [currentUrl, setCurrentUrl] = useState('')
    const [inputUrl, setInputUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (iframeUrl) {
            setCurrentUrl(iframeUrl)
            setInputUrl(iframeUrl)
            setError(null)
        }
    }, [iframeUrl])

    const handleUrlChange = (e) => {
        setInputUrl(e.target.value)
        setError(null)
    }

    const handleNavigate = (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        
        let url = inputUrl.trim()
        
        if (!url) {
            setError('Please enter a URL')
            setIsLoading(false)
            return
        }
        
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
        setTimeout(() => setIsLoading(false), 1000)
    }

    const handleRefresh = () => {
        setIsLoading(true)
        setError(null)
        setCurrentUrl(prev => prev + '?refresh=' + Date.now())
        setTimeout(() => setIsLoading(false), 1000)
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

    const handleIframeLoad = () => {
        setIsLoading(false)
        setError(null)
    }

    const handleIframeError = () => {
        setIsLoading(false)
        setError('Failed to load preview')
    }

    return (
        <div className={`${isChatOpen ? 'w-3/5' : 'w-96'} ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
        } border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col transition-all duration-300`}>
            {/* Modern Preview Header */}
            <div className={`px-4 py-3 border-b ${
                isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
            }`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                    } transition-colors`}>
                        <i className={`ri-global-line text-lg ${
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}></i>
                    </div>
                    <div>
                        <h3 className={`font-semibold text-base ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>Live Preview</h3>
                        <p className={`text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Real-time application preview</p>
                    </div>
                </div>
                
                {/* Enhanced Navigation Controls */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleGoBack}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                                isDarkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm'
                            } hover:scale-105 active:scale-95`}
                            title="Go Back"
                        >
                            <i className="ri-arrow-left-line text-sm"></i>
                        </button>
                        
                        <button
                            onClick={handleGoForward}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                                isDarkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm'
                            } hover:scale-105 active:scale-95`}
                            title="Go Forward"
                        >
                            <i className="ri-arrow-right-line text-sm"></i>
                        </button>
                        
                        <button
                            onClick={handleRefresh}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                                isDarkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm'
                            } hover:scale-105 active:scale-95 ${isLoading ? 'animate-spin' : ''}`}
                            title="Refresh"
                            disabled={isLoading}
                        >
                            <i className="ri-refresh-line text-sm"></i>
                        </button>
                    </div>
                </div>

                {/* Modern URL Input */}
                <form onSubmit={handleNavigate} className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                            <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                                <i className="ri-link text-sm"></i>
                            </div>
                            <input
                                type="text"
                                value={inputUrl}
                                onChange={handleUrlChange}
                                placeholder="Enter URL or path (e.g., /api/users)"
                                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-gray-50'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    error ? 'border-red-500 focus:ring-red-500' : ''
                                }`}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <i className="ri-loader-4-line animate-spin"></i>
                            ) : (
                                'Go'
                            )}
                        </button>
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-xs">
                            <i className="ri-error-warning-line"></i>
                            {error}
                        </div>
                    )}
                </form>
            </div>

            {/* Preview Content with Loading State */}
            <div className="flex-1 overflow-hidden relative">
                {isLoading && (
                    <div className={`absolute inset-0 z-10 flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-900/80' : 'bg-white/80'
                    } backdrop-blur-sm`}>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Loading preview...
                            </p>
                        </div>
                    </div>
                )}
                
                {currentUrl ? (
                    <iframe
                        id="preview-iframe"
                        src={currentUrl}
                        className="w-full h-full border-0"
                        title="Project Preview"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                    />
                ) : (
                    <div className={`h-full flex flex-col items-center justify-center p-8 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                        }`}>
                            <i className="ri-global-line text-2xl"></i>
                        </div>
                        <h4 className={`font-medium text-lg mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Preview Not Available
                        </h4>
                        <p className="text-center text-sm max-w-xs">
                            Start your project to see the live preview here
                        </p>
                        <div className={`mt-4 px-4 py-2 rounded-lg ${
                            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                        }`}>
                            <p className="text-xs">
                                💡 Click "Run Project" to get started
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PreviewArea
