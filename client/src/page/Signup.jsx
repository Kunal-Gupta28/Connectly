import React from 'react';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const navigator = useNavigate();

    const validateForm = () => {
        if (!name || !email || !password) {
            return 'All fields are required.';
        }

        // Email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address.';
        }

        // Password validation
        if (password.length < 6 || password.length > 20) {
            return 'Password must be between 6 and 20 characters.';
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form before submitting
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setIsSubmitting(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/register`, {
                name,
                email,
                password
            });
            if (res.status === StatusCodes.CREATED) {
                const token= res.data.token;
                localStorage.setItem('token', token);
                navigator('/home');
            } else {
                console.error('Signup failed');
                setName('');
                setEmail('');
                setPassword('');
                setError('Signup failed. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error.response?.data?.message || error.message);
            setError(error.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setIsSubmitting(false);
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
            
            <div className="w-full max-w-lg p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white">
                <h1 className="text-3xl font-extrabold text-center mb-6 tracking-tight">
                    Create Your Account
                </h1>
                <p className="text-center text-sm text-gray-400 mb-6">Sign up to get started</p>

                {/* Error message */}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm text-gray-300 mb-1">Full Name</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-300 mb-1">Email Address</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm text-gray-300 mb-1">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 hover:bg-blue-500/30 hover:text-white rounded-lg transition duration-300 shadow-lg hover:shadow-blue-500/30 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-400">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-400 hover:underline">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}