import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import About from "./Pages/About";
import Signup from "./Component/Auth/Signup";
import Login from "./Component/Auth/Login";
import ForgotPassword from "./Component/Auth/ForgotPassword";
import CompleteProfile from "./Pages/CompleteProfile";
import MyProfile from "./Pages/MyProfile";
import ProfilePage from "./Pages/ProfilePage";
import ViewProfile from "./Pages/ViewProfile";
import AddRishta from "./Pages/AddRishta";
import ProtectedRoute from "./ProtectedRoute";
import ScrollToTop from "./Component/ScrollToTop";
import { AuthProvider } from "./context/AuthContext"; // ✅ AuthProvider import kiya
import PaymentPage from "./Pages/PaymentPage";

function App() {
  return (
    <>
      {/* ✅ Mobile-friendly ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          fontSize: "14px",
        }}
        toastStyle={{
          borderRadius: "12px",
          margin: "10px",
          minHeight: "50px",
        }}
      />

      {/* ✅ AuthProvider se wrap kiya pure app ko */}
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* ✅ Public routes (only these 3 allowed without login) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* ✅ All other routes protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact-us"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complete-profile"
              element={
                <ProtectedRoute>
                  <CompleteProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-profile"
              element={
                <ProtectedRoute>
                  <AddRishta />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-profile/:userId"
              element={
                <ProtectedRoute>
                  <ViewProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;