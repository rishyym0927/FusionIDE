import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'
import { useTheme } from '../context/theme.context'

const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const { setUser } = useContext(UserContext)
    const { isDarkMode } = useTheme()
    const navigate = useNavigate()

    function submitHandler(e) {
        e.preventDefault()

        axios.post('/users/login', {
            email,
            password
        }).then((res) => {
            console.log(res.data)
            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            navigate('/')
        }).catch((err) => {
            console.log(err.response.data)
        })
    }

    return (
        <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`p-8 rounded-lg shadow-lg w-full max-w-md ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Login
                </h2>
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="email">
                            Email
                        </label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isDarkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className={`block mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="password">
                            Password
                        </label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isDarkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                        Login
                    </button>
                </form>
                <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Create one</Link>
                </p>
            </div>
        </div>
    )
}

export default Login