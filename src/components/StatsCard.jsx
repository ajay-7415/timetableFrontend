import React from 'react';

const StatsCard = ({ title, value, subtitle, icon, gradient = 'primary' }) => {
    // Map gradients/types to CSS custom properties for text colors
    const textColors = {
        primary: 'var(--color-accent-secondary)',
        secondary: 'var(--color-text-secondary)',
        success: 'var(--color-success)',
        error: 'var(--color-error)'
    };

    const textColor = textColors[gradient] || textColors.primary;

    return (
        <div
            className="stats-card glass-card fade-in"
            style={{
                borderLeft: `4px solid ${textColor}`,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Subtle background glow based on color */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100%',
                height: '100%',
                background: textColor,
                filter: 'blur(80px)',
                opacity: 0.15,
                borderRadius: '50%',
                pointerEvents: 'none'
            }} />

            <div className="flex-between mb-sm" style={{ position: 'relative', zIndex: 1 }}>
                <span className="stats-label" style={{ color: 'var(--color-text-muted)' }}>{title}</span>
                {icon && (
                    <span style={{
                        fontSize: '1.5rem',
                        filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))'
                    }}>
                        {icon}
                    </span>
                )}
            </div>

            <div
                className="stats-value"
                style={{
                    color: 'white',
                    position: 'relative',
                    zIndex: 1,
                    textShadow: `0 0 20px ${textColor}40` // Subtle text glow
                }}
            >
                {value}
            </div>

            {subtitle && (
                <div
                    className="stats-label mt-xs"
                    style={{
                        color: textColor,
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    {subtitle}
                </div>
            )}
        </div>
    );
};

export default StatsCard;
