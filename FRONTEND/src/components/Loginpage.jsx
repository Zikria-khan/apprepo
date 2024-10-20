import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import styles
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.name);
                localStorage.setItem('userId', data.userId); // Store user ID
                toast.success("Login successful!"); // Use success toast
                setTimeout(() => {
                    window.location.href = '/'; // Redirect after success
                }, 3000); // Wait for toast to finish before redirect
            } else {
                toast.error(data.message || "Login failed!"); // Use error toast
            }
        } catch (error) {
            toast.error("An error occurred, please try again."); // Use error toast for network errors
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn-login">Login</button>
                <a href="/" className="forgot-password">Forgot Password?</a>
                <p className="register-link">Don't have an account? <a href="/register">Register</a></p>
                <a href="/" className="back-home">Back to Home</a>
            </form>
            <ToastContainer /> {/* Toast container for notifications */}
        </div>
    );
};

export default LoginPage;
