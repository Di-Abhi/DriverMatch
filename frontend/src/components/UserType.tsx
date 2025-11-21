import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";

function UserTypePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [loading, setLoading] = useState<"user" | "driver" | null>(null);

  const handleSelect = async (type: "user" | "driver") => {
    if (!user) return;

    setLoading(type);
    try {
      // Use unsafeMetadata for client-side storage
      // This will be used temporarily until registration is complete
      await user.update({
        unsafeMetadata: { userType: type },
      });

      // Navigate to the appropriate registration page
      const path = type === "user" ? "/register/user" : "/register/driver";
      navigate(path);
    } catch (err) {
      console.error("Failed to save user type:", err);
      alert("Failed to save user type. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0a0f1f_0%,#0a0a22_100%)] text-white flex flex-col items-center px-4 py-8 antialiased">
      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center mb-10 px-2 max-w-6xl">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text drop-shadow-md">
          DriveConnect
        </h1>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white font-semibold shadow-lg transition-all backdrop-blur-md"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full mt-10">
        <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-pink-400 to-indigo-400 text-transparent bg-clip-text drop-shadow-md">
          Choose Your Account Type
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* User Card */}
          <button
            onClick={() => handleSelect("user")}
            disabled={loading !== null}
            className="p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl hover:bg-white/10 hover:scale-105 hover:shadow-2xl transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="text-6xl mb-6">👤</div>
            <h3 className="text-2xl font-bold mb-3 text-white">
              {loading === "user" ? "Please wait..." : "I Need a Driver"}
            </h3>
            <p className="text-gray-300 text-lg">
              Book skilled and professional drivers anytime.
            </p>
          </button>

          {/* Driver Card */}
          <button
            onClick={() => handleSelect("driver")}
            disabled={loading !== null}
            className="p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl hover:bg-white/10 hover:scale-105 hover:shadow-2xl transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="text-6xl mb-6">🚗</div>
            <h3 className="text-2xl font-bold mb-3 text-white">
              {loading === "driver" ? "Please wait..." : "I Am a Driver"}
            </h3>
            <p className="text-gray-300 text-lg">
              Provide your driving services and get hired quickly.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserTypePage;