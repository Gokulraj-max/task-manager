import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2563eb' }}>📋 Task Manager</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <span>Welcome {user?.name} 👋</span>
        <Link to="/profile" style={{ textDecoration: 'none', color: '#64748b' }}>👤 Profile</Link>
        <button onClick={logout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626', fontWeight: '500' }}>🚪 Logout</button>
      </div>
    </nav>
  );
};
