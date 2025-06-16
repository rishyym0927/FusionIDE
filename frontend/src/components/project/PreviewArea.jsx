import React from 'react'

const PreviewArea = ({ isChatOpen, iframeUrl }) => {
    return (
        <div className={`${isChatOpen ? 'flex-1' : 'w-1/2'} bg-white border-l border-gray-200 flex flex-col`}>
            {/* Preview Header */}
            <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <i className="ri-window-line text-primary-500"></i>
                    <span className="font-semibold text-gray-800">Preview</span>
                </div>
                {iframeUrl && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">Live</span>
                    </div>
                )}
            </div>

            {/* Preview Content */}
            <div className="flex-1 relative bg-gray-100">
                {iframeUrl ? (
                    <div className="h-full p-4">
                        <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
                            <iframe
                                src={iframeUrl}
                                className="w-full h-full border-0"
                                title="Application Preview"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center animate-fade-in">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="ri-play-circle-line text-gray-400 text-3xl"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to Preview</h3>
                            <p className="text-gray-500 mb-4">Click "Run" to see your application in action</p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                                <i className="ri-lightbulb-line"></i>
                                <span>Your app will appear here once it's running</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PreviewArea
