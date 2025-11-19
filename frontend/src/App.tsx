import React, { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-react';
import LandingPageWrapper from './components/LandingPage';
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import UserTypePageWrapper from './components/UserType';
import UserRegistration from './components/UserRegistration';
import DriverRegistration from './components/DriverRegistration';
import UserDashboard from './components/UserDashboard';
import DriverDashboard from './components/DriverDashboard';
import ApiConfig from './config/api';

const ProtectedRoute=({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
  if (!isSignedIn) return;

  async function loadToken() {
    const token = await getToken();
    if (token) {
      ApiConfig.setAuthToken(token);
    }
  }

  loadToken();
  }, [isSignedIn]);


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

const DashboardRouter=()=> {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  const userType = user?.publicMetadata?.userType as string | undefined;

  if (!userType) {
    return <Navigate to="/user-type" replace />;
  }

  if (userType === "user") {
    return <UserDashboard />;
  } else if (userType === "driver") {
    return <DriverDashboard />;
  }
  return <Navigate to="/user-type" replace />;
}

const App = () => {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl">
          Missing Clerk Publishable Key.
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPageWrapper />} />

          {/* Sign Up */}
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

          {/* Sign In */}
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

          {/* User Type */}
          <Route
            path="/user-type"
            element={
              <ProtectedRoute>
                <UserTypePageWrapper />
              </ProtectedRoute>
            }
          />

          {/* Register User */}
          <Route
            path="/register/user"
            element={
              <ProtectedRoute>
                <UserRegistration />
              </ProtectedRoute>
            }
          />

          {/* Register Driver */}
          <Route
            path="/register/driver"
            element={
              <ProtectedRoute>
                <DriverRegistration />
              </ProtectedRoute>
            }
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          {/* User Dashboard */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Driver Dashboard */}
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
};

export default App;