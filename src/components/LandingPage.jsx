import React from 'react';
import ThreeBackground from './ThreeBackground';
import './LandingPage.css';

function LandingPage({ onGetStarted, onLogin }) {
    return (
        <div className="landing-page">
            <ThreeBackground />
            <div className="landing-content">
                <header className="landing-header">
                    <div className="landing-logo">📅 Timetable Tracker</div>
                    <button className="btn-text" onClick={onLogin}>Sign In</button>
                </header>

                <main className="landing-hero">
                    <h1 className="hero-title">
                        <span className="gradient-text">Master Your Time</span><br />
                        Achieve Your Dreams
                    </h1>
                    <p className="hero-subtitle">
                        The ultimate productivity tool to organize your schedule, track your goals,
                        and visualize your progress with advanced analytics.
                    </p>
                    <div className="hero-actions">
                        <button className="btn-primary-lg" onClick={onGetStarted}>
                            Get Started for Free
                        </button>
                        <p className="trial-text">Checking out? 7-day free trial included, cancel anytime.</p>
                    </div>

                    <div className="hero-features">
                        <div className="feature-pill">📊 Advanced Analytics</div>
                        <div className="feature-pill">🎯 Goal Tracking</div>
                        <div className="feature-pill">🎵 Focus Audio</div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default LandingPage;
