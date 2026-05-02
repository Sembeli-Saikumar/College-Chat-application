import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import DashboardHome from './pages/DashboardHome';
import Products from './pages/Products';
import Branches from './pages/Branches';
import Registrations from './pages/Registrations';
import Replacements from './pages/Replacements';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            isLoggedIn ? <Navigate to="/app" /> : <Login onLogin={() => setIsLoggedIn(true)} />
          } 
        />
        
        <Route 
          path="/app" 
          element={
            isLoggedIn ? <Layout onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/" />
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<Products />} />
          <Route path="branches" element={<Branches />} />
          <Route path="registrations" element={<Registrations />} />
          <Route path="replacements" element={<Replacements />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
