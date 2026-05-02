import React, { useState } from 'react';
import { Battery, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden relative">
        {/* Top Accent Line */}
        <div className="h-2 w-full bg-battery-red absolute top-0 left-0"></div>
        
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="bg-battery-blue text-white p-4 rounded-xl shadow-lg relative -top-2 border-b-4 border-battery-silver">
              <Battery size={40} className="text-battery-silver animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-center text-battery-blue mb-2">SUNCO POWER</h2>
          <p className="text-center text-gray-500 mb-8 font-medium">Power up your workflow</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-battery-red focus:border-battery-red sm:text-sm bg-gray-50 focus:bg-white transition-colors"
                  placeholder="admin@suncopower.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-battery-red focus:border-battery-red sm:text-sm bg-gray-50 focus:bg-white transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-battery-red focus:ring-battery-red border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-battery-blue hover:text-battery-red transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-battery-red to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-battery-red transition-all"
            >
              Sign In to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        </div>
        
        {/* Bottom Accent */}
        <div className="bg-gray-100 py-4 text-center border-t border-gray-200">
          <p className="text-xs text-gray-500">Secure 256-bit encrypted login</p>
        </div>
      </div>
    </div>
  );
}
