import React from 'react';
import ThreeBackground from './ThreeBackground';
import './LandingPage.css';

function LandingPage({ onGetStarted, onLogin }) {
    return (
        <div className="landing-page">
            <ThreeBackground />

            <div className="landing-overlay">
                <header className="landing-header">
                    <div className="logo-container">
                        <span className="logo-icon">📅</span>
                        <span className="logo-text">Timetable Tracker</span>
                    </div>
                    <div className="auth-buttons">
                        <button className="btn-link" onClick={onLogin}>Sign In</button>
                        <button className="btn-primary-sm" onClick={onGetStarted}>Sign Up</button>
                    </div>
                </header>

                <main className="landing-main">
                    <div className="hero-content fade-in-up">
                        <div className="badge-pill">✨ Your Productivity Revolution</div>
                        <h1 className="hero-title">
                            Stop Planning,<br />
                            <span className="gradient-text">Start Achieving</span>
                        </h1>
                        <p className="hero-description">
                            The AI-powered workspace that transforms your chaotic schedule into
                            a streamlined path to success. Track goals, visualize progress, and
                            study with focus.
                        </p>

                        <div className="cta-group">
                            <button className="btn-glow" onClick={onGetStarted}>
                                <span>Start Free Trial</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <p className="trial-note">7-day free premium access • No credit card required</p>
                        </div>
                    </div>

                    <div className="feature-cards glass-container fade-in-delayed">
                        <div className="feature-card">
                            <div className="icon-box purple">📊</div>
                            <h3>Analytics</h3>
                            <p>Visualize your study habits with detailed daily reports.</p>
                        </div>
                        <div className="feature-card">
                            <div className="icon-box blue">🎯</div>
                            <h3>Goals</h3>
                            <p>Set ambitious targets and track them to completion.</p>
                        </div>
                        <div className="feature-card">
                            <div className="icon-box pink">🎵</div>
                            <h3>Focus</h3>
                            <p>Integrated lo-fi beats to keep you in the zone.</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default LandingPage;
