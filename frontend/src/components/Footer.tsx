import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-transparent py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl p-6 bg-[rgba(255,255,255,0.02)] border border-white/6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-lg">Ready to book a driver?</div>
            <div className="text-sm text-white/70">
              Create an account and post your first booking in minutes.
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/sign-up")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 text-white font-medium hover:brightness-95 transition"
            >
              Sign up
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-4 py-2 rounded-lg border border-white/10 text-white/90 hover:bg-white/5 transition"
            >
              Contact us
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 text-white text-sm">
                🚗
              </div>
              <span className="font-semibold">DriveConnect</span>
            </div>

            <div className="flex gap-6 text-sm text-white/60">
              <button className="hover:text-white transition">Privacy Policy</button>
              <button className="hover:text-white transition">Terms of Service</button>
              <button className="hover:text-white transition">Support</button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-white/50">
            © {new Date().getFullYear()} DriveConnect. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;