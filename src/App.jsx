import React, { useState } from 'react';
import DailyView from './components/DailyView';
import WeeklyView from './components/WeeklyView';
import MonthlyView from './components/MonthlyView';
import TimetableManager from './components/TimetableManager';
import TargetManager from './components/TargetManager';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authView, setAuthView] = useState('login'); // 'login' or 'signup'
    const [currentView, setCurrentView] = useState('daily');

    // Auth handlers
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleSignupSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleNavigateToSignup = () => {
        setAuthView('signup');
    };

    const handleNavigateToLogin = () => {
        setAuthView('login');
    };

    // If not authenticated, show auth pages
    if (!isAuthenticated) {
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

    const renderView = () => {
        switch (currentView) {
            case 'daily':
                return <DailyView />;
            case 'weekly':
                return <WeeklyView />;
            case 'monthly':
                return <MonthlyView />;
            case 'targets':
                return <TargetManager />;
            case 'create':
                return <TimetableManager />;
            case 'manage':
                return <TimetableManager />;
            default:
                return <DailyView />;
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="container">
                    <div className="logo">
                        <h1>📅 Timetable Tracker</h1>
                        <p className="tagline">Track your schedule, achieve your goals</p>
                    </div>
                    <div className="user-profile">
                        <span className="user-greeting">Hello, {JSON.parse(localStorage.getItem('user'))?.name || 'User'}</span>
                    </div>
                </div>
            </header>

            <div className="app-layout">
                {/* Sidebar Navigation */}
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

                {/* Main Content Area */}
                <main className="app-main">
                    <div className="main-content">
                        {renderView()}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
