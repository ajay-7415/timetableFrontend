import React, { useState, useEffect } from 'react';
import { subscriptionAPI } from '../services/api';
import './SubscriptionManager.css';

function SubscriptionManager() {
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchSubscriptionStatus();
    }, []);

    const fetchSubscriptionStatus = async () => {
        try {
            setLoading(true);
            const response = await subscriptionAPI.getStatus();
            setSubscriptionData(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch subscription status');
            console.error('Subscription status error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        try {
            setProcessing(true);
            setError(null);

            // Create subscription order
            const orderResponse = await subscriptionAPI.createOrder();
            const { subscriptionId, razorpayKey } = orderResponse.data;

            // Configure Razorpay options
            const options = {
                key: razorpayKey,
                subscription_id: subscriptionId,
                name: 'Timetable Tracker',
                description: 'Monthly Subscription - ₹50/month',
                image: '/logo.png',
                handler: async function (response) {
                    try {
                        // Verify payment on backend
                        await subscriptionAPI.verifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        alert('🎉 Subscription activated successfully!');
                        fetchSubscriptionStatus(); // Refresh status
                    } catch (err) {
                        alert('❌ Payment verification failed. Please contact support.');
                        console.error('Payment verification error:', err);
                    } finally {
                        setProcessing(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    }
                },
                theme: {
                    color: '#4f46e5'
                }
            };

            // Open Razorpay checkout
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create subscription order');
            setProcessing(false);
            console.error('Subscribe error:', err);
        }
    };

    const handleCancelSubscription = async () => {
        if (!window.confirm('Are you sure you want to cancel your subscription?')) {
            return;
        }

        try {
            setProcessing(true);
            await subscriptionAPI.cancelSubscription();
            alert('Subscription cancelled successfully');
            fetchSubscriptionStatus();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel subscription');
            console.error('Cancel error:', err);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="subscription-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    const { subscriptionStatus, isActive, trial } = subscriptionData || {};
    const daysRemaining = trial?.daysRemaining || 0;

    return (
        <div className="subscription-container">
            <div className="subscription-header">
                <h1>💎 Subscription Management</h1>
                <p>Manage your Timetable Tracker subscription</p>
            </div>

            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Subscription Status Card */}
            <div className={`status-card ${subscriptionStatus}`}>
                <div className="status-header">
                    <h2>Current Status</h2>
                    <span className={`status-badge ${subscriptionStatus}`}>
                        {subscriptionStatus === 'trial' && '🆓 Free Trial'}
                        {subscriptionStatus === 'active' && '✅ Active'}
                        {subscriptionStatus === 'cancelled' && '❌ Cancelled'}
                        {subscriptionStatus === 'inactive' && '⏸️ Inactive'}
                    </span>
                </div>

                {subscriptionStatus === 'trial' && (
                    <div className="trial-info">
                        <div className="trial-countdown">
                            <div className="countdown-circle">
                                <span className="days-number">{daysRemaining}</span>
                                <span className="days-label">days left</span>
                            </div>
                        </div>
                        <p className="trial-message">
                            {daysRemaining > 0
                                ? `Your free trial ends in ${daysRemaining} days. Subscribe now to continue using all features!`
                                : 'Your trial has expired. Subscribe to continue using the app.'
                            }
                        </p>
                        {trial?.trialEndsAt && (
                            <p className="trial-end-date">
                                Trial ends: {new Date(trial.trialEndsAt).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                )}

                {subscriptionStatus === 'active' && (
                    <div className="active-info">
                        <p className="success-message">
                            ✅ You have full access to all premium features!
                        </p>
                    </div>
                )}

                {(subscriptionStatus === 'inactive' || subscriptionStatus === 'cancelled') && (
                    <div className="inactive-info">
                        <p className="warning-message">
                            Your subscription is currently inactive. Subscribe to regain access to premium features.
                        </p>
                    </div>
                )}
            </div>

            {/* Premium Features */}
            <div className="features-card">
                <h2>✨ Premium Features</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <span className="feature-icon">📊</span>
                        <div className="feature-content">
                            <h3>Advanced Analytics</h3>
                            <p>Detailed statistics and progress tracking</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🎯</span>
                        <div className="feature-content">
                            <h3>Unlimited Targets</h3>
                            <p>Set and track unlimited goals</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">📅</span>
                        <div className="feature-content">
                            <h3>Custom Timetables</h3>
                            <p>Create unlimited custom schedules</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🎵</span>
                        <div className="feature-content">
                            <h3>Audio Player</h3>
                            <p>Study with your favorite music</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">📈</span>
                        <div className="feature-content">
                            <h3>Weekly & Monthly Views</h3>
                            <p>Comprehensive progress overview</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">☁️</span>
                        <div className="feature-content">
                            <h3>Cloud Sync</h3>
                            <p>Access your data from anywhere</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Card */}
            <div className="pricing-card">
                <div className="pricing-header">
                    <h2>Subscription Plan</h2>
                    <div className="price">
                        <span className="currency">₹</span>
                        <span className="amount">50</span>
                        <span className="period">/month</span>
                    </div>
                </div>
                <ul className="pricing-features">
                    <li>✓ All premium features included</li>
                    <li>✓ Unlimited timetables and targets</li>
                    <li>✓ Priority customer support</li>
                    <li>✓ Regular feature updates</li>
                    <li>✓ Cancel anytime</li>
                </ul>

                {subscriptionStatus !== 'active' ? (
                    <button
                        className="subscribe-btn"
                        onClick={handleSubscribe}
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span className="btn-spinner"></span>
                                Processing...
                            </>
                        ) : (
                            <>
                                💳 Subscribe Now
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        className="cancel-btn"
                        onClick={handleCancelSubscription}
                        disabled={processing}
                    >
                        {processing ? 'Processing...' : 'Cancel Subscription'}
                    </button>
                )}
            </div>

            {/* Info Section */}
            <div className="info-section">
                <h3>💡 Subscription Information</h3>
                <ul>
                    <li>Secure payment processing via Razorpay</li>
                    <li>Automatic renewal every month</li>
                    <li>Cancel anytime - no questions asked</li>
                    <li>Instant activation after payment</li>
                    <li>Email support at support@timetabletracker.com</li>
                </ul>
            </div>
        </div>
    );
}

export default SubscriptionManager;
