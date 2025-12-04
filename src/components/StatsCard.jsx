import React from 'react';

const StatsCard = ({ title, value, subtitle, icon, gradient = 'primary' }) => {
    const gradients = {
        primary: 'var(--gradient-primary)',
        secondary: 'var(--gradient-secondary)',
        success: 'var(--gradient-success)',
        error: 'var(--gradient-error)'
    };

    return (
        <div
            className="stats-card fade-in"
            style={{ background: gradients[gradient] }}
        >
            <div className="flex-between mb-sm">
                <span className="stats-label">{title}</span>
                {icon && <span style={{ fontSize: '1.5rem' }}>{icon}</span>}
            </div>
            <div className="stats-value">{value}</div>
            {subtitle && <div className="stats-label">{subtitle}</div>}
        </div>
    );
};

export default StatsCard;
