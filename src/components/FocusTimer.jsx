import React, { useState, useEffect } from 'react';
import './FocusTimer.css';

const FocusTimer = ({ tasks }) => {
    const [currentTask, setCurrentTask] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const checkCurrentTask = () => {
            const now = new Date();
            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentTimeInMinutes = currentHours * 60 + currentMinutes;

            const activeTask = tasks.find(task => {
                const [startH, startM] = task.start_time.split(':').map(Number);
                const [endH, endM] = task.end_time.split(':').map(Number);

                const startTimeInMinutes = startH * 60 + startM;
                const endTimeInMinutes = endH * 60 + endM;

                return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
            });

            if (activeTask) {
                const [startH, startM] = activeTask.start_time.split(':').map(Number);
                const [endH, endM] = activeTask.end_time.split(':').map(Number);

                const startTimeInMinutes = startH * 60 + startM;
                const endTimeInMinutes = endH * 60 + endM;
                const totalDuration = endTimeInMinutes - startTimeInMinutes;
                const elapsed = currentTimeInMinutes - startTimeInMinutes;
                const remaining = endTimeInMinutes - currentTimeInMinutes;

                setCurrentTask(activeTask);
                setTimeLeft(remaining);
                setProgress(((totalDuration - elapsed) / totalDuration) * 100);
            } else {
                setCurrentTask(null);
                setTimeLeft(null);
            }
        };

        checkCurrentTask();
        const interval = setInterval(checkCurrentTask, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [tasks]);

    if (!currentTask) {
        return (
            <div className="focus-timer-container empty">
                <h3>No Active Task</h3>
                <p>Relax or prepare for your next task.</p>
            </div>
        );
    }

    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="focus-timer-container">
            <div className="timer-circle">
                <svg width="200" height="200" className="progress-ring">
                    <circle
                        className="progress-ring__circle-bg"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="12"
                        fill="transparent"
                        r={radius}
                        cx="100"
                        cy="100"
                    />
                    <circle
                        className="progress-ring__circle"
                        stroke="var(--color-primary)"
                        strokeWidth="12"
                        fill="transparent"
                        r={radius}
                        cx="100"
                        cy="100"
                        style={{
                            strokeDasharray: `${circumference} ${circumference}`,
                            strokeDashoffset: strokeDashoffset
                        }}
                    />
                </svg>
                <div className="timer-content">
                    <div className="time-remaining">{timeLeft}m</div>
                    <div className="time-label">REMAINING</div>
                </div>
            </div>
            <div className="current-task-info">
                <h2>{currentTask.title}</h2>
                <p>{currentTask.description}</p>
                <div className="task-times">
                    {currentTask.start_time} - {currentTask.end_time}
                </div>
            </div>
        </div>
    );
};

export default FocusTimer;
