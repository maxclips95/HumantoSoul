import React from 'react';

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{
                padding: '10px',
                width: '100%',
                maxWidth: '400px',
                borderRadius: '20px',
                border: '1px solid #ccc',
                marginBottom: '20px',
                fontSize: '1rem'
            }}
        />
    );
}