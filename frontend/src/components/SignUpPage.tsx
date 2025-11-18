import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export class SignUpPage extends React.Component {
  render() {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 
                      bg-gradient-to-br from-black via-gray-900 to-gray-800">

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-4xl font-extrabold 
                         bg-gradient-to-r from-purple-400 to-cyan-400
                         text-transparent bg-clip-text drop-shadow-lg mb-10">
            Create Your Account
          </h2>

          <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl shadow-2xl border border-white/10">
            <SignUp
              appearance={{
                elements: {
                  rootBox: 'mx-auto',
                  card: 'shadow-2xl rounded-xl bg-white/5 backdrop-blur-xl border border-white/10'
                }
              }}
              fallbackRedirectUrl="/user-type"
              signInUrl="/sign-in"
            />
          </div>
        </div>
      </div>
    );
  }
}
