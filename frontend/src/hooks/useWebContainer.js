import { useState, useEffect } from 'react'
import { getWebContainer } from '../config/webContainer'

export const useWebContainer = () => {
    const [webContainer, setWebContainer] = useState(null)
    const [isInstalling, setIsInstalling] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const [runStatus, setRunStatus] = useState('idle')
    const [runLogs, setRunLogs] = useState([])
    const [runProcess, setRunProcess] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)

    useEffect(() => {
        const initWebContainer = async () => {
            const container = await getWebContainer()
            setWebContainer(container)
        }
        initWebContainer()
    }, [])

    const handleRunProject = async (fileTree) => {
        if (!webContainer) {
            setRunLogs(prev => [...prev, '[Error] WebContainer not initialized'])
            return
        }

        try {
            setRunStatus('installing')
            setIsInstalling(true)
            setRunLogs([])
            
            await webContainer.mount(fileTree)
            
            const installProcess = await webContainer.spawn("npm", ["install"])
            
            installProcess.output.pipeTo(new WritableStream({
                write(chunk) {
                    console.log('Install:', chunk)
                    setRunLogs(prev => [...prev, `[Install] ${chunk}`])
                }
            }))
            
            await installProcess.exit
            setIsInstalling(false)
            
            if (runProcess) {
                runProcess.kill()
                setIsRunning(false)
            }
            
            setRunStatus('running')
            setIsRunning(true)
            
            let tempRunProcess = await webContainer.spawn("npm", ["start"])
            
            tempRunProcess.output.pipeTo(new WritableStream({
                write(chunk) {
                    console.log('Run:', chunk)
                    setRunLogs(prev => [...prev, `[Run] ${chunk}`])
                }
            }))
            
            setRunProcess(tempRunProcess)
            
            webContainer.on('server-ready', (port, url) => {
                console.log('Server ready:', port, url)
                setIframeUrl(url)
                setRunLogs(prev => [...prev, `[Success] Server running on ${url}`])
            })
            
        } catch (error) {
            console.error('Error running project:', error)
            setRunStatus('error')
            setIsInstalling(false)
            setIsRunning(false)
            setRunLogs(prev => [...prev, `[Error] ${error.message}`])
        }
    }

    const handleStopProject = () => {
        if (runProcess) {
            runProcess.kill()
            setRunProcess(null)
            setIsRunning(false)
            setRunStatus('idle')
            setIframeUrl(null)
            setRunLogs(prev => [...prev, '[Stop] Application stopped'])
        }
    }

    return {
        webContainer,
        isInstalling,
        isRunning,
        runStatus,
        runLogs,
        setRunLogs,
        iframeUrl,
        handleRunProject,
        handleStopProject
    }
}
