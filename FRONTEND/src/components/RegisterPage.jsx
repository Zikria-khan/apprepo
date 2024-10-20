import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import styles
import './RegisterPage.css';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!"); // Use toast for password mismatch
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token and user name in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('name', data.name);

                toast.success("User successfully registered!"); // Use success toast

                // Redirect to the home page
                setTimeout(() => {
                    navigate('/'); // Redirect after a brief delay
                }, 3000); // Wait for toast to finish before redirect
            } else {
                toast.error(data.message || "Registration failed!"); // Use error toast
            }
        } catch (error) {
            toast.error("An error occurred, please try again."); // Use error toast for network errors
        }
    };

    return (
        <div className="register-container">
            <h1 className="register-title">Register</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
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
                <div className="input-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        placeholder="Confirm your password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn-register">Register</button>
                <p className="login-link">Already have an account? <a href="/login">Login</a></p>
                <a href="/" className="back-home">Back to Home</a>
            </form>
            <ToastContainer /> {/* Toast container for notifications */}
        </div>
    );
};

export default RegisterPage;
