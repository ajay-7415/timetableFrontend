import React, { useState, useEffect } from 'react';
import { trackingAPI } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsCard from './StatsCard';
import './MonthlyView.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MonthlyView = () => {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMonthlyData();
    }, [year, month]);

    const loadMonthlyData = async () => {
        setLoading(true);
        try {
            const response = await trackingAPI.getMonthly(year, month);
            setStats(response.data);
        } catch (error) {
            console.error('Error loading monthly data:', error);
        } finally {
            setLoading(false);
        }
    };

    const changeMonth = (delta) => {
        let newMonth = month + delta;
        let newYear = year;

        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }

        setMonth(newMonth);
        setYear(newYear);
    };

    const getHeatmapColor = (completionRate) => {
        if (completionRate === 0) return 'rgba(255, 255, 255, 0.05)';
        if (completionRate < 25) return 'rgba(239, 68, 68, 0.3)';
        if (completionRate < 50) return 'rgba(245, 158, 11, 0.3)';
        if (completionRate < 75) return 'rgba(99, 102, 241, 0.3)';
        return 'rgba(16, 185, 129, 0.4)';
    };

    // Prepare chart data (weekly aggregation)
    const chartData = stats?.days.reduce((acc, day, index) => {
        const weekIndex = Math.floor(index / 7);
        if (!acc[weekIndex]) {
            acc[weekIndex] = { week: `Week ${weekIndex + 1}`, completed: 0, missed: 0, total: 0 };
        }
        acc[weekIndex].completed += day.completed;
        acc[weekIndex].missed += day.missed;
        acc[weekIndex].total += day.total;
        return acc;
    }, []) || [];

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="monthly-view">
            <div className="view-header">
                <h2>Monthly View</h2>
                <div className="month-controls flex gap-md">
                    <button className="btn btn-secondary" onClick={() => changeMonth(-1)}>
                        ← Previous
                    </button>
                    <span className="current-month">
                        {MONTHS[month - 1]} {year}
                    </span>
                    <button className="btn btn-secondary" onClick={() => changeMonth(1)}>
                        Next →
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setYear(today.getFullYear());
                            setMonth(today.getMonth() + 1);
                        }}
                    >
                        This Month
                    </button>
                </div>
            </div>

            {stats && (
                <>
                    <div className="stats-grid grid grid-3 mb-xl">
                        <StatsCard
                            title="Total Tasks"
                            value={stats.summary.total}
                            subtitle="This month"
                            icon="📊"
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
                        <h3 className="mb-lg">Monthly Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="week" stroke="#cbd5e1" />
                                <YAxis stroke="#cbd5e1" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(26, 26, 62, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="completed"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="missed"
                                    stroke="#ef4444"
                                    strokeWidth={3}
                                    dot={{ fill: '#ef4444', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="glass-card">
                        <h3 className="mb-lg">Calendar Heatmap</h3>
                        <div className="calendar-grid">
                            <div className="calendar-header">
                                <span>Sun</span>
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                            </div>
                            <div className="calendar-days">
                                {/* Empty cells for days before month starts */}
                                {Array.from({ length: stats.days[0].dayOfWeek }).map((_, i) => (
                                    <div key={`empty-${i}`} className="calendar-day empty"></div>
                                ))}

                                {/* Actual days */}
                                {stats.days.map((day) => (
                                    <div
                                        key={day.date}
                                        className="calendar-day"
                                        style={{
                                            background: getHeatmapColor(parseFloat(day.completionRate))
                                        }}
                                        title={`${day.date}: ${day.completed}/${day.total} completed (${day.completionRate}%)`}
                                    >
                                        <span className="day-number">{day.day}</span>
                                        {day.total > 0 && (
                                            <div className="day-mini-stats">
                                                <span className="mini-stat completed">{day.completed}</span>
                                                <span className="mini-stat missed">{day.missed}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="heatmap-legend mt-lg">
                            <span className="legend-label">Less</span>
                            <div className="legend-colors">
                                <div className="legend-color" style={{ background: 'rgba(255, 255, 255, 0.05)' }}></div>
                                <div className="legend-color" style={{ background: 'rgba(239, 68, 68, 0.3)' }}></div>
                                <div className="legend-color" style={{ background: 'rgba(245, 158, 11, 0.3)' }}></div>
                                <div className="legend-color" style={{ background: 'rgba(99, 102, 241, 0.3)' }}></div>
                                <div className="legend-color" style={{ background: 'rgba(16, 185, 129, 0.4)' }}></div>
                            </div>
                            <span className="legend-label">More</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MonthlyView;
