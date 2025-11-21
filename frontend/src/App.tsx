import { useEffect, ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import { setAuthToken } from "./config/api";

// Page Components
import LandingPage from "./components/LandingPage";
import SignUpPage from "./components/SignUpPage";
import SignInPage from "./components/SignInPage";
import UserTypePage from "./components/UserType";
import UserRegistration from "./components/UserRegistration";
import DriverRegistration from "./components/DriverRegistration";
import UserDashboard from "./components/UserDashboard";
import DriverDashboard from "./components/DriverDashboard";

// Loading Component
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[linear-gradient(180deg,#0b1020_0%,#07102a_100%)]">
      <div className="text-white/80 text-xl">Loading...</div>
    </div>
  );
}

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    async function loadToken() {
      const token = await getToken();
      if (token) {
        setAuthToken(token);
      }
    }

    loadToken();
  }, [isSignedIn, getToken]);

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

// Dashboard Router - Routes to correct dashboard based on user type
function DashboardRouter() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  // Check both publicMetadata (set by backend) and unsafeMetadata (set by client)
  const userType = (user?.publicMetadata?.userType || user?.unsafeMetadata?.userType) as string | undefined;

  if (!userType) {
    return <Navigate to="/user-type" replace />;
  }

  if (userType === "user") {
    return <UserDashboard />;
  }

  if (userType === "driver") {
    return <DriverDashboard />;
  }

  return <Navigate to="/user-type" replace />;
}

// Main App Component
function App() {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-900/20">
        <div className="text-red-400 text-xl text-center p-4">
          <p className="font-bold">Configuration Error</p>
          <p className="text-sm mt-2">Missing VITE_CLERK_PUBLISHABLE_KEY environment variable</p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
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

          {/* Protected Routes */}
          <Route
            path="/user-type"
            element={
              <ProtectedRoute>
                <UserTypePage />
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

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;