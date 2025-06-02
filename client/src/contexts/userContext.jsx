import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data) {
                setUser(response.data);
                setError(null);
            } else {
                throw new Error('Invalid user data received');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError(error.response?.data?.message || 'Failed to fetch user data');
            setUser(null);
            localStorage.removeItem('token');
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserData(token);
        } else {
            setLoading(false);
            setUser(null);
        }
    }, []);

    const updateUser = async (newData) => {
        try {
            if (typeof newData === 'object') {
                setUser(prev => ({ ...prev, ...newData }));
            } else {
                // If newData is a token, fetch fresh user data
                await fetchUserData(newData);
            }
            setError(null);
        } catch (error) {
            console.error('Error updating user:', error);
            setError(error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (token) {
                // Call logout endpoint with token
                await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/user/logout`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Still proceed with local logout even if server request fails
        } finally {
            // Clear all auth data
            setUser(null);
            setError(null);
            localStorage.removeItem('token');
            sessionStorage.clear(); // Clear any session data
            
            // Show success message
            toast.success('Logged out successfully');
            
            // Redirect to login page
            window.location.href = '/login';
            
            setLoading(false);
        }
    };

    const login = async (token, userData) => {
        try {
            localStorage.setItem('token', token);
            await updateUser(userData);
            toast.success('Login successful!');
            return true; // Indicate successful login
        } catch (error) {
            console.error('Login error:', error);
            localStorage.removeItem('token');
            setError(error.message);
            throw error;
        }
    };

    return (
        <UserContext.Provider 
            value={{ 
                user, 
                setUser, 
                updateUser, 
                logout, 
                login,
                loading, 
                error,
                setError 
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};