import React from 'react';
import { Battery, BatteryCharging, BatteryFull, Zap, Activity, Users, Settings, LogOut, Bell } from 'lucide-react';

export default function Dashboard({ onLogout }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-battery-blue text-white flex flex-col shadow-xl z-10 hidden md:flex">
        <div className="p-6 flex items-center border-b border-blue-900">
          <div className="bg-battery-red p-2 rounded-lg mr-3 shadow-sm border border-red-500">
            <BatteryFull className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-wider">SUNCO POWER</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center px-4 py-3 bg-blue-900 border-l-4 border-battery-red text-white rounded-r-lg font-medium transition-colors">
            <Activity className="h-5 w-5 mr-3" />
            Overview
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-blue-300 hover:bg-blue-900 hover:text-white rounded-lg font-medium transition-colors">
            <BatteryCharging className="h-5 w-5 mr-3" />
            Stations
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-blue-300 hover:bg-blue-900 hover:text-white rounded-lg font-medium transition-colors">
            <Zap className="h-5 w-5 mr-3" />
            Energy Usage
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-blue-300 hover:bg-blue-900 hover:text-white rounded-lg font-medium transition-colors">
            <Users className="h-5 w-5 mr-3" />
            Customers
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-blue-300 hover:bg-blue-900 hover:text-white rounded-lg font-medium transition-colors">
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </a>
        </nav>
        
        <div className="p-4 border-t border-blue-900">
          <button onClick={onLogout} className="flex flex-row items-center w-full px-4 py-3 text-blue-300 hover:bg-red-600 hover:text-white rounded-lg font-medium transition-colors">
            <LogOut className="h-5 w-5 mr-3" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm flex items-center justify-between px-8 py-4 border-b border-gray-200">
          <div className="flex items-center md:hidden">
            <span className="text-xl font-bold text-battery-blue tracking-wider">SUNCO POWER</span>
          </div>
          <h1 className="hidden md:block text-2xl font-bold text-gray-800">System Overview</h1>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-battery-red transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-battery-red rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-full border-2 border-battery-silver overflow-hidden flex items-center justify-center bg-gray-200">
              <span className="text-gray-600 font-bold">AD</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-red-50 text-battery-red rounded-bl-full flex items-start justify-end p-3 transition-transform group-hover:scale-110">
                <Zap className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Total Power Output</p>
              <h3 className="text-3xl font-bold text-gray-800">4,250 <span className="text-lg text-gray-500 font-normal">kWh</span></h3>
              <p className="text-sm font-medium text-green-600 mt-2 flex items-center">
                ↑ 12.5% from last week
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-16 w-16 bg-blue-50 text-battery-blue rounded-bl-full flex items-start justify-end p-3 transition-transform group-hover:scale-110">
                <Battery className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Active Stations</p>
              <h3 className="text-3xl font-bold text-gray-800">128 <span className="text-lg text-gray-500 font-normal">/ 150</span></h3>
              <p className="text-sm font-medium text-green-600 mt-2 flex items-center">
                ↑ 5 new online today
              </p>
            </div>
            
            <div className="bg-battery-red text-white rounded-xl shadow-md p-6 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-20">
                <BatteryCharging className="h-32 w-32" />
              </div>
              <p className="text-sm font-semibold text-red-200 mb-1 uppercase tracking-wider">System Status</p>
              <h3 className="text-3xl font-bold text-white mb-2">Optimal</h3>
              <div className="flex items-center">
                <span className="flex h-3 w-3 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium">All systems charging</span>
              </div>
            </div>
          </div>

          {/* Chart / List Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Recent Charging Sessions</h3>
                <button className="text-sm font-medium text-battery-blue hover:text-battery-red">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="pb-3 text-sm font-semibold text-gray-500">Station ID</th>
                      <th className="pb-3 text-sm font-semibold text-gray-500">Energy (kWh)</th>
                      <th className="pb-3 text-sm font-semibold text-gray-500">Duration</th>
                      <th className="pb-3 text-sm font-semibold text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-800">DC-Fast-102</td>
                      <td className="py-4 text-gray-600">45.2</td>
                      <td className="py-4 text-gray-600">42m 10s</td>
                      <td className="py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Completed</span></td>
                    </tr>
                    <tr className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-800">AC-Level2-04</td>
                      <td className="py-4 text-gray-600">12.8</td>
                      <td className="py-4 text-gray-600">1h 15m</td>
                      <td className="py-4"><span className="px-2 py-1 bg-blue-100 text-battery-blue rounded-full text-xs font-bold flex items-center w-max"><Zap className="h-3 w-3 mr-1" /> Charging</span></td>
                    </tr>
                    <tr className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-800">DC-Fast-105</td>
                      <td className="py-4 text-gray-600">--</td>
                      <td className="py-4 text-gray-600">--</td>
                      <td className="py-4"><span className="px-2 py-1 bg-red-100 text-battery-red rounded-full text-xs font-bold">Maintenance</span></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-800">AC-Level2-12</td>
                      <td className="py-4 text-gray-600">28.4</td>
                      <td className="py-4 text-gray-600">3h 05m</td>
                      <td className="py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-battery-blue rounded-xl shadow-sm border border-blue-900 text-white p-6 relative">
              <h3 className="text-lg font-bold mb-6 flex items-center">
                <Battery className="h-5 w-5 mr-2 text-battery-red" /> 
                Battery Health
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-200">Main Grid</span>
                    <span className="font-bold">98%</span>
                  </div>
                  <div className="w-full bg-blue-900 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-200">Backup Storage</span>
                    <span className="font-bold">75%</span>
                  </div>
                  <div className="w-full bg-blue-900 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-200">Solar Array</span>
                    <span className="font-bold">42%</span>
                  </div>
                  <div className="w-full bg-blue-900 rounded-full h-2">
                    <div className="bg-battery-red h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-blue-800">
                <button className="w-full py-2 bg-blue-800 hover:bg-blue-700 border border-blue-600 rounded-lg text-sm font-bold transition-colors">
                  Run Diagnostics
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
