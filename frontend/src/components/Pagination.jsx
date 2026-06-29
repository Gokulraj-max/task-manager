import React from 'react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="btn"
        style={{ background: '#e2e8f0', opacity: currentPage === 1 ? 0.5 : 1 }}
      >
        &lt; Previous
      </button>
      <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: '600' }}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="btn"
        style={{ background: '#e2e8f0', opacity: currentPage === totalPages ? 0.5 : 1 }}
      >
        Next &gt;
      </button>
    </div>
  );
};
