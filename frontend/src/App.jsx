import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import DriverDashboard from './pages/DriverDashboard';
import SignUp from './pages/Signup';
import Header from './components/Header';

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<div className="text-center text-gray-600">Welcome to Drive Match — use the auth links above.</div>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/user" element={<UserDashboard/>} />
          <Route path="/driver" element={<DriverDashboard/>} />
        </Routes>
      </main>
    </div>
  );
}