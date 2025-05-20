import React, { useState } from 'react';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigator = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is not valid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/login`, {
                email,
                password
            });

            if (res.status === StatusCodes.OK) {
                const {token} = res.data;
                localStorage.setItem('token', token);
                navigator('/home');
            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error:', error.response?.data?.message || error.message);
            setErrors({ server: 'Invalid email or password' });
        }
    };

    const navigateToLanding = () => {
        navigator('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] px-4 py-8 relative text-white font-sans">
            
            {/* Go Back Button */}
            <button
                onClick={navigateToLanding}
                className="absolute top-4 left-4 text-blue-400 hover:underline text-sm tracking-wide"
            >
                ← Go to Landing Page
            </button>

            <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white">
                <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight">
                    Welcome Back
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {errors.server && <p className="text-red-500 text-sm mt-1">{errors.server}</p>}

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 hover:text-white rounded-lg transition duration-300 shadow-lg hover:shadow-blue-500/30"
                    >
                        Log In
                    </button>
                </form>

                <p className="text-center text-sm mt-6 text-gray-400">
                    Don’t have an account?{' '}
                    <button
                        onClick={() => navigator('/signup')}
                        className="text-blue-400 hover:underline"
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
}