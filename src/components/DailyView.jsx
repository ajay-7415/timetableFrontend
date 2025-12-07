import React, { useState, useEffect } from 'react';
import { timetableAPI, trackingAPI } from '../services/api';
import { DailyViewSkeleton } from './Skeleton';
import StatsCard from './StatsCard';
import './DailyView.css';

const DailyView = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDailyData();
    }, [date]);

    // Auto-miss tasks that have passed their end time (works even if user was offline)
    useEffect(() => {
        const autoMarkMissed = async () => {
            if (!stats?.tasks) return;

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

            console.log(`⏰ Auto-marking ${tasksToMark.length} task(s) as missed`);

            // Mark all tasks without reloading after each one
            for (const task of tasksToMark) {
                try {
                    await trackingAPI.mark({
                        timetable_id: task._id,
                        completion_date: date,
                        status: 'missed'
                    });
                    console.log(`  ✓ ${task.title} (ended at ${task.end_time})`);
                } catch (error) {
                    console.error(`  ✗ Failed to mark ${task.title}:`, error);
                }
            }

            // Reload data only once after all tasks are marked
            console.log(`✅ Reloading data...`);
            loadDailyData();
        };

        // Check immediately when component loads
        autoMarkMissed();

        // Also check every minute for real-time updates
        const interval = setInterval(autoMarkMissed, 60000);

        return () => clearInterval(interval);
    }, [date]); // Only depend on date, not stats - prevents infinite loop

    const loadDailyData = async () => {
        setLoading(true);
        try {
            const response = await trackingAPI.getDaily(date);
            setStats(response.data);
        } catch (error) {
            console.error('Error loading daily data:', error);
        } finally {
            setLoading(false);
        }
    };

    const markTask = async (taskId, status) => {
        try {
            await trackingAPI.mark({
                timetable_id: taskId,
                completion_date: date,
                status
            });
            loadDailyData();
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
        if (!stats?.completions) return null;
        return stats.completions.find(c => c.timetable_id === taskId);
    };

    if (loading) {
        return <DailyViewSkeleton />;
    }

    return (
        <div className="daily-view">
            <div className="view-header">
                <h2>Daily View</h2>
                <div className="date-controls flex gap-md">
                    <button className="btn btn-secondary" onClick={() => changeDate(-1)}>
                        ← Previous
                    </button>
                    <input
                        type="date"
                        className="form-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ width: 'auto' }}
                    />
                    <button className="btn btn-secondary" onClick={() => changeDate(1)}>
                        Next →
                    </button>
                    <button className="btn btn-primary" onClick={() => setDate(new Date().toISOString().split('T')[0])}>
                        Today
                    </button>
                </div>
            </div>

            {stats && (
                <>
                    <div className="stats-grid grid grid-3 mb-xl">
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
                                                    <div className="task-status-badge">
                                                        {status?.status === 'completed' && (
                                                            <span className="badge badge-success">✓ Completed</span>
                                                        )}
                                                        {status?.status === 'missed' && (
                                                            <span className="badge badge-error">✗ Missed</span>
                                                        )}
                                                        {!status && (
                                                            <span className="badge badge-warning">⏳ Pending</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="task-actions">
                                                    {(!status || status.status !== 'completed') && (
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => markTask(task._id, 'completed')}
                                                        >
                                                            ✓ Complete
                                                        </button>
                                                    )}
                                                    {(!status || status.status !== 'missed') && (
                                                        <button
                                                            className="btn btn-error btn-sm"
                                                            onClick={() => markTask(task._id, 'missed')}
                                                        >
                                                            ✗ Miss
                                                        </button>
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
