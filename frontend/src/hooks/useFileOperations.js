import { useCallback } from 'react'

export const useFileOperations = ({ 
    fileTree, 
    setFileTree, 
    selectedFile, 
    setSelectedFile, 
    setIsFileModified, 
    autoSaveFileTree 
}) => {
    const handleFileSelect = useCallback((fileName) => {
        setSelectedFile(fileName)
        setIsFileModified(false)
    }, [setSelectedFile, setIsFileModified])

    const handleFileContentChange = useCallback((fileName, newContent) => {
        setFileTree(prev => ({
            ...prev,
            [fileName]: {
                ...prev[fileName],
                file: {
                    ...prev[fileName]?.file,
                    contents: newContent
                }
            }
        }))
        setIsFileModified(true)
    }, [setFileTree, setIsFileModified])

    const handleCreateFile = useCallback((fileName) => {
        if (fileName && !fileTree[fileName]) {
            const newFileTree = {
                ...fileTree,
                [fileName]: {
                    file: {
                        contents: ''
                    }
                }
            }
            setFileTree(newFileTree)
            setSelectedFile(fileName)
            
            // Auto-save immediately after creating file
            autoSaveFileTree(newFileTree)
        }
    }, [fileTree, setFileTree, setSelectedFile, autoSaveFileTree])

    const handleDeleteFile = useCallback((fileName) => {
        if (fileName && fileTree[fileName]) {
            const newFileTree = { ...fileTree }
            delete newFileTree[fileName]
            setFileTree(newFileTree)
            
            // Select another file if the deleted file was selected
            if (selectedFile === fileName) {
                const remainingFiles = Object.keys(newFileTree)
                setSelectedFile(remainingFiles.length > 0 ? remainingFiles[0] : null)
            }
            
            // Auto-save immediately after deleting file
            autoSaveFileTree(newFileTree)
        }
    }, [fileTree, setFileTree, selectedFile, setSelectedFile, autoSaveFileTree])

    return {
        handleFileSelect,
        handleFileContentChange,
        handleCreateFile,
        handleDeleteFile
    }
}
