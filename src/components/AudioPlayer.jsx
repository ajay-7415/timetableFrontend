import React, { useState, useEffect } from 'react';
import './AudioPlayer.css';

function AudioPlayer() {
    const [audioLinks, setAudioLinks] = useState([]);
    const [newLink, setNewLink] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');

    // Load audio links from localStorage on mount
    useEffect(() => {
        const savedLinks = localStorage.getItem('audioLinks');
        if (savedLinks) {
            try {
                setAudioLinks(JSON.parse(savedLinks));
            } catch (error) {
                console.error('Error loading audio links:', error);
            }
        }
        setIsLoading(false);
    }, []);

    // Convert Google Drive link to embeddable format
    const getGoogleDriveFileId = (link) => {
        if (link.includes('drive.google.com')) {
            let fileId = '';
            // Format: https://drive.google.com/file/d/FILE_ID/view
            if (link.includes('/file/d/')) {
                fileId = link.split('/file/d/')[1].split('/')[0];
            }
            // Format: https://drive.google.com/open?id=FILE_ID
            else if (link.includes('id=')) {
                fileId = link.split('id=')[1].split('&')[0];
            }
            return fileId;
        }
        setCurrentlyPlaying(audio);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Start editing title
    const handleStartEdit = (audio) => {
        setEditingId(audio.id);
        setEditingTitle(audio.title);
    };

    // Save edited title
    const handleSaveTitle = (audioId) => {
        if (!editingTitle.trim()) {
            alert('Title cannot be empty');
            return;
        }

        const updatedLinks = audioLinks.map(audio =>
            audio.id === audioId
                ? { ...audio, title: editingTitle.trim() }
                : audio
        );

        setAudioLinks(updatedLinks);
        localStorage.setItem('audioLinks', JSON.stringify(updatedLinks));
        setEditingId(null);
        setEditingTitle('');
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingTitle('');
    };

    if (isLoading) {
        return (
            <div className="audio-player-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="audio-player-container animate-fadeIn">
            {/* Header */}
            <div className="audio-header mb-lg">
                <div className="flex-between">
                    <div>
                        <h2 className="animate-fadeInLeft">🎵 Audio Library</h2>
                        <p className="text-muted animate-fadeInLeft">
                            Add and listen to your favorite audio from Google Drive
                        </p>
                    </div>
                    <button
                        className="btn btn-primary animate-popIn"
                        onClick={() => setShowAddForm(true)}
                    >
                        ➕ Add Audio
                    </button>
                </div>
            </div>

            {/* Add Audio Form Modal */}
            {showAddForm && (
                <div className="modal-overlay animate-fadeIn" onClick={() => setShowAddForm(false)}>
                    <div className="modal-content glass-card animate-popIn" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header mb-md">
                            <h3>Add New Audio</h3>
                            <button
                                className="btn-icon modal-close"
                                onClick={() => setShowAddForm(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAddAudio}>
                            <div className="form-group">
                                <label className="form-label">Audio Title (Optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g., My Favorite Song"
                                />
                                <small className="text-muted mt-sm" style={{ display: 'block' }}>
                                    Give your audio a custom name (leave blank for auto-generated title)
                                </small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Google Drive Link</label>
                                <input
                                    type="url"
                                    className="form-input"
                                    value={newLink}
                                    onChange={(e) => setNewLink(e.target.value)}
                                    placeholder="https://drive.google.com/file/d/..."
                                    required
                                />
                                <small className="text-muted mt-sm" style={{ display: 'block' }}>
                                    📝 Paste your Google Drive audio file link. Make sure it's shared as "Anyone with the link"
                                </small>
                            </div>

                            <div className="flex gap-sm">
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    ✓ Add Audio
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>

                        <div className="info-box mt-md">
                            <strong>ℹ️ How to share Google Drive audio:</strong>
                            <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                                <li>Upload your audio file to Google Drive</li>
                                <li>Right-click the file → Share → Get link</li>
                                <li>Change to "Anyone with the link"</li>
                                <li>Copy the share link and paste it here</li>
                            </ol>
                        </div>
                    </div>
                </div>
            )}

            {/* Current Playing Audio */}
            {currentlyPlaying && (
                <div className="current-player glass-card mb-lg animate-slideInDown">
                    <div className="player-header mb-md">
                        <h3>🎧 Now Playing</h3>
                    </div>
                    <div className="player-info mb-md">
                        <h4>{currentlyPlaying.title}</h4>
                        <small className="text-muted">Added on {formatDate(currentlyPlaying.addedAt)}</small>
                    </div>
                    {/* Google Drive Embed Player */}
                    <div className="iframe-player-container">
                        <iframe
                            src={`https://drive.google.com/file/d/${currentlyPlaying.fileId}/preview`}
                            width="100%"
                            height="80"
                            allow="autoplay"
                            className="audio-iframe"
                            title={currentlyPlaying.title}
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Audio List */}
            <div className="audio-list">
                <h3 className="mb-md">Your Audio Collection ({audioLinks.length})</h3>

                {audioLinks.length === 0 ? (
                    <div className="empty-state glass-card text-center">
                        <div className="empty-icon mb-md">🎵</div>
                        <h3 className="mb-sm">No Audio Yet</h3>
                        <p className="text-muted mb-md">
                            Start building your audio library by adding your first audio file from Google Drive
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAddForm(true)}
                        >
                            ➕ Add Your First Audio
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-2 gap-md stagger-animation">
                        {audioLinks.map((audio, index) => (
                            <div
                                key={audio.id}
                                className={`audio-card glass-card animate-fadeInUp ${currentlyPlaying?.id === audio.id ? 'playing' : ''
                                    }`}
                            >
                                <div className="audio-card-header">
                                    <div className="audio-icon">
                                        {currentlyPlaying?.id === audio.id ? '🔊' : '🎵'}
                                    </div>
                                    <div className="audio-info">
                                        {editingId === audio.id ? (
                                            <div className="edit-title-container">
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={editingTitle}
                                                    onChange={(e) => setEditingTitle(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSaveTitle(audio.id);
                                                        if (e.key === 'Escape') handleCancelEdit();
                                                    }}
                                                    autoFocus
                                                    style={{ marginBottom: '0.5rem' }}
                                                />
                                                <div className="flex gap-sm">
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => handleSaveTitle(audio.id)}
                                                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                                    >
                                                        ✓ Save
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={handleCancelEdit}
                                                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                                                    >
                                                        ✕ Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                                                    <h4 style={{ flex: 1, marginRight: '0.5rem' }}>{audio.title}</h4>
                                                    <button
                                                        className="btn-icon"
                                                        onClick={() => handleStartEdit(audio)}
                                                        title="Edit title"
                                                        style={{ fontSize: '1.2rem' }}
                                                    >
                                                        ✏️
                                                    </button>
                                                </div>
                                                <small className="text-muted">
                                                    Added {formatDate(audio.addedAt)}
                                                </small>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary mt-md"
                                    style={{ width: '100%' }}
                                    onClick={() => handlePlayAudio(audio)}
                                >
                                    {currentlyPlaying?.id === audio.id ? '🔊 Playing' : '▶️ Play'}
                                </button>

                                <div className="audio-card-footer mt-sm">
                                    <small className="text-muted">
                                        🔒 Permanently saved • Track #{index + 1}
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Section */}
            {audioLinks.length > 0 && (
                <div className="info-banner glass-card mt-lg animate-fadeInUp">
                    <div className="flex gap-md" style={{ alignItems: 'center' }}>
                        <span style={{ fontSize: '2rem' }}>🔒</span>
                        <div>
                            <strong>Your audio is safe!</strong>
                            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                All audio links are permanently stored and cannot be removed. Build your collection with confidence!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AudioPlayer;
