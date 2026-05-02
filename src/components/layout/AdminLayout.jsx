import React from 'react';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg text-text admin-theme animate-fade-in">
      {children}
    </div>
  );
}
