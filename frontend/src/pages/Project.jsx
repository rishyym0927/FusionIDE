import React, { useState, useEffect } from 'react'
import axios from '../../config/axios'
import CollaboratorPanel from './CollaboratorPanel'

const Project = ({ projectId, isDarkMode }) => {
    const [project, setProject] = useState(null)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`/projects/${projectId}`)
                setProject(response.data)
            } catch (error) {
                console.error('Error fetching project data:', error)
            }
        }

        fetchProject()
    }, [projectId])

    const refreshProjectData = async () => {
        try {
            const response = await axios.get(`/projects/${projectId}`)
            setProject(response.data)
        } catch (error) {
            console.error('Error refreshing project data:', error)
        }
    }

    if (!project) return null

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
            {/* ...existing code... */}
            
            <CollaboratorPanel 
                project={project} 
                isDarkMode={isDarkMode}
                onProjectUpdate={refreshProjectData}
            />
            
            {/* ...existing code... */}
        </div>
    )
}

export default Project