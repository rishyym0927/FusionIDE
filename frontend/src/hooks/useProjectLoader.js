import { useEffect } from 'react'
import { getDefaultFileTree } from '../utils/defaultFileTree'

export const useProjectLoader = (project, setFileTree, setSelectedFile, autoSaveFileTree) => {
    useEffect(() => {
        const loadProjectFileTree = async () => {
            if (project?._id) {
                try {
                    // Fetch the latest file tree from backend
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${project._id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    })

                    if (response.ok) {
                        const projectData = await response.json()
                        if (projectData.fileTree && Object.keys(projectData.fileTree).length > 0) {
                            setFileTree(projectData.fileTree)
                            // Set selectedFile to first available file
                            const files = Object.keys(projectData.fileTree)
                            if (files.length > 0) {
                                if (projectData.fileTree['README.md']) {
                                    setSelectedFile('README.md')
                                } else {
                                    setSelectedFile(files[0])
                                }
                            }
                            return // Exit early if we loaded from backend
                        }
                    }
                } catch (error) {
                    console.error('Error loading project file tree:', error)
                }
            }

            // Fallback to project state or default README
            if (project?.fileTree && Object.keys(project.fileTree).length > 0) {
                setFileTree(project.fileTree)
                const files = Object.keys(project.fileTree)
                if (files.length > 0) {
                    if (project.fileTree['README.md']) {
                        setSelectedFile('README.md')
                    } else {
                        setSelectedFile(files[0])
                    }
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
        }

        loadProjectFileTree()
    }, [project, setFileTree, setSelectedFile, autoSaveFileTree])
}
