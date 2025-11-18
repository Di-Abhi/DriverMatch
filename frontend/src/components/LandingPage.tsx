import React from 'react';
import { useNavigate } from 'react-router-dom';

export class LandingPage extends React.Component<{ navigate: any }> {
  render() {
    const { navigate } = this.props;

    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#0b1020_0%,#07102a_100%)] text-white antialiased">
        {/* Header (vibes-themed) */}
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

        {/* Hero (vibrant) */}
        <main className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">Professional drivers, on your schedule</h1>
                <p className="mt-4 text-lg text-white/80 max-w-xl">Easily find verified drivers for hourly, daily, or long-term bookings. Quick requests, secure contact sharing, transparent pricing, and ratings you can trust — all with a smooth, modern experience.</p>

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

                {/* Small badges */}
                <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/70">
                  <div className="flex items-center gap-2 border border-white/6 rounded-full px-3 py-1">Fast bookings</div>
                  <div className="flex items-center gap-2 border border-white/6 rounded-full px-3 py-1">Safe payments</div>
                  <div className="flex items-center gap-2 border border-white/6 rounded-full px-3 py-1">24/7 support</div>
                </div>
              </div>

              {/* Preview card with glass effect */}
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

                    <div className="mt-4 text-sm text-white/70">Fast bookings • Verified IDs • Safe payments</div>
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

            {/* Testimonial strip */}
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

        {/* How it works */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center">How it works</h2>
            <p className="text-center mt-2 text-white/70">Three simple steps to book a driver.</p>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border bg-[rgba(255,255,255,0.02)] shadow-sm hover:shadow-md transition">
                <div className="text-3xl">1️⃣</div>
                <h3 className="mt-4 font-semibold">Sign up</h3>
                <p className="mt-2 text-sm text-white/70">Create your profile as a user or driver and verify your details.</p>
              </div>

              <div className="p-6 rounded-xl border bg-[rgba(255,255,255,0.02)] shadow-sm hover:shadow-md transition">
                <div className="text-3xl">2️⃣</div>
                <h3 className="mt-4 font-semibold">Request</h3>
                <p className="mt-2 text-sm text-white/70">Browse drivers, check availability and send a booking request.</p>
              </div>

              <div className="p-6 rounded-xl border bg-[rgba(255,255,255,0.02)] shadow-sm hover:shadow-md transition">
                <div className="text-3xl">3️⃣</div>
                <h3 className="mt-4 font-semibold">Ride</h3>
                <p className="mt-2 text-sm text-white/70">Driver accepts and contact details are shared securely.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-[linear-gradient(180deg,#07102a_0%,#07102a_100%)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center">Why choose DriveConnect?</h3>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="rounded-lg p-6 bg-[rgba(255,255,255,0.02)] border shadow-sm">
                <h4 className="font-semibold">For users</h4>
                <ul className="mt-4 space-y-2 text-white/80">
                  <li>✓ Browse verified drivers</li>
                  <li>✓ Flexible booking periods</li>
                  <li>✓ Secure contact exchange</li>
                </ul>
              </div>

              <div className="rounded-lg p-6 bg-[rgba(255,255,255,0.02)] border shadow-sm">
                <h4 className="font-semibold">For drivers</h4>
                <ul className="mt-4 space-y-2 text-white/80">
                  <li>✓ Verified license upload</li>
                  <li>✓ Manage availability</li>
                  <li>✓ Accept or decline requests</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <footer className="bg-transparent py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl p-6 bg-[rgba(255,255,255,0.02)] border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-bold text-lg">Ready to book a driver?</div>
                <div className="text-sm text-white/70">Create an account and post your first booking in minutes.</div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => navigate('/sign-up')} className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 text-white">Sign up</button>
                <button onClick={() => navigate('/contact')} className="px-4 py-2 rounded-lg border border-white/10 text-white/90">Contact us</button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-white/50">© {new Date().getFullYear()} DriveConnect</div>
          </div>
        </footer>
      </div>
    );
  }
}

export function LandingPageWrapper() {
  const navigate = useNavigate();
  return <LandingPage navigate={navigate} />;
}
