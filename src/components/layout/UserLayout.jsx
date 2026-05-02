import React from 'react';

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg text-text animate-fade-in">
      {children}
    </div>
  );
}
