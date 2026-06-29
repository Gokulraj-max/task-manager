import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name });
      setIsEditing(false);
      setMessage('Name updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update name');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '600px' }}>
      <div style={{ background: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>User Profile</h2>
        {message && <div style={{ color: '#16a34a', marginBottom: '1rem', fontWeight: '500' }}>✔ {message}</div>}
        {error && <div style={{ color: '#dc2626', marginBottom: '1rem', fontWeight: '500' }}>❌ {error}</div>}

        <div style={{ display: 'grid', gap: '1.25rem', fontSize: '1.05rem', marginBottom: '2rem' }}>
          <div>
            <strong>Name:</strong>{' '}
            {isEditing ? (
              <form onSubmit={handleSave} style={{ display: 'inline-flex', gap: '0.5rem', marginTop: '0.5rem', width: '100%' }}>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>Save</button>
                <button type="button" onClick={() => { setIsEditing(false); setName(user.name); }} className="btn" style={{ background: '#e2e8f0' }}>Cancel</button>
              </form>
            ) : (
              <span>
                {user.name}{' '}
                <button
                  onClick={() => setIsEditing(true)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#2563eb', marginLeft: '0.5rem' }}
                >
                  ✏️ Edit
                </button>
              </span>
            )}
          </div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
        </div>

        <button onClick={logout} className="btn" style={{ background: '#fee2e2', color: '#dc2626', width: '100%' }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};
