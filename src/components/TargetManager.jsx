import React, { useState, useEffect } from 'react';
import { targetAPI } from '../services/api';

function TargetManager() {
    const [targets, setTargets] = useState([]);
    const [newTarget, setNewTarget] = useState({ title: '', description: '', deadline: '' });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTargets();
    }, []);

    const loadTargets = async () => {
        try {
            const { data } = await targetAPI.getAll();
            setTargets(data);
        } catch (error) {
            console.error('Failed to load targets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await targetAPI.create(newTarget);
            setNewTarget({ title: '', description: '', deadline: '' });
            loadTargets();
        } catch (error) {
            alert('Failed to create target');
        }
    };

    const handleToggle = async (id) => {
        try {
            await targetAPI.toggle(id);
            loadTargets();
        } catch (error) {
            console.error('Failed to toggle target:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this target?')) {
            try {
                await targetAPI.delete(id);
                loadTargets();
            } catch (error) {
                console.error('Failed to delete target:', error);
            }
        }
    };

    const isOverdue = (deadline) => {
        return new Date(deadline) < new Date();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container">
            <div className="header-section mb-lg">
                <h2>🎯 Target Manager</h2>
                <p className="text-muted">Set goals, track deadlines, and achieve more</p>
            </div>

            <div className="grid grid-2">
                {/* Create Target Section */}
                <div>
                    {!showCreateForm ? (
                        <button
                            className="btn btn-primary mb-md"
                            onClick={() => setShowCreateForm(true)}
                            style={{ width: '100%', height: '100%', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
                        >
                            <span style={{ fontSize: '2rem' }}>+</span>
                            <span>Create New Target</span>
                        </button>
                    ) : (
                        <div className="glass-card">
                            <div className="flex-between mb-md">
                                <h3>Create New Target</h3>
                                <button
                                    className="btn-icon"
                                    onClick={() => setShowCreateForm(false)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Target Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newTarget.title}
                                        onChange={(e) => setNewTarget({ ...newTarget, title: e.target.value })}
                                        placeholder="e.g., Complete Project X"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description (Optional)</label>
                                    <textarea
                                        className="form-textarea"
                                        value={newTarget.description}
                                        onChange={(e) => setNewTarget({ ...newTarget, description: e.target.value })}
                                        placeholder="Add details about your target..."
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deadline</label>
                                    <input
                                        type="datetime-local"
                                        className="form-input"
                                        value={newTarget.deadline}
                                        onChange={(e) => setNewTarget({ ...newTarget, deadline: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex gap-sm">
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                        Set Target
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowCreateForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Targets List */}
                <div className="targets-list">
                    <h3 className="mb-md">Your Targets</h3>
                    {isLoading ? (
                        <p>Loading targets...</p>
                    ) : targets.length === 0 ? (
                        <div className="glass-card text-center">
                            <p className="text-muted">No targets set yet. Create one to get started!</p>
                        </div>
                    ) : (
                        <div className="grid gap-md">
                            {targets.map((target) => {
                                const overdue = !target.isCompleted && isOverdue(target.deadline);
                                return (
                                    <div
                                        key={target._id}
                                        className={`glass-card target-card ${target.isCompleted ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}
                                        style={{
                                            borderLeft: `4px solid ${target.isCompleted ? 'var(--color-success)' : overdue ? 'var(--color-error)' : 'var(--color-accent-primary)'}`
                                        }}
                                    >
                                        <div className="flex-between mb-sm">
                                            <h4 style={{ textDecoration: target.isCompleted ? 'line-through' : 'none' }}>
                                                {target.title}
                                            </h4>
                                            <div className="flex gap-sm">
                                                {overdue && <span className="badge badge-error">Overdue</span>}
                                                {target.isCompleted && <span className="badge badge-success">Completed</span>}
                                                <button
                                                    onClick={() => handleDelete(target._id)}
                                                    className="btn-icon"
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                                    title="Delete Target"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                        {target.description && (
                                            <p className="text-muted mb-sm" style={{ fontSize: '0.9rem' }}>
                                                {target.description}
                                            </p>
                                        )}

                                        <div className="flex-between" style={{ marginTop: 'auto' }}>
                                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                Due: {formatDate(target.deadline)}
                                            </span>
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={target.isCompleted}
                                                    onChange={() => handleToggle(target._id)}
                                                    className="checkbox-input"
                                                />
                                                <span>Mark Complete</span>
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TargetManager;
