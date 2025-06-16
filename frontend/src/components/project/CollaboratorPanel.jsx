import React, { useState, useEffect } from 'react'
import axios from '../../config/axios'

const CollaboratorPanel = ({ project, isDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch all users when panel opens
    useEffect(() => {
        if (isOpen) {
            fetchUsers()
        }
    }, [isOpen])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/users/all')
            setUsers(response.data.users)
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddCollaborators = async () => {
        if (selectedUsers.length === 0) return

        try {
            setLoading(true)
            await axios.put('/projects/add-user', {
                projectId: project._id,
                users: selectedUsers
            })
            
            setSelectedUsers([])
            setIsOpen(false)
            // Optionally refresh project data here
        } catch (error) {
            console.error('Error adding collaborators:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        )
    }

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.users.some(projUser => projUser._id === user._id)
    )

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 btn-hover ${
                    isDarkMode 
                        ? 'bg-purple-900 text-purple-300 hover:bg-purple-800' 
                        : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
                title="Manage Collaborators"
            >
                <i className="ri-user-add-line"></i>
                Collaborators
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className={`w-full max-w-md mx-4 rounded-lg shadow-xl ${
                        isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}>
                        {/* Header */}
                        <div className={`p-6 border-b ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <div className="flex items-center justify-between">
                                <h2 className={`text-xl font-bold ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    Add Collaborators
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                        isDarkMode 
                                            ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <i className="ri-close-line"></i>
                                </button>
                            </div>
                            <p className={`mt-2 text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                Add team members to collaborate on "{project.name}"
                            </p>
                        </div>

                        {/* Current Collaborators */}
                        <div className="p-4">
                            <h3 className={`text-sm font-medium mb-3 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Current Collaborators ({project.users.length})
                            </h3>
                            <div className="space-y-2 mb-4">
                                {project.users.map((user) => (
                                    <div key={user._id} className={`flex items-center gap-3 p-2 rounded-lg ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                            isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                        }`}>
                                            {user.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`text-sm ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            {user.email}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Search */}
                        <div className="px-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search users by email..."
                                className={`w-full px-4 py-2 rounded-lg border text-sm ${
                                    isDarkMode 
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                        </div>

                        {/* Available Users */}
                        <div className="p-4">
                            <h3 className={`text-sm font-medium mb-3 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Available Users
                            </h3>
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                        <span className={`text-sm ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>Loading users...</span>
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <p className={`text-sm text-center py-4 ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        No users found
                                    </p>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <div
                                            key={user._id}
                                            onClick={() => toggleUserSelection(user._id)}
                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                                selectedUsers.includes(user._id)
                                                    ? (isDarkMode ? 'bg-purple-900 border border-purple-700' : 'bg-purple-50 border border-purple-200')
                                                    : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                                            }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-700'
                                            }`}>
                                                {user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className={`text-sm flex-1 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                {user.email}
                                            </span>
                                            {selectedUsers.includes(user._id) && (
                                                <i className="ri-check-line text-purple-500"></i>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`p-4 border-t ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                        isDarkMode 
                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddCollaborators}
                                    disabled={selectedUsers.length === 0 || loading}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Adding...' : `Add ${selectedUsers.length} User${selectedUsers.length !== 1 ? 's' : ''}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CollaboratorPanel
