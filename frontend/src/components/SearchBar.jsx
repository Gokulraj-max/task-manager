import React from 'react';

export const SearchBar = ({ search, onSearchChange, status, onStatusChange, priority, onPriorityChange }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      <input
        type="text"
        className="form-input"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ flex: 1, minWidth: '200px' }}
      />
      <select className="form-input" value={status} onChange={(e) => onStatusChange(e.target.value)} style={{ width: 'auto' }}>
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <select className="form-input" value={priority} onChange={(e) => onPriorityChange(e.target.value)} style={{ width: 'auto' }}>
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  );
};
