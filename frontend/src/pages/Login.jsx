import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user } = res.data;
      
      // Backend sets cookie automatically, no need to save anything
      // Just redirect based on role
      if (user.role === 'DRIVER') {
        nav('/driver');
      } else {
        nav('/user');
      }
    } catch(err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      alert(errorMsg);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input required type="email" value={email} onChange={e=>setEmail(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input required type="password" value={password} onChange={e=>setPassword(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-amber-400" />
          </div>
          <button disabled={loading} className="w-full bg-amber-500 text-white py-2 rounded">
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">Don't have an account? <a className="text-amber-600" href="/signup">Sign up</a></p>
      </div>
    </div>
  );
}