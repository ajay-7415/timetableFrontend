import React from 'react';
import './SubscriptionModal.css';

function SubscriptionModal({ isOpen, onClose, message, onSubscribe }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content subscription-modal">
                <div className="modal-icon">🔒</div>
                <h2>Subscription Required</h2>
                <p className="modal-message">{message || 'Your free trial has expired. Please subscribe to continue using the app.'}</p>

                <div className="modal-features">
                    <h3>What you'll get:</h3>
                    <ul>
                        <li>✅ Unlimited timetables and targets</li>
                        <li>✅ Advanced analytics and tracking</li>
                        <li>✅ Audio player integration</li>
                        <li>✅ Cloud sync across devices</li>
                        <li>✅ Priority support</li>
                    </ul>
                </div>

                <div className="modal-pricing">
                    <span className="price">₹200</span>
                    <span className="period">/month</span>
                </div>

                <div className="modal-actions">
                    <button className="btn-subscribe-now" onClick={onSubscribe}>
                        💎 Subscribe Now
                    </button>
                    <button className="btn-close" onClick={onClose}>
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionModal;
