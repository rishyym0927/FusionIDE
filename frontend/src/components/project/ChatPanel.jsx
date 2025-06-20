import React, { useRef, useEffect } from 'react'

const ChatPanel = ({ 
    isChatOpen, 
    setIsChatOpen, 
    messages, 
    currentMessage, 
    setCurrentMessage, 
    handleSendMessage, 
    user,
    isDarkMode 
}) => {
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    if (!isChatOpen) return null

    return (
        <div className={`w-80 border-l flex flex-col animate-slide-up shadow-xl ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <i className="ri-robot-line text-sm"></i>
                    </div>
                    <div>
                        <h3 className="font-semibold">AI Assistant</h3>
                        <p className="text-xs opacity-90">Online</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsChatOpen(false)}
                    className="w-8 h-8 hover:bg-white hover:bg-opacity-20 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                    <i className="ri-close-line"></i>
                </button>
            </div>
            
            {/* Messages Area */}
            <div className={`flex-1 overflow-auto p-4 space-y-4 custom-scrollbar ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
                {messages.length === 0 && (
                    <div className="text-center py-8 animate-fade-in">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                            isDarkMode ? 'bg-primary-900' : 'bg-primary-100'
                        }`}>
                            <i className={`ri-chat-smile-2-line text-2xl ${
                                isDarkMode ? 'text-primary-400' : 'text-primary-500'
                            }`}></i>
                        </div>
                        <p className={`font-medium mb-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>Start chatting with AI!</p>
                        <p className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Use @ai to get help with your code</p>
                    </div>
                )}
                
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex animate-fade-in ${
                            message.sender._id === user?._id ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div className={`flex gap-2 max-w-xs ${
                            message.sender._id === user?._id ? 'flex-row-reverse' : 'flex-row'
                        }`}>
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                                message.sender._id === user?._id
                                    ? 'bg-primary-500 text-white'
                                    : message.sender._id === 'ai'
                                    ? (isDarkMode ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-600')
                                    : (isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600')
                            }`}>
                                {message.sender._id === 'ai' ? 'AI' : message.sender.email?.charAt(0).toUpperCase()}
                            </div>
                            
                            {/* Message Bubble */}
                            <div className={`px-4 py-2 rounded-2xl shadow-sm ${
                                message.sender._id === user?._id
                                    ? 'bg-primary-500 text-white rounded-br-md'
                                    : message.sender._id === 'ai'
                                    ? (isDarkMode 
                                        ? 'bg-gray-700 border border-green-700 text-gray-200 rounded-bl-md' 
                                        : 'bg-white border border-green-200 text-gray-800 rounded-bl-md'
                                    )
                                    : (isDarkMode 
                                        ? 'bg-gray-700 border border-gray-600 text-gray-200 rounded-bl-md' 
                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                                    )
                            }`}>
                                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {message.message}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className={`p-4 border-t ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Type @ai for AI help..."
                        className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                            isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900'
                        }`}
                    />
                    <button
                        type="submit"
                        disabled={!currentMessage.trim()}
                        className="w-12 h-12 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center btn-hover"
                    >
                        <i className="ri-send-plane-fill"></i>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChatPanel
