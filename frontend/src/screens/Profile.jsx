import React, { useContext } from 'react';
import { UserContext } from '../context/user.context';
import { useTheme } from '../context/theme.context';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const { isDarkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            isDarkMode 
                                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                        } border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                        <i className="ri-arrow-left-line"></i>
                        Back to Home
                    </button>
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Profile
                    </h1>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className={`p-8 rounded-lg shadow-lg ${
                        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } border`}>
                        <div className="flex items-center justify-center mb-6">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${
                                isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                            }`}>
                                {user?.email?.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {user?.email}
                            </h2>
                            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                User Account
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <i className={`ri-moon-line text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}></i>
                                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Dark Mode
                                    </span>
                                </div>
                                <button
                                    onClick={toggleDarkMode}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            isDarkMode ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-lg border">
                                <i className={`ri-mail-line text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}></i>
                                <div>
                                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Email
                                    </p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <i className="ri-logout-box-line"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
