import React, { useState } from 'react';
import './Auth.css';

function Signup({ onNavigateToLogin, onSignupSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await import('../services/api').then(module => module.authAPI.signup({
                name: formData.name,
                email: formData.email,
                password: formData.password
            }));

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (onSignupSuccess) {
                onSignupSuccess(data.user);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="auth-blob blob-1"></div>
                <div className="auth-blob blob-2"></div>
                <div className="auth-blob blob-3"></div>
            </div>

            <div className="auth-content">
                <div className="auth-card fade-in">
                    <div className="auth-header">
                        <div className="auth-icon">🎯</div>
                        <h1 className="auth-title">Join Timetable App</h1>
                        <p className="auth-subtitle">Start organizing your time today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-input auth-input"
                                    placeholder="Aja Mishra"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">✉️</span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input auth-input"
                                    placeholder="aja.mishra@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-input auth-input"
                                    placeholder="At least 8 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="8"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔐</span>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="form-input auth-input"
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" className="checkbox-input" required />
                                <span>I agree to the Terms of Service and Privacy Policy</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary auth-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <span className="arrow-icon">→</span>
                                </>
                            )}
                        </button>
                    </form>



                    <div className="auth-footer">
                        <p>Already have an account?
                            <button
                                onClick={onNavigateToLogin}
                                className="link-btn"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>

                <div className="auth-info slide-in">
                    <div className="info-card">
                        <h3>⚡ Quick Setup</h3>
                        <p>Get started in seconds and begin planning your schedule</p>
                    </div>
                    <div className="info-card">
                        <h3>🔒 Secure & Private</h3>
                        <p>Your data is encrypted and protected with industry-standard security</p>
                    </div>
                    <div className="info-card">
                        <h3>💼 Professional Tools</h3>
                        <p>Access powerful scheduling and tracking features</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
