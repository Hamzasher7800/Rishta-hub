import { Navigate } from "react-router-dom";
import { auth } from "./firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profiles...</p>
        </div>
      </div>
    );
  }

  // ✅ agar user login nahi to redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ agar user login hai to page dikhana
  return children;
};

export default ProtectedRoute;
