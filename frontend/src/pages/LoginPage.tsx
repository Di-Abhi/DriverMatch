import React, { FC, useState } from 'react';
import axios from "axios";

import type { AppDispatch, GoogleAuthResponse, } from '../types/auth';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

const ACCENT_COLOR = 'teal-600'; 
const HOVER_COLOR = 'teal-700';
 
type SetErrors = React.Dispatch<React.SetStateAction<{ message: string | null }>>;

const LoginPage: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Simulate login attempt delay
    setTimeout(() => {
        console.log(`Login attempt for: ${email}`);
        alert(`Login attempt simulated.`);
        setIsSubmitted(false);
    }, 1000);
  };
    const handleGoogleSignin = async (
      authResponse: GoogleAuthResponse, 
  dispatch: AppDispatch, 
  setErrors: SetErrors
    ) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/google-auth",
        {
          idToken: authResponse.credential,
        },
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: "SET_USER",
        payload: response.data.userDetails,
      });
    } catch (error) {
      console.log(error);
      setErrors({ message: "Something went wrong while google signin" });
    }
  };
  const handleGoogleSigninFailure = async (error:string) => {
    console.log(error);
    setErrors({ message: "Something went wrong while google signin" });
  };

  return (
    // Main container mimics the phone screen size and background
    <div className="min-h-screen flex items-center justify-center p-2">
      
      {/* Login Card (White background, heavily rounded) */}
      <div className="w-full max-w-sm bg-white p-6 sm:p-8">
        
        {/* Header Section */}
        <div className="mb-25 flex flex-col justify-center items-center">
          <h1 className="text-4xl font-semibold text-gray-900">Log In</h1>
          <p className="mt-1 text-gray-500 text-m">Hi! Welcome back, you've been missed</p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Styling based on the reference: subtle border, rounded corners
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 
                         focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 
                         focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
            />
          </div>
          
          {/* Forgot Password Link (Right aligned) */}
          <div className="flex justify-end text-sm">
            <a href="#" className={`font-medium text-${ACCENT_COLOR} hover:text-${HOVER_COLOR} transition duration-150`}>
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitted}
              // Main button styling: solid accent color, full rounded, shadow
              className={`w-full flex justify-center  py-3 px-4 border border-transparent text-lg font-medium 
                         rounded-xl shadow-md text-black bg-green-400 hover:bg-green-500 cursor-pointer 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 
                         transition duration-300 ease-in-out ${isSubmitted ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitted ? (
                <Spinner/>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Separator */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or sign in with
            </span>
          </div>
        </div>

        {/* Social Sign In Icons */}
        <div className="flex justify-center space-x-6">
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSignin}
            onError={handleGoogleSigninFailure}
          />
        </GoogleOAuthProvider>
        </div>
        
        {/* Sign Up Link */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account? 
          <Link to="/signup" className={`font-medium text-green-500 hover:text-${HOVER_COLOR} ml-1 transition duration-150 underline`}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;