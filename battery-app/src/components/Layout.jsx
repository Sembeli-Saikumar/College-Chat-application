import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Battery, MapPin, ClipboardList, RefreshCcw, LogOut } from 'lucide-react';

export default function Layout({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Products', path: '/app/products', icon: Battery },
    { name: 'Branches', path: '/app/branches', icon: MapPin },
    { name: 'Registrations', path: '/app/registrations', icon: ClipboardList },
    { name: 'Replacements', path: '/app/replacements', icon: RefreshCcw },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-battery-blue text-white flex flex-col shadow-xl z-10 hidden md:flex">
        <div className="p-6 flex items-center border-b border-blue-900 bg-battery-red">
          <span className="text-2xl font-bold tracking-wider text-white">SUNCO POWER</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/app'}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-battery-red text-white shadow-md'
                      : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5 mr-3" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-blue-900">
          <button 
            onClick={handleLogout} 
            className="flex flex-row items-center w-full px-4 py-3 text-blue-200 hover:bg-red-600 hover:text-white rounded-lg font-medium transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm flex items-center justify-between px-8 py-4 border-b border-gray-200 h-16">
          <div className="md:hidden">
            <span className="text-xl font-bold text-battery-red tracking-wider">SUNCO POWER</span>
          </div>
          <div className="hidden md:block">
            {/* Header placeholder */}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-gray-600">Admin User</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
