import React, { useState, useEffect } from 'react';
import DailyView from './components/DailyView';
import WeeklyView from './components/WeeklyView';
import MonthlyView from './components/MonthlyView';
import TimetableManager from './components/TimetableManager';
import TargetManager from './components/TargetManager';
import AudioPlayer from './components/AudioPlayer';
import SubscriptionManager from './components/SubscriptionManager';
import SubscriptionModal from './components/SubscriptionModal';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import { subscriptionAPI } from './services/api';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
    const [currentView, setCurrentView] = useState('daily');
    const [isLoading, setIsLoading] = useState(true);
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [subscriptionErrorMessage, setSubscriptionErrorMessage] = useState('');
    const [showLanding, setShowLanding] = useState(true);
    const [isFocusMode, setIsFocusMode] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            setIsAuthenticated(true);
            setShowLanding(false);
        }
        setIsLoading(false);
    }, []);

    // Fetch subscription status when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchSubscriptionStatus();
        }
    }, [isAuthenticated]);

    // Listen for subscription errors
    useEffect(() => {
        const handleSubscriptionError = (event) => {
            setSubscriptionErrorMessage(event.detail.message);
            setShowSubscriptionModal(true);
        };

        window.addEventListener('subscriptionError', handleSubscriptionError);
        return () => window.removeEventListener('subscriptionError', handleSubscriptionError);
    }, []);

    const fetchSubscriptionStatus = async () => {
        try {
            const response = await subscriptionAPI.getStatus();
            setSubscriptionData(response.data);
        } catch (err) {
            console.error('Failed to fetch subscription status:', err);
        }
    };

    // Auth handlers
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        setShowLanding(false);
    };

    const handleSignupSuccess = () => {
        setIsAuthenticated(true);
        setShowLanding(false);
    };

    const handleNavigateToSignup = () => {
        setAuthView('signup');
        setShowLanding(false);
    };

    const handleNavigateToLogin = () => {
        setAuthView('login');
        setShowLanding(false);
    };

    const handleGetStarted = () => {
        setAuthView('signup');
        setShowLanding(false);
    };

    const handleLandingLogin = () => {
        setAuthView('login');
        setShowLanding(false);
    };

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="loading-container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'var(--color-bg-secondary)'
            }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    // If not authenticated, show landing or auth pages
    if (!isAuthenticated) {
        if (showLanding) {
            return <LandingPage onGetStarted={handleGetStarted} onLogin={handleLandingLogin} />;
        }
        if (authView === 'login') {
            return <Login onNavigateToSignup={handleNavigateToSignup} onLoginSuccess={handleLoginSuccess} />;
        } else {
            return <Signup onNavigateToLogin={handleNavigateToLogin} onSignupSuccess={handleSignupSuccess} />;
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setAuthView('login');
        setCurrentView('daily');
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setCurrentView('daily');
    };

    const toggleFocusMode = () => {
        setIsFocusMode(!isFocusMode);
    };

    const renderView = () => {
        switch (currentView) {
            case 'daily':
                return <DailyView
                    date={selectedDate}
                    setDate={setSelectedDate}
                    isFocusMode={isFocusMode}
                    toggleFocusMode={toggleFocusMode}
                />;
            case 'weekly':
                return <WeeklyView />;
            case 'monthly':
                return <MonthlyView selectedDate={selectedDate} onDateSelect={handleDateSelect} />;
            case 'targets':
                return <TargetManager />;
            case 'audio':
                return <AudioPlayer />;
            case 'subscription':
                return <SubscriptionManager />;
            case 'create':
                return <TimetableManager />;
            case 'manage':
                return <TimetableManager />;
            default:
                return <DailyView
                    date={selectedDate}
                    setDate={setSelectedDate}
                    isFocusMode={isFocusMode} // Pass props to default case
                    toggleFocusMode={toggleFocusMode}
                />;
        }
    };

    return (
        <div className={`app ${isFocusMode ? 'focus-mode' : ''}`}>
            {!isFocusMode && (
                <header className="app-header">
                    <div className="container">
                        <div className="logo">
                            <h1>📅 Timetable Tracker</h1>
                            <p className="tagline">Track your schedule, achieve your goals</p>
                        </div>
                        <div className="user-profile">
                            <span className="user-greeting">Hello, {JSON.parse(localStorage.getItem('user'))?.name || 'User'}</span>
                            {subscriptionData?.trial?.isTrialActive && subscriptionData?.trial?.daysRemaining > 0 && (
                                <span className="trial-badge">
                                    🆓 Trial: {subscriptionData.trial.daysRemaining} days left
                                </span>
                            )}
                        </div>
                    </div>
                </header>
            )}

            <div className="app-layout">
                {/* Sidebar Navigation */}
                {!isFocusMode && (
                    <aside className="app-sidebar">
                        <nav className="sidebar-nav">
                            <button
                                className={`sidebar-tab ${currentView === 'daily' ? 'active' : ''}`}
                                onClick={() => setCurrentView('daily')}
                            >
                                <span className="tab-icon">📊</span>
                                <span className="tab-label">Daily View</span>
                            </button>
                            <button
                                className={`sidebar-tab ${currentView === 'weekly' ? 'active' : ''}`}
                                onClick={() => setCurrentView('weekly')}
                            >
                                <span className="tab-icon">📈</span>
                                <span className="tab-label">Weekly View</span>
                            </button>
                            <button
                                className={`sidebar-tab ${currentView === 'monthly' ? 'active' : ''}`}
                                onClick={() => setCurrentView('monthly')}
                            >
                                <span className="tab-icon">📆</span>
                                <span className="tab-label">Monthly View</span>
                            </button>
                            <button
                                className={`sidebar-tab ${currentView === 'targets' ? 'active' : ''}`}
                                onClick={() => setCurrentView('targets')}
                            >
                                <span className="tab-icon">🎯</span>
                                <span className="tab-label">Targets</span>
                            </button>
                            <button
                                className={`sidebar-tab ${currentView === 'audio' ? 'active' : ''}`}
                                onClick={() => setCurrentView('audio')}
                            >
                                <span className="tab-icon">🎵</span>
                                <span className="tab-label">Audio Player</span>
                            </button>
                            <button
                                className={`sidebar-tab ${currentView === 'subscription' ? 'active' : ''}`}
                                onClick={() => setCurrentView('subscription')}
                            >
                                <span className="tab-icon">💎</span>
                                <span className="tab-label">Subscription</span>
                            </button>

                            <div className="sidebar-divider"></div>

                            <button
                                className={`sidebar-tab ${currentView === 'create' ? 'active' : ''}`}
                                onClick={() => setCurrentView('create')}
                            >
                                <span className="tab-icon">➕</span>
                                <span className="tab-label">Create Timetable</span>
                            </button>
                            <button
                                className={`sidebar-tab ${currentView === 'manage' ? 'active' : ''}`}
                                onClick={() => setCurrentView('manage')}
                            >
                                <span className="tab-icon">⚙️</span>
                                <span className="tab-label">Manage Schedule</span>
                            </button>

                            <div className="sidebar-divider"></div>

                            <button
                                className="sidebar-tab logout-tab"
                                onClick={handleLogout}
                            >
                                <span className="tab-icon">🚪</span>
                                <span className="tab-label">Logout</span>
                            </button>
                        </nav>
                    </aside>
                )}

                {/* Main Content Area */}
                <main className={`app-main ${isFocusMode ? 'focus-mode-main' : ''}`}>
                    <div className="main-content">
                        {renderView()}
                    </div>
                </main>
            </div>

            {/* Subscription Modal */}
            <SubscriptionModal
                isOpen={showSubscriptionModal}
                message={subscriptionErrorMessage}
                onClose={() => setShowSubscriptionModal(false)}
                onSubscribe={() => {
                    setShowSubscriptionModal(false);
                    setCurrentView('subscription');
                }}
            />
        </div>
    );
}

export default App;
