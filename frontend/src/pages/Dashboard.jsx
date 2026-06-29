import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { tasksAPI } from '../services/api';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';

export const Dashboard = () => {
  const { tasks, total, totalPages, fetchTasks } = useTasks();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks({ page, limit: 10, search, status, priority });
  }, [fetchTasks, page, search, status, priority]);

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      await tasksAPI.updateTask(editingTask.id, taskData);
    } else {
      await tasksAPI.createTask(taskData);
    }
    setIsModalOpen(false);
    setEditingTask(null);
    fetchTasks({ page, limit: 10, search, status, priority });
  };

  const handleMarkComplete = async (id) => {
    await tasksAPI.markComplete(id);
    fetchTasks({ page, limit: 10, search, status, priority });
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await tasksAPI.deleteTask(id);
      fetchTasks({ page, limit: 10, search, status, priority });
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Dashboard Overview</h2>
        <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="btn btn-primary" style={{ width: 'auto' }}>
          ➕ Create Task
        </button>
      </div>

      <SearchBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
      />

      <div>
        {tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '3rem' }}>No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
              onDelete={handleDeleteTask}
              onComplete={handleMarkComplete}
            />
          ))
        )}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {isModalOpen && (
        <TaskForm
          initialTask={editingTask}
          onSave={handleSaveTask}
          onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        />
      )}
    </div>
  );
};
