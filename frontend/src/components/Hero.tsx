import React from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate=useNavigate();
  return (
    <main className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Section */}
            <div>
              <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
                Professional drivers, on your schedule
              </h1>

              <p className="mt-4 text-lg text-white/80 max-w-xl">
                Easily find verified drivers for hourly, daily, or long-term bookings...
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => navigate('/sign-up')} className="px-7 py-3 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-600 to-indigo-500 text-white font-semibold shadow-2xl hover:brightness-105 transition">Get started</button>
                <button onClick={() => navigate('/sign-in')} className="px-7 py-3 rounded-full border border-white/10 text-white/90 font-medium hover:bg-white/5 transition">Sign in</button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-pink-400">✔</div>
                  <div>
                    <div className="font-medium">Verified drivers</div>
                    <div className="text-sm text-white/70">License & background checks</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-cyan-300">🔒</div>
                  <div>
                    <div className="font-medium">Secure contacts</div>
                    <div className="text-sm text-white/70">Shared after booking confirmation</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/70">
                <div className="border border-white/6 rounded-full px-3 py-1">Fast bookings</div>
                <div className="border border-white/6 rounded-full px-3 py-1">Safe payments</div>
                <div className="border border-white/6 rounded-full px-3 py-1">24/7 support</div>
              </div>
            </div>

            {/* Featured Driver Card */}
            <div className="mx-auto w-full max-w-md">
              <div className="rounded-3xl shadow-2xl overflow-hidden border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] backdrop-blur-md">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/60">Featured driver</div>
                      <div className="font-semibold">Ramesh Kumar</div>
                    </div>
                    <div className="text-sm text-white/80">4.8 ★</div>
                  </div>

                  <div className="mt-5 rounded-lg p-4 border border-white/6 bg-white/3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/60">From</div>
                        <div className="font-medium">Indiranagar, Bengaluru</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white/60">Rate</div>
                        <div className="font-semibold">₹ 450 / hr</div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-white/80">
                      <div>Shift: Morning</div>
                      <div>Vehicle: Innova</div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button onClick={() => navigate('/book/1')} className="flex-1 px-3 py-2 rounded-md bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-medium hover:opacity-95 transition">Request</button>
                      <button onClick={() => navigate('/driver/1')} className="px-3 py-2 rounded-md border border-white/8 text-white/90 hover:bg-white/5 transition">View</button>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-white/70">
                    Fast bookings • Verified IDs • Safe payments
                  </div>
                </div>

                <div className="px-6 py-4 bg-gradient-to-r from-transparent to-white/2 border-t border-white/6 text-sm text-white/70">
                  <div className="flex items-center justify-between">
                    <div>Available in your city</div>
                    <div className="text-xs text-white/50">Est. arrival 15–30 min</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Testimonials */}
          <div className="mt-12">
            <div className="rounded-xl p-4 border border-white/6 bg-gradient-to-r from-transparent to-white/2 overflow-x-auto no-scrollbar flex gap-4">
              <div className="min-w-[220px] p-3 bg-[rgba(255,255,255,0.03)] border border-white/6 rounded-lg">
                <div className="text-sm text-white/80">"Driver arrived on time and was very professional."</div>
                <div className="mt-3 font-medium">— Asha, Bengaluru</div>
              </div>

              <div className="min-w-[220px] p-3 bg-[rgba(255,255,255,0.03)] border border-white/6 rounded-lg">
                <div className="text-sm text-white/80">"Easy booking and transparent rates."</div>
                <div className="mt-3 font-medium">— Rahul, Delhi</div>
              </div>

              <div className="min-w-[220px] p-3 bg-[rgba(255,255,255,0.03)] border border-white/6 rounded-lg">
                <div className="text-sm text-white/80">"Great for long-term hires."</div>
                <div className="mt-3 font-medium">— Meera, Hyderabad</div>
              </div>
            </div>
          </div>
        </div>
      </main>
  )
}

export default Hero
