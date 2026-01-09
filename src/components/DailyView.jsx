import React, { useState, useEffect, useRef } from 'react';
import { timetableAPI, trackingAPI } from '../services/api';
import { DailyViewSkeleton } from './Skeleton';
import StatsCard from './StatsCard';
import Badges from './Badges'; // Import Badges
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './DailyView.css';

const DailyView = ({ date, setDate }) => {
    // const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Removed internal state
    const [stats, setStats] = useState(null);
    const [gamificationStats, setGamificationStats] = useState(null); // New state for AI features
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (date) {
            loadDailyData();
        }
    }, [date]);

    // Auto-miss tasks that have passed their end time (works even if user was offline)
    const isMarkingRef = useRef(false);

    useEffect(() => {
        const autoMarkMissed = async () => {
            if (!stats?.tasks || isMarkingRef.current) return;

            const now = new Date();
            const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
            const today = new Date().toISOString().split('T')[0];

            // Only auto-miss for today's tasks
            if (date !== today) return;

            const tasksToMark = [];
            for (const task of stats.tasks) {
                const status = getTaskStatus(task._id);
                // If task end time has passed and it's not marked as completed or missed
                if (task.end_time < currentTime && !status) {
                    tasksToMark.push(task);
                }
            }

            // Only proceed if there are tasks to mark
            if (tasksToMark.length === 0) return;

            isMarkingRef.current = true;
            console.log(`⏰ Auto-marking ${tasksToMark.length} task(s) as missed`);

            // Mark all tasks without reloading after each one
            for (const task of tasksToMark) {
                try {
                    await trackingAPI.mark({
                        timetable_id: task._id,
                        completion_date: date,
                        status: 'missed'
                    });
                } catch (error) {
                    console.error(`Failed to auto-mark ${task.title}:`, error);
                }
            }

            await refreshDailyData();
            isMarkingRef.current = false;
        };

        // Check when stats change (after data loads or refreshes)
        autoMarkMissed();
    }, [date, stats]);

    // Set up interval to check every minute
    useEffect(() => {
        const interval = setInterval(async () => {
            if (!stats?.tasks || isMarkingRef.current) return;

            const now = new Date();
            const currentTime = now.toTimeString().slice(0, 5);
            const today = new Date().toISOString().split('T')[0];

            if (date !== today) return;

            const tasksToMark = [];
            for (const task of stats.tasks) {
                const status = getTaskStatus(task._id);
                if (task.end_time < currentTime && !status) {
                    tasksToMark.push(task);
                }
            }

            if (tasksToMark.length > 0) {
                isMarkingRef.current = true;
                for (const task of tasksToMark) {
                    try {
                        await trackingAPI.mark({
                            timetable_id: task._id,
                            completion_date: date,
                            status: 'missed'
                        });
                    } catch (error) {
                        console.error(`Failed to auto-mark ${task.title}:`, error);
                    }
                }
                await refreshDailyData();
                isMarkingRef.current = false;
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [date, stats]);

    const loadDailyData = async () => {
        setLoading(true);
        try {
            const response = await trackingAPI.getDaily(date);
            setStats(response.data);

            // Fetch Gamification Stats
            const gamificationResponse = await trackingAPI.getStats();
            setGamificationStats(gamificationResponse.data);

        } catch (error) {
            console.error('Error loading daily data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh data without showing loader (for background updates)
    const refreshDailyData = async () => {
        try {
            const response = await trackingAPI.getDaily(date);
            setStats(response.data);

            // Refresh Gamification Stats
            const gamificationResponse = await trackingAPI.getStats();
            setGamificationStats(gamificationResponse.data);
        } catch (error) {
            console.error('Error refreshing daily data:', error);
        }
    };

    const markTask = async (e, taskId, status) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        try {
            await trackingAPI.mark({
                timetable_id: taskId,
                completion_date: date,
                status
            });
            refreshDailyData();
        } catch (error) {
            console.error('Error marking task:', error);
        }
    };

    const changeDate = (days) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        setDate(newDate.toISOString().split('T')[0]);
    };

    const getTaskStatus = (taskId) => {
        if (!stats?.completions || !taskId) {
            return null;
        }

        const completion = stats.completions.find(c => {
            if (!c.timetable_id) return false;

            // Handle both populated (object) and non-populated (string) timetable_id
            const completionTaskId = (typeof c.timetable_id === 'object' && c.timetable_id._id)
                ? c.timetable_id._id
                : c.timetable_id;

            return completionTaskId && completionTaskId.toString() === taskId.toString();
        });

        return completion;
    };

    if (loading) {
        return <DailyViewSkeleton />;
    }

    return (
        <div className="daily-view">
            <div className="view-header">
                <h2>Daily View</h2>
                <div className="date-controls flex gap-md">
                    <button type="button" className="btn btn-secondary" onClick={() => changeDate(-1)}>
                        ← Previous
                    </button>
                    <div className="custom-datepicker-wrapper">
                        <DatePicker
                            selected={new Date(date)}
                            onChange={(d) => setDate(d.toISOString().split('T')[0])}
                            dateFormat="yyyy-MM-dd"
                            className="form-input large-date-input"
                            wrapperClassName="date-picker-wrapper"
                            popperClassName="large-datepicker-popper"
                        />
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={() => changeDate(1)}>
                        Next →
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => setDate(new Date().toISOString().split('T')[0])}>
                        Today
                    </button>
                </div>
            </div>

            {stats && (
                <>
                    {/* Gamification Section */}
                    {gamificationStats && (
                        <div className="gamification-section mb-xl">
                            <div className="streak-container flex-between glass-card highlight-card">
                                <div className="streak-info">
                                    <span className="streak-icon">🔥</span>
                                    <div>
                                        <h3>{gamificationStats.streak} Day Streak</h3>
                                        <p className="text-muted text-sm">Keep it up!</p>
                                    </div>
                                </div>
                                <div className="missed-info text-right">
                                    <span className="missed-count">{gamificationStats.totalMissed}</span>
                                    <p className="text-muted text-sm">Total Missed</p>
                                </div>
                            </div>

                            <Badges badges={gamificationStats.badges} />
                        </div>
                    )}

                    <div className="stats-row">
                        <StatsCard
                            title="Total Tasks"
                            value={stats.total}
                            icon="📋"
                            gradient="primary"
                        />
                        <StatsCard
                            title="Completed"
                            value={stats.completed}
                            subtitle={`${stats.completionRate}% completion rate`}
                            icon="✅"
                            gradient="success"
                        />
                        <StatsCard
                            title="Missed"
                            value={stats.missed}
                            icon="❌"
                            gradient="error"
                        />
                    </div>

                    {stats.total > 0 && (
                        <div className="glass-card mb-lg">
                            <h3 className="mb-md">Progress</h3>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${stats.completionRate}%` }}
                                />
                            </div>
                            <div className="progress-labels flex-between mt-sm">
                                <span className="text-muted">{stats.completed} / {stats.total} tasks</span>
                                <span className="text-muted">{stats.completionRate}%</span>
                            </div>
                        </div>
                    )}

                    <div className="tasks-timeline glass-card">
                        <h3 className="mb-lg">Today's Schedule</h3>
                        {stats.tasks && stats.tasks.length > 0 ? (
                            <div className="timeline">
                                {stats.tasks
                                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                                    .map((task) => {
                                        const status = getTaskStatus(task._id);
                                        return (
                                            <div
                                                key={task._id}
                                                className={`task-item ${status?.status || 'pending'}`}
                                            >
                                                <div className="task-time">
                                                    <span className="time-start">{task.start_time}</span>
                                                    <span className="time-separator">-</span>
                                                    <span className="time-end">{task.end_time}</span>
                                                </div>
                                                <div className="task-content">
                                                    <h4 className="task-title">{task.title}</h4>
                                                    {task.description && (
                                                        <p className="task-description">{task.description}</p>
                                                    )}
                                                </div>
                                                <div className="task-actions">
                                                    {status?.status === 'completed' ? (
                                                        <span className="badge badge-success">✓ Completed</span>
                                                    ) : status?.status === 'missed' ? (
                                                        <span className="badge badge-error">✗ Missed</span>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="btn btn-success btn-sm"
                                                                onClick={(e) => markTask(e, task._id, 'completed')}
                                                            >
                                                                ✓ Complete
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-error btn-sm"
                                                                onClick={(e) => markTask(e, task._id, 'missed')}
                                                            >
                                                                ✗ Miss
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        ) : (
                            <p className="text-muted text-center">No tasks scheduled for this day</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default DailyView;
