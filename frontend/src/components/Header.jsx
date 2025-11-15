import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get('/user/profile');
        setUser(res.data.user);
      } catch (err) {
        try {
          const d = await api.get('/driver/profile');
          setUser(d.data.user);
        } catch (e) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [location.pathname]);   // <– FIX: Re-run when route changes

  async function handleLogout() {
    await api.post('/auth/logout');
    setUser(null);
    navigate('/login');
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">DriveMatch</Link>

        <nav className="space-x-3">
          {!loading && !user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}

          {!loading && user && (
            <>
              <span>Hi, {user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
