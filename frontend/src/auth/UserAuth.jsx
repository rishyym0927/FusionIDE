import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'

const UserAuth = ({ children }) => {

    const { user, setUser } = useContext(UserContext)
    const [ loading, setLoading ] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate('/login')
            setLoading(false)
            return
        }

        // If user is already set, no need to validate again
        if (user) {
            setLoading(false)
            return
        }

        // Validate token and restore user
        axios.get('/users/profile')
            .then(res => {
                setUser(res.data.user)
                setLoading(false)
            })
            .catch(err => {
                console.log('Token validation failed:', err)
                localStorage.removeItem('token')
                navigate('/login')
                setLoading(false)
            })

    }, [user, token, navigate, setUser])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserAuth