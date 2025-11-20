import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
            <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="btn"
            >
                ← Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="btn"
            >
                Next →
            </button>
        </div>
    );
}