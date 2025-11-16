import React, { FC, useState } from 'react';
import UserDriverToggle from '../components/UserDriverToggle';
import type { AppDispatch, GoogleAuthResponse } from '../types/auth';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';

const ACCENT_COLOR = 'teal-600'; 
const HOVER_COLOR = 'teal-700';

type SetErrors = React.Dispatch<React.SetStateAction<{ message: string | null }>>;

const SignUpPage: FC = () => {
    const [activeRole, setActiveRole] = useState<'user' | 'driver'>('user');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [licenseNumber, setLicenseNumber] = useState<string>('');
  const [agreed, setAgreed] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [role,setRole]=useState<string>('user')
  const [errors,setErrors]=useState<{[ket:string]:string}>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    // Check for agreement before proceeding
    if (!agreed) {
        alert('You must agree to the Terms & Conditions.');
        setIsSubmitted(false);
        return;
    }

    // Simulate registration delay
    setTimeout(() => {
        console.log(`User attempting to register: ${name} (${email})`);
        alert(`Registration simulated for ${name}.`);
        setIsSubmitted(false);
    }, 1200);
  };

  const handleRoleSelection=(role: 'user'|'driver')=>{
    setActiveRole(role);
    setName('')
    setEmail('')
    setPassword('')
    setLicenseNumber('')
    setRole(role)
  }
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
  const handleGoogleSigninFailure = async (errors:string) => {
    console.log(errors);
    setErrors({ message: "Something went wrong while google signin" });
  };
  return (
    // Main container mimics the phone screen size and background
    <div className="min-h-screen flex items-center justify-center p-4">
      
      {/* Sign Up Card (White background, heavily rounded) */}
      <div className="w-full max-w-sm bg-white p-6 sm:p-8">
        
        {/* Header Section */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Create Account</h1>
          <p className="mt-1 text-gray-500 text-sm">Fill your information below or register with your social account.</p>
        </div>
        <UserDriverToggle onToggle={handleRoleSelection}/>

        {/* Sign Up Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              id="name"
              type="text"
              required
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 
                         focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 
                         focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="sr-only">Phone</label>
            <input
              id="phone"
              type="phone"
              required
              placeholder="Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 
                         focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
            />
          </div>

          {/* Password Input (with placeholder for an eye icon) */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 
                         focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition duration-150"
            />
            {/* Placeholder for the eye icon */}
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                {/* Replace with an actual eye SVG */}
                👁️
            </span>
          </div>
          {activeRole === 'driver' && (
            <div className="animate-fade-in"> 
              <input
                id="license"
                type="text"
                required
                placeholder="Driver's License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
              />
            </div>
          )}
          
          {/* Terms & Conditions Checkbox */}
          <div className="flex items-center pt-2">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              // Custom checkbox styling using accent color
              className={`h-4 w-4 text-${ACCENT_COLOR} border-gray-300 rounded focus:ring-teal-500`}
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
              Agree with 
              <a href="#" className={`font-medium text-${ACCENT_COLOR} hover:text-${HOVER_COLOR} ml-1 transition duration-150`}>
                Terms & Condition
              </a>
            </label>
          </div>

          {/* Sign Up Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitted || !agreed}
              // Main button styling: solid accent color, full rounded, shadow
              className={`w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium 
                         rounded-xl shadow-md text-black bg-green-400 hover:bg-green-500 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 
                         transition duration-300 ease-in-out 
                         ${(isSubmitted || !agreed) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitted ? (
                <Spinner/>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>

        {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or sign up with
            </span>
          </div>
        </div>

        {/* Social Sign Up Icons */}
        <div>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSignin}
            onError={handleGoogleSigninFailure}
          />
        </GoogleOAuthProvider>
        </div>
        
        {/* Already have an account link */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account? 
          <Link to='/login' className={`font-medium text-green-400 hover:text-${HOVER_COLOR} ml-1 transition duration-150 underline`}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;