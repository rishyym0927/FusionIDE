import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import { useTheme } from '../context/theme.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { user } = useContext(UserContext)
    const { isDarkMode } = useTheme()
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ projectName, setProjectName ] = useState('')
    const [ project, setProject ] = useState([])
    const [ loading, setLoading ] = useState(false)

    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        console.log({ projectName })

        setLoading(true)
        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                console.log('Project created:', res.data)
                setIsModalOpen(false)
                setProjectName('')
                // Add the new project to the existing list
                setProject(prev => [...prev, res.data])
                // Also refresh the full list to ensure consistency
                fetchProjects()
            })
            .catch((error) => {
                console.log('Error creating project:', error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const fetchProjects = () => {
        setLoading(true)
        axios.get('/projects/all')
            .then((res) => {
                console.log('Fetched projects:', res.data)
                setProject(res.data.projects || [])
            })
            .catch(err => {
                console.log('Error fetching projects:', err)
                setProject([])
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            My Projects
                        </h1>
                        <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Welcome back, {user?.email}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/profile')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            isDarkMode 
                                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        } border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                        }`}>
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        Profile
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* New Project Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={loading}
                        className={`p-6 rounded-lg border-2 border-dashed transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isDarkMode 
                                ? 'border-gray-600 bg-gray-800 text-gray-400 hover:border-blue-500 hover:text-blue-400' 
                                : 'border-gray-300 bg-white text-gray-600 hover:border-blue-500 hover:text-blue-600'
                        }`}
                    >
                        <div className="flex flex-col items-center gap-3">
                            <i className="ri-add-line text-3xl"></i>
                            <span className="font-medium">New Project</span>
                        </div>
                    </button>

                    {/* Project Cards */}
                    {Array.isArray(project) && project.map((proj) => (
                        <div 
                            key={proj._id}
                            onClick={() => {
                                navigate(`/project`, {
                                    state: { project: proj }
                                })
                            }}
                            className={`p-6 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                                isDarkMode 
                                    ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750' 
                                    : 'bg-white border border-gray-200 hover:shadow-lg'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${
                                    isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                }`}>
                                    {proj.name?.charAt(0).toUpperCase() || 'P'}
                                </div>
                                <i className={`ri-arrow-right-up-line text-lg ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}></i>
                            </div>
                            
                            <h3 className={`font-semibold text-lg mb-2 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                {proj.name}
                            </h3>
                            
                            <div className="flex items-center gap-2">
                                <i className={`ri-user-line text-sm ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}></i>
                                <span className={`text-sm ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                    {proj.users?.length || 0} collaborator{(proj.users?.length || 0) !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {!loading && (!Array.isArray(project) || project.length === 0) && (
                        <div className={`col-span-full text-center py-12 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            <i className="ri-folder-open-line text-4xl mb-4"></i>
                            <p className="text-lg mb-2">No projects yet</p>
                            <p className="text-sm">Create your first project to get started</p>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className={`p-8 rounded-lg shadow-xl w-full max-w-md mx-4 ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <h2 className={`text-2xl font-bold mb-6 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Create New Project
                            </h2>
                            <form onSubmit={createProject}>
                                <div className="mb-6">
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Project Name
                                    </label>
                                    <input
                                        onChange={(e) => setProjectName(e.target.value)}
                                        value={projectName}
                                        type="text"
                                        className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        placeholder="Enter project name"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        type="button" 
                                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                                            isDarkMode 
                                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                        onClick={() => {
                                            setIsModalOpen(false)
                                            setProjectName('')
                                        }}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating...' : 'Create Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home