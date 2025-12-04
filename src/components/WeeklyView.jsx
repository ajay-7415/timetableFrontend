import React, { useState, useEffect } from 'react';
import { trackingAPI } from '../services/api';
import { WeeklyViewSkeleton } from './Skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from './StatsCard';
import './WeeklyView.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WeeklyView = () => {
    const [startDate, setStartDate] = useState(getMonday(new Date()));
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    function getMonday(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        return d.toISOString().split('T')[0];
    }

    useEffect(() => {
        loadWeeklyData();
    }, [startDate]);

    const loadWeeklyData = async () => {
        setLoading(true);
        try {
            const response = await trackingAPI.getWeekly(startDate);
            setStats(response.data);
        } catch (error) {
            console.error('Error loading weekly data:', error);
        } finally {
            setLoading(false);
        }
    };

    const changeWeek = (weeks) => {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + (weeks * 7));
        setStartDate(newDate.toISOString().split('T')[0]);
    };

    const chartData = stats?.days.map(day => ({
        name: DAYS[day.dayOfWeek],
        Completed: day.completed,
        Missed: day.missed,
        Pending: day.pending
    })) || [];

    if (loading) {
        return <WeeklyViewSkeleton />;
    }

    return (
        <div className="weekly-view">
            <div className="view-header">
                <h2>Weekly View</h2>
                <div className="week-controls flex gap-md">
                    <button className="btn btn-secondary" onClick={() => changeWeek(-1)}>
                        ← Previous Week
                    </button>
                    <span className="current-week">
                        Week of {new Date(startDate).toLocaleDateString()}
                    </span>
                    <button className="btn btn-secondary" onClick={() => changeWeek(1)}>
                        Next Week →
                    </button>
                    <button className="btn btn-primary" onClick={() => setStartDate(getMonday(new Date()))}>
                        This Week
                    </button>
                </div>
            </div>

            {stats && (
                <>
                    <div className="stats-grid grid grid-3 mb-xl">
                        <StatsCard
                            title="Total Tasks"
                            value={stats.summary.total}
                            subtitle="This week"
                            icon="📅"
                            gradient="primary"
                        />
                        <StatsCard
                            title="Completed"
                            value={stats.summary.completed}
                            subtitle={`${stats.summary.completionRate}% completion rate`}
                            icon="✅"
                            gradient="success"
                        />
                        <StatsCard
                            title="Missed"
                            value={stats.summary.missed}
                            subtitle={`${stats.summary.pending} pending`}
                            icon="❌"
                            gradient="error"
                        />
                    </div>

                    <div className="glass-card mb-xl">
                        <h3 className="mb-lg">Weekly Progress Chart</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#cbd5e1" />
                                <YAxis stroke="#cbd5e1" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(26, 26, 62, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="Completed" fill="#10b981" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="Missed" fill="#ef4444" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="Pending" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="week-grid">
                        {stats.days.map((day, index) => (
                            <div key={index} className="day-card glass-card">
                                <div className="day-card-header">
                                    <h4>{DAYS[day.dayOfWeek]}</h4>
                                    <span className="day-date">
                                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="day-stats">
                                    <div className="stat-row">
                                        <span className="stat-label">Total:</span>
                                        <span className="stat-value">{day.total}</span>
                                    </div>
                                    <div className="stat-row completed">
                                        <span className="stat-label">✓ Completed:</span>
                                        <span className="stat-value">{day.completed}</span>
                                    </div>
                                    <div className="stat-row missed">
                                        <span className="stat-label">✗ Missed:</span>
                                        <span className="stat-value">{day.missed}</span>
                                    </div>
                                    <div className="stat-row pending">
                                        <span className="stat-label">⏳ Pending:</span>
                                        <span className="stat-value">{day.pending}</span>
                                    </div>
                                </div>
                                {day.total > 0 && (
                                    <div className="day-progress">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${day.completionRate}%` }}
                                            />
                                        </div>
                                        <span className="progress-text">{day.completionRate}%</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default WeeklyView;
