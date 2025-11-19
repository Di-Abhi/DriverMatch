import React from 'react'
import { useNavigate } from 'react-router-dom'


const Header = () => {
    const navigate = useNavigate();
  return (
          <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-violet-500 text-white shadow-lg">🚗</div>
              <div>
                <div className="text-lg font-extrabold tracking-tight">DriveConnect</div>
                <div className="text-xs text-white/70 -mt-1">Connect • Book • Drive</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/about')} className="text-sm text-white/80 hover:text-white transition">About</button>
              <button onClick={() => navigate('/how-it-works')} className="text-sm text-white/80 hover:text-white transition">How it works</button>
              <button onClick={() => navigate('/faqs')} className="text-sm text-white/80 hover:text-white transition">FAQ</button>
            </nav>

            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/sign-in')} className="px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:bg-white/5 transition">Login</button>
              <button onClick={() => navigate('/sign-up')} className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 text-white text-sm font-semibold shadow-lg transform hover:scale-[1.02] transition">Sign Up</button>
              <div className="md:hidden">
                <button aria-label="menu" className="p-2 rounded-md text-white/80">☰</button>
              </div>
            </div>
          </div>
        </div>
      </header>
  )
}

export default Header
