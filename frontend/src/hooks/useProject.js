import { useState, useEffect } from 'react'

export const useProject = (project) => {
    const [fileTree, setFileTree] = useState({})
    const [selectedFile, setSelectedFile] = useState(null)
    const [isFileModified, setIsFileModified] = useState(false)

    // Debug logging
    useEffect(() => {
        console.log('Selected file changed to:', selectedFile)
    }, [selectedFile])

    useEffect(() => {
        console.log('File tree updated:', Object.keys(fileTree))
    }, [fileTree])

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
        if (!project?._id) {
            console.error('No project ID available for saving')
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
