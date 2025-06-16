import { useEffect, useRef } from 'react'
import { getDefaultFileTree } from '../utils/defaultFileTree'

export const useProjectLoader = (project, setFileTree, setSelectedFile, autoSaveFileTree, setProjectData) => {
    const hasInitialized = useRef(false)

    useEffect(() => {
        if (hasInitialized.current) return // Prevent multiple initializations

        const loadProjectFileTree = async () => {
            if (project?._id) {
                try {
                    // Fetch the latest project data from backend
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${project._id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })

                    if (response.ok) {
                        const responseData = await response.json()
                        const projectData = responseData.project || responseData
                        
                        // Update project data for display
                        if (setProjectData) {
                            setProjectData(projectData)
                        }
                        
                        // Handle fileTree loading
                        if (projectData.fileTree && Object.keys(projectData.fileTree).length > 0) {
                            console.log('Loading fileTree from database:', projectData.fileTree)
                            setFileTree(projectData.fileTree)
                            
                            // Set selected file
                            const files = Object.keys(projectData.fileTree)
                            if (files.length > 0) {
                                const preferredFile = files.includes('README.md') ? 'README.md' : files[0]
                                setSelectedFile(preferredFile)
                            }
                            hasInitialized.current = true
                            return // Exit early if we loaded from backend
                        } else {
                            console.log('No fileTree found in database, creating default')
                            // Create default fileTree if none exists
                            const defaultFileTree = getDefaultFileTree()
                            setFileTree(defaultFileTree)
                            setSelectedFile('README.md')
                            
                            // Save the default file tree to backend
                            await autoSaveFileTree(defaultFileTree)
                            hasInitialized.current = true
                            return
                        }
                    } else {
                        console.error('Failed to load project data:', response.status)
                    }
                } catch (error) {
                    console.error('Error loading project data:', error)
                }
            }

            // Fallback to project state or default README
            if (project?.fileTree && Object.keys(project.fileTree).length > 0) {
                setFileTree(project.fileTree)
                const files = Object.keys(project.fileTree)
                if (files.length > 0) {
                    const preferredFile = files.includes('README.md') ? 'README.md' : files[0]
                    setSelectedFile(preferredFile)
                }
            } else {
                // Default README.md file with comprehensive instructions
                const defaultFileTree = getDefaultFileTree()
                
                setFileTree(defaultFileTree)
                setSelectedFile('README.md')
                
                // Save the default file tree to backend if project exists
                if (project?._id) {
                    autoSaveFileTree(defaultFileTree)
                }
            }
            hasInitialized.current = true
        }

        loadProjectFileTree()
    }, [project, setFileTree, setSelectedFile, autoSaveFileTree, setProjectData])
}
