import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import ApiConfig from "../config/api";

const UserTypePage=()=> {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { getToken, isSignedIn } = useAuth();

 const handleSelect = async (type: "user" | "driver") => {
  if (!user) return;

  try {
    const token = await getToken();

    await ApiConfig.getClient().post(
      "/users/set-user-type",
      { userType: type },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    navigate(type === "user" ? "/register/user" : "/register/driver");
  } catch (err) {
    console.error("Failed to save user type:", err);
  }
};


  const handleLogout = () => {
  signOut(() => {
    navigate("/");
  });
};

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0a0f1f_0%,#0a0a22_100%)] 
                    text-white flex flex-col items-center px-4 py-8 antialiased">

      {/* Top Navbar */}
      <div className="w-full flex justify-between items-center mb-10 px-2 max-w-6xl">
        <h1 className="text-3xl font-extrabold tracking-tight 
                       bg-gradient-to-r from-purple-400 to-cyan-400 
                       text-transparent bg-clip-text drop-shadow-md">
          DriveConnect
        </h1>

        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-full bg-red-500/80 hover:bg-red-600 
                     text-white font-semibold shadow-lg transition-all backdrop-blur-md"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full mt-10">
        <h2 className="text-4xl font-extrabold text-center mb-10 
                       bg-gradient-to-r from-pink-400 to-indigo-400 
                       text-transparent bg-clip-text drop-shadow-md">
          Choose Your Account Type
        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          {/* USER CARD */}
          <button
            onClick={() => handleSelect("user")}
            className="p-10 rounded-3xl border border-white/10 
                       bg-white/5 backdrop-blur-xl shadow-xl 
                       hover:bg-white/10 hover:scale-105 hover:shadow-2xl 
                       transition-all"
          >
            <div className="text-6xl mb-6">👤</div>
            <h3 className="text-2xl font-bold mb-3 text-white">
              I Need a Driver
            </h3>
            <p className="text-gray-300 text-lg">
              Book skilled and professional drivers anytime.
            </p>
          </button>

          {/* DRIVER CARD */}
          <button
            onClick={() => handleSelect("driver")}
            className="p-10 rounded-3xl border border-white/10 
                       bg-white/5 backdrop-blur-xl shadow-xl 
                       hover:bg-white/10 hover:scale-105 hover:shadow-2xl 
                       transition-all"
          >
            <div className="text-6xl mb-6">🚗</div>
            <h3 className="text-2xl font-bold mb-3 text-white">
              I Am a Driver
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
