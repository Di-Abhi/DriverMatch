import React from "react";
import { SignIn } from "@clerk/clerk-react";

const SignInPage=()=> {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 
                    bg-gradient-to-br from-black via-gray-900 to-gray-800">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          className="text-center text-4xl font-extrabold 
                     bg-gradient-to-r from-cyan-400 to-purple-500
                     text-transparent bg-clip-text drop-shadow-lg mb-10"
        >
          Welcome Back
        </h2>

        <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/10">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card:
                  "shadow-2xl rounded-xl bg-white/5 backdrop-blur-xl border border-white/10",
              },
            }}
            fallbackRedirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}

export default SignInPage