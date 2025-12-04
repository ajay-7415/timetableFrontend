import React from 'react';
import './Skeleton.css';

// Base Skeleton component
export const Skeleton = ({ width, height, borderRadius, className = '' }) => (
    <div
        className={`skeleton ${className}`}
        style={{
            width: width || '100%',
            height: height || '20px',
            borderRadius: borderRadius || '8px'
        }}
    />
);

// Text line skeleton
export const SkeletonText = ({ lines = 1, width = '100%' }) => (
    <div className="skeleton-text">
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                width={i === lines - 1 ? '70%' : width}
                height="16px"
                className="skeleton-line"
            />
        ))}
    </div>
);

// Card skeleton for stats
export const SkeletonCard = () => (
    <div className="glass-card skeleton-card">
        <div className="skeleton-card-header">
            <Skeleton width="50px" height="50px" borderRadius="12px" />
            <div className="skeleton-card-text">
                <Skeleton width="60%" height="14px" />
                <Skeleton width="40%" height="24px" />
            </div>
        </div>
    </div>
);

// Task item skeleton
export const SkeletonTask = () => (
    <div className="task-item skeleton-task">
        <div className="skeleton-task-time">
            <Skeleton width="60px" height="16px" />
            <Skeleton width="10px" height="16px" />
            <Skeleton width="60px" height="16px" />
        </div>
        <div className="skeleton-task-content">
            <Skeleton width="70%" height="20px" />
            <Skeleton width="90%" height="14px" />
            <Skeleton width="80px" height="24px" borderRadius="20px" />
        </div>
        <div className="skeleton-task-actions">
            <Skeleton width="80px" height="32px" borderRadius="8px" />
            <Skeleton width="60px" height="32px" borderRadius="8px" />
        </div>
    </div>
);

// Target card skeleton
export const SkeletonTarget = () => (
    <div className="glass-card skeleton-target">
        <div className="flex-between mb-sm">
            <Skeleton width="60%" height="20px" />
            <Skeleton width="70px" height="24px" borderRadius="20px" />
        </div>
        <SkeletonText lines={2} />
        <div className="flex-between mt-sm">
            <Skeleton width="140px" height="14px" />
            <Skeleton width="100px" height="20px" />
        </div>
    </div>
);

// Table row skeleton
export const SkeletonTableRow = ({ columns = 5 }) => (
    <tr className="skeleton-row">
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i}>
                <Skeleton width={i === 0 ? '70%' : '80%'} height="18px" />
            </td>
        ))}
    </tr>
);

// Full Daily View Skeleton
export const DailyViewSkeleton = () => (
    <div className="daily-view">
        <div className="view-header">
            <Skeleton width="150px" height="32px" />
            <div className="date-controls flex gap-md">
                <Skeleton width="100px" height="38px" borderRadius="8px" />
                <Skeleton width="150px" height="38px" borderRadius="8px" />
                <Skeleton width="100px" height="38px" borderRadius="8px" />
                <Skeleton width="80px" height="38px" borderRadius="8px" />
            </div>
        </div>

        <div className="stats-grid grid grid-3 mb-xl">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>

        <div className="glass-card mb-lg">
            <Skeleton width="100px" height="24px" className="mb-md" />
            <div className="progress-bar">
                <Skeleton width="60%" height="100%" borderRadius="10px" />
            </div>
        </div>

        <div className="tasks-timeline glass-card">
            <Skeleton width="180px" height="24px" className="mb-lg" />
            <div className="timeline">
                <SkeletonTask />
                <SkeletonTask />
                <SkeletonTask />
            </div>
        </div>
    </div>
);

// Full Weekly View Skeleton
export const WeeklyViewSkeleton = () => (
    <div className="weekly-view">
        <div className="view-header">
            <Skeleton width="180px" height="32px" />
            <div className="flex gap-md">
                <Skeleton width="120px" height="38px" borderRadius="8px" />
                <Skeleton width="120px" height="38px" borderRadius="8px" />
            </div>
        </div>

        <div className="stats-grid grid grid-4 mb-xl">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>

        <div className="glass-card">
            <table className="weekly-table">
                <thead>
                    <tr>
                        {['Task', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <th key={day}><Skeleton width="40px" height="16px" /></th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <SkeletonTableRow columns={8} />
                    <SkeletonTableRow columns={8} />
                    <SkeletonTableRow columns={8} />
                    <SkeletonTableRow columns={8} />
                </tbody>
            </table>
        </div>
    </div>
);

// Full Target Manager Skeleton
export const TargetManagerSkeleton = () => (
    <div className="container">
        <div className="header-section mb-lg">
            <Skeleton width="200px" height="32px" />
            <Skeleton width="280px" height="18px" className="mt-sm" />
        </div>

        <div className="grid grid-2">
            <div className="glass-card" style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <Skeleton width="60px" height="60px" borderRadius="50%" className="mb-md" style={{ margin: '0 auto' }} />
                    <Skeleton width="150px" height="20px" />
                </div>
            </div>

            <div className="targets-list">
                <Skeleton width="150px" height="24px" className="mb-md" />
                <div className="grid gap-md">
                    <SkeletonTarget />
                    <SkeletonTarget />
                    <SkeletonTarget />
                </div>
            </div>
        </div>
    </div>
);

// Timetable Manager Skeleton
export const TimetableManagerSkeleton = () => (
    <div className="container">
        <div className="header-section mb-lg">
            <Skeleton width="220px" height="32px" />
            <Skeleton width="200px" height="18px" className="mt-sm" />
        </div>

        <div className="glass-card mb-lg">
            <Skeleton width="180px" height="24px" className="mb-md" />
            <div className="grid grid-2 gap-md">
                <div className="form-group">
                    <Skeleton width="80px" height="16px" className="mb-sm" />
                    <Skeleton width="100%" height="42px" borderRadius="8px" />
                </div>
                <div className="form-group">
                    <Skeleton width="100px" height="16px" className="mb-sm" />
                    <Skeleton width="100%" height="42px" borderRadius="8px" />
                </div>
            </div>
        </div>

        <div className="glass-card">
            <Skeleton width="160px" height="24px" className="mb-md" />
            <SkeletonTask />
            <SkeletonTask />
            <SkeletonTask />
        </div>
    </div>
);

export default Skeleton;
