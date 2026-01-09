import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Auth.css';

function Login({ onNavigateToSignup, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data } = await authAPI.login({ email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (onLoginSuccess) {
                onLoginSuccess(data.user);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
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
                        <div className="auth-icon">📅</div>
                        <h1 className="auth-title">Welcome</h1>
                        <p className="auth-subtitle">to Timetable App</p>
                        <p className="auth-description">Track your schedule, achieve your goals</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">✉️</span>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input auth-input"
                                    placeholder="example@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    className="form-input auth-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" className="checkbox-input" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-link">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary auth-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <span className="arrow-icon">→</span>
                                </>
                            )}
                        </button>
                    </form>



                    <div className="auth-footer">
                        <p>Don't have an account?
                            <button
                                onClick={onNavigateToSignup}
                                className="link-btn"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>

                <div className="auth-info slide-in">
                    <div className="info-card">
                        <h3>✨ Organize Your Time</h3>
                        <p>Plan your daily, weekly, and monthly schedules with ease</p>
                    </div>
                    <div className="info-card">
                        <h3>📊 Track Progress</h3>
                        <p>Monitor your completion rates and stay on top of your goals</p>
                    </div>
                    <div className="info-card">
                        <h3>🎯 Achieve More</h3>
                        <p>Turn your plans into achievements with smart tracking</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
