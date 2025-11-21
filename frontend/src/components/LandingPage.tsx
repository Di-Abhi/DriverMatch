import Header from "./Header";
import Hero from "./Hero";
import Footer from "./Footer";

function LandingPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0b1020_0%,#07102a_100%)] text-white antialiased">
      <Header />
      <Hero />

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DriveConnect?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Verified Drivers</h3>
              <p className="text-white/70">All drivers undergo thorough background checks and license verification.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Quick Booking</h3>
              <p className="text-white/70">Book a driver in minutes with our simple and fast booking process.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-white/70">No hidden fees. See exactly what you pay before confirming.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[linear-gradient(180deg,#07102a_0%,#0b1020_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Sign Up", desc: "Create your account in seconds" },
              { step: "2", title: "Browse Drivers", desc: "Find verified drivers near you" },
              { step: "3", title: "Send Request", desc: "Choose your booking period" },
              { step: "4", title: "Get Connected", desc: "Driver accepts and you're set!" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;