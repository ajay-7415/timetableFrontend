import React from 'react';
import './Badges.css';

const Badges = ({ badges }) => {
    if (!badges || badges.length === 0) {
        return (
            <div className="badges-empty glass-card">
                <span className="empty-icon">🏆</span>
                <p>No badges yet. Keep completing tasks to earn them!</p>
            </div>
        );
    }

    return (
        <div className="badges-container glass-card">
            <h3 className="section-title">Your Achievements</h3>
            <div className="badges-grid">
                {badges.map((badge) => (
                    <div key={badge.id} className="badge-item" title={badge.description}>
                        <div className="badge-icon">{badge.icon}</div>
                        <div className="badge-info">
                            <span className="badge-name">{badge.name}</span>
                            <span className="badge-desc">{badge.description}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Badges;
