import React from 'react';

export const TaskCard = ({ task, onEdit, onDelete, onComplete }) => {
  const isCompleted = task.status === 'completed';

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h4 style={{ fontSize: '1.1rem', textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#64748b' : '#1e293b' }}>
          {task.title}
        </h4>
        <span className={`badge badge-priority-${task.priority}`}>{task.priority.toUpperCase()}</span>
      </div>
      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>{task.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-pending'}`}>
          {isCompleted ? '✔ Completed' : 'Pending'}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!isCompleted && <button onClick={() => onComplete(task.id)} style={{ padding: '0.375rem 0.625rem', cursor: 'pointer', background: '#dcfce7', border: 'none', borderRadius: '0.375rem' }}>✔</button>}
          <button onClick={() => onEdit(task)} style={{ padding: '0.375rem 0.625rem', cursor: 'pointer', background: '#f1f5f9', border: 'none', borderRadius: '0.375rem' }}>✏️</button>
          <button onClick={() => onDelete(task.id)} style={{ padding: '0.375rem 0.625rem', cursor: 'pointer', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.375rem' }}>🗑️</button>
        </div>
      </div>
    </div>
  );
};
