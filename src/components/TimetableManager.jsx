import React, { useState, useEffect } from 'react';
import { timetableAPI } from '../services/api';
import './TimetableManager.css';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimetableManager = () => {
    const [entries, setEntries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_time: '09:00',
        end_time: '10:00',
        is_recurring: true,
        exclude_days: []
    });

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        try {
            const response = await timetableAPI.getAll();
            setEntries(response.data);
        } catch (error) {
            console.error('Error loading entries:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await timetableAPI.update(editingId, formData);
            } else {
                await timetableAPI.create(formData);
            }
            loadEntries();
            resetForm();
        } catch (error) {
            console.error('Error saving entry:', error);
        }
    };

    const handleEdit = (entry) => {
        setFormData({
            title: entry.title,
            description: entry.description || '',
            start_time: entry.start_time,
            end_time: entry.end_time,
            is_recurring: entry.is_recurring,
            exclude_days: entry.exclude_days || []
        });
        setEditingId(entry._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await timetableAPI.delete(id);
                loadEntries();
            } catch (error) {
                console.error('Error deleting entry:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            start_time: '09:00',
            end_time: '10:00',
            is_recurring: true,
            exclude_days: []
        });
        setEditingId(null);
        setShowForm(false);
    };

    const toggleExcludeDay = (dayIndex) => {
        const newExcludeDays = formData.exclude_days.includes(dayIndex)
            ? formData.exclude_days.filter(d => d !== dayIndex)
            : [...formData.exclude_days, dayIndex];
        setFormData({ ...formData, exclude_days: newExcludeDays });
    };

    const getExcludedDaysText = (excludeDays) => {
        if (!excludeDays || excludeDays.length === 0) return 'Every day';
        const excluded = excludeDays.map(d => DAYS[d]).join(', ');
        return `Except: ${excluded}`;
    };

    return (
        <div className="timetable-manager">
            <div className="manager-header flex-between mb-lg">
                <h2>Manage Timetable</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Cancel' : '+ Add Entry'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card mb-lg fade-in">
                    <h3 className="mb-md">{editingId ? 'Edit Entry' : 'New Entry'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Optional details..."
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Start Time *</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={formData.start_time}
                                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">End Time *</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={formData.end_time}
                                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Holidays (Exclude Days)</label>
                            <div className="days-selector">
                                {DAYS.map((day, index) => (
                                    <label key={index} className="day-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={formData.exclude_days.includes(index)}
                                            onChange={() => toggleExcludeDay(index)}
                                        />
                                        <span>{day}</span>
                                    </label>
                                ))}
                            </div>
                            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                Select days when this task should NOT appear
                            </p>
                        </div>

                        <div className="flex gap-md">
                            <button type="submit" className="btn btn-primary">
                                {editingId ? 'Update' : 'Create'} Entry
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-card">
                <h3 className="mb-lg">All Timetable Entries</h3>
                {entries.length > 0 ? (
                    <div className="entries-list">
                        {entries
                            .sort((a, b) => a.start_time.localeCompare(b.start_time))
                            .map((entry) => (
                                <div key={entry._id} className="entry-card">
                                    <div className="entry-header">
                                        <div>
                                            <h4 className="entry-title">{entry.title}</h4>
                                            <div className="entry-meta">
                                                <span className="entry-time">
                                                    {entry.start_time} - {entry.end_time}
                                                </span>
                                                <span className="entry-schedule">
                                                    {getExcludedDaysText(entry.exclude_days)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="entry-actions">
                                            <button
                                                className="btn-icon btn-edit"
                                                onClick={() => handleEdit(entry)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-icon btn-delete"
                                                onClick={() => handleDelete(entry._id)}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    {entry.description && (
                                        <p className="entry-description">{entry.description}</p>
                                    )}
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="text-muted text-center">No timetable entries yet. Click "Add Entry" to create one.</p>
                )}
            </div>
        </div>
    );
};

export default TimetableManager;
