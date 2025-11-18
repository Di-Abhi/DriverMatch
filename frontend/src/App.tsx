import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-react';
import { LandingPageWrapper } from './components/LandingPage';
import { SignUpPage } from './components/SignUpPage';
import { SignInPage } from './components/SignInPage';
import { UserTypePageWrapper } from './components/UserType';
import { UserRegistration } from './components/UserRegistration';
import { DriverRegistration } from './components/DriverRegistration';
import { UserDashboard } from './components/UserDashboard';
import { DriverDashboard } from './components/DriverDashboard';
import { ApiConfig } from './config/api';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  React.useEffect(() => {
    const setToken = async () => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          ApiConfig.setAuthToken(token);
        }
      }
    };
    setToken();
  }, [isSignedIn, getToken]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

function DashboardRouter() {
  const userType = localStorage.getItem('userType');
  const { isLoaded } = useUser();
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!userType) {
    return <Navigate to="/user-type" replace />;
  }
  
  if (userType === 'user') {
    return <UserDashboard />;
  } else if (userType === 'driver') {
    return <DriverDashboard />;
  }
  
  return <Navigate to="/user-type" replace />;
}

class App extends React.Component {
  render() {
    if (!clerkPubKey) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-600 text-xl">
            Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file
          </div>
        </div>
      );
    }

    return (
      <ClerkProvider publishableKey={clerkPubKey}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPageWrapper />} />
            
            <Route 
              path="/sign-up/*" 
              element={
                <>
                  <SignedIn>
                    <Navigate to="/user-type" replace />
                  </SignedIn>
                  <SignedOut>
                    <SignUpPage />
                  </SignedOut>
                </>
              } 
            />
            
            <Route 
              path="/sign-in/*" 
              element={
                <>
                  <SignedIn>
                    <Navigate to="/dashboard" replace />
                  </SignedIn>
                  <SignedOut>
                    <SignInPage />
                  </SignedOut>
                </>
              } 
            />
            
            <Route
              path="/user-type"
              element={
                <ProtectedRoute>
                  <UserTypePageWrapper />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/register/user"
              element={
                <ProtectedRoute>
                  <UserRegistration />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/register/driver"
              element={
                <ProtectedRoute>
                  <DriverRegistration />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/user"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard/driver"
              element={
                <ProtectedRoute>
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ClerkProvider>
    );
  }
}

export default App;