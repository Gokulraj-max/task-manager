import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const location = useLocation();

  const navItemStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    color: location.pathname === path ? '#2563eb' : '#64748b',
    background: location.pathname === path ? '#eff6ff' : 'transparent',
    fontWeight: location.pathname === path ? '600' : '500',
    marginBottom: '0.5rem'
  });

  return (
    <aside style={{ width: '240px', background: '#fff', borderRight: '1px solid #e5e7eb', padding: '1.5rem' }}>
      <Link to="/dashboard" style={navItemStyle('/dashboard')}>📊 Dashboard</Link>
      <Link to="/profile" style={navItemStyle('/profile')}>👤 Profile</Link>
    </aside>
  );
};
