import { useState, useEffect } from 'react'

export const useProject = (project) => {
    const [fileTree, setFileTree] = useState({})
    const [selectedFile, setSelectedFile] = useState('README.md')
    const [isFileModified, setIsFileModified] = useState(false)

    // Auto-save functionality with better error handling
    const autoSaveFileTree = async (newFileTree) => {
        if (!project?._id) {
            console.log('No project ID available for auto-save')
            return
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/update-filetree`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    projectId: project._id,
                    fileTree: newFileTree
                })
            })

            if (response.ok) {
                console.log('FileTree auto-saved successfully')
            } else {
                const errorData = await response.json()
                console.error('Failed to auto-save fileTree:', errorData)
            }
        } catch (error) {
            console.error('Error auto-saving fileTree:', error)
        }
    }

    const handleSaveFile = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/update-filetree`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    projectId: project._id,
                    fileTree: fileTree
                })
            })

            if (response.ok) {
                setIsFileModified(false)
                console.log('File saved successfully')
            }
        } catch (error) {
            console.error('Error saving file:', error)
        }
    }

    return {
        fileTree,
        setFileTree,
        selectedFile,
        setSelectedFile,
        isFileModified,
        setIsFileModified,
        autoSaveFileTree,
        handleSaveFile
    }
}
