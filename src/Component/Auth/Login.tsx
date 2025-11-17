import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../Common/Button";
import CustomInput from "../Common/CustomInput";
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaWhatsapp } from "react-icons/fa";

// ✅ Firebase Imports
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import logo1 from "../../assets/images/RishtaHub__1.png";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ useLocation hook add kiya

  // ✅ Check karen ke user signup page se aa raha hai ya nahi
  const fromSignup = location.state?.fromSignup || false;

  // Format phone number (remove spaces, dashes, etc.)
  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, "");
    
    // If it doesn't start with +, assume it's a Pakistani number and add +92
    if (!cleaned.startsWith("+")) {
      // Remove leading 0 if present
      if (cleaned.startsWith("0")) {
        cleaned = cleaned.substring(1);
      }
      cleaned = "+92" + cleaned;
    }
    
    return cleaned;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Format phone number
      const formattedPhone = formatPhoneNumber(phoneNumber.trim());

      if (!formattedPhone || formattedPhone.length < 10) {
        setMessage("❌ Please enter a valid mobile number.");
        setLoading(false);
        return;
      }

      // ✅ Step 1: Look up user by phone number in Firestore
      const phoneQuery = query(
        collection(db, "users"),
        where("phoneNumber", "==", formattedPhone)
      );
      const phoneSnapshot = await getDocs(phoneQuery);

      if (phoneSnapshot.empty) {
        setMessage("❌ No account found with this mobile number. Please sign up first.");
        setLoading(false);
        return;
      }

      // Get the user document
      const userDoc = phoneSnapshot.docs[0];
      const userData = userDoc.data();
      const emailForAuth = userData.email; // This is the generated email

      if (!emailForAuth) {
        setMessage("❌ Account data is incomplete. Please contact support.");
        setLoading(false);
        return;
      }

      // ✅ Step 2: Login user with the generated email
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailForAuth,
        password
      );
      const user = userCredential.user;

      // ✅ Step 2: Fetch Firestore document (fresh data)
      const userRef = doc(db, "users", user.uid);
      let userSnap = await getDoc(userRef);

      // ✅ Step 3: Retry once if Firestore hasn't synced yet (rare)
      if (!userSnap.exists() || !userSnap.data().profileCompleted) {
        await new Promise((r) => setTimeout(r, 800));
        userSnap = await getDoc(userRef);
      }

      let shouldCompleteProfile = true;

      if (userSnap.exists()) {
        const data = userSnap.data();

        // ✅ Normalize boolean or string value
        const profileCompleted =
          data.profileCompleted === true || data.profileCompleted === "true";

        if (profileCompleted) shouldCompleteProfile = false;
      }

      // ✅ Step 4: Redirect logic with toast notifications
      if (shouldCompleteProfile) {
        toast.info("Please complete your profile first...", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => navigate("/complete-profile"), 1500);
      } else {
        toast.success("Welcome back! Redirecting to Home...", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => navigate("/home"), 1500);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.message || "Login failed. Please try again.";
      setMessage(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f7b5b5]">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#e67b7b]">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-20 flex flex-col justify-center p-16 text-white">
          <div className="max-w-md">
            <img src={logo1} alt="RishtaHub" className="w-[180px] h-auto" />

            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-8 w-8 text-yellow-300" />
              <span className="text-lg font-semibold text-yellow-300">
                Rishta Hub
              </span>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Continue Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Journey
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Sign in to access your personalized dashboard and continue from
              where you left off.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Secure & encrypted login</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Access your personal data</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">24/7 Customer support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-10 text-center">
            {/* Logo on top */}
            <div className="flex justify-center mb-4">
              <img src={logo1} alt="RishtaHub" className="w-[180px] h-auto" />
            </div>

            {/* Heading and description */}
            <h1 className="text-xl text-gray-700 mb-3">Wellcome To</h1>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
              Rishta Hub
            </h1>
            <p className="font-semibold">Genuine People - Real Rishtay</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100/80 backdrop-blur-sm">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                Sign In
              </h2>
              <p className="text-gray-500 text-lg">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Mobile Number Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 tracking-wide">
                  Mobile Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <CustomInput
                    type="tel"
                    placeholder="03001234567 or +923001234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-11 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter your registered mobile number
                </p>
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700 tracking-wide">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-blue-600 hover:text-indigo-500 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <CustomInput
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`p-4 rounded-xl border-2 text-sm font-medium ${
                    message.toLowerCase().includes("error") ||
                    message.toLowerCase().includes("fail")
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-green-50 border-green-200 text-green-700"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-[#e67b7b] to-[#d86a6a] 
             hover:from-[#d86a6a] hover:to-[#c75b5b] text-white shadow-lg hover:shadow-xl 
             transform hover:-translate-y-0.5 transition-all duration-200 
             rounded-xl flex items-center justify-center gap-2 group"
                value={
                  loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )
                }
              />

              {/* ✅ CONDITIONAL RENDERING: Only show divider and signup button if NOT from signup */}
              {!fromSignup && (
                <>
                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-sm text-gray-500 font-medium">
                        New to our platform?
                      </span>
                    </div>
                  </div>

                  {/* Signup Button */}
                  <Button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="w-full h-14 text-base font-semibold bg-blue-400 border-2 border-blue-400 text-white hover:bg-blue-500 hover:border-blue-500 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg"
                    value="Create New Account"
                  />
                </>
              )}
            </form>

            {/* Need Any Help Section - نیا section یہاں شامل کیا ہے */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex flex-col items-center space-y-4">
                {/* Heading */}
                <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Need Any Help?
                </h3>

                {/* WhatsApp Number */}
                <p className="text-green-700 font-semibold text-base">
                  WhatsApp: 03297748360
                </p>

                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/923297748360?text=Hello%20RishtaHub%2C%20I%20need%20assistance%20with%20login`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
    w-full 
    bg-green-600 hover:bg-green-700 
    text-white font-semibold 
    rounded-xl 
    transition-all duration-200 
    flex items-center justify-center gap-3 
    shadow-lg hover:shadow-xl 
    transform hover:-translate-y-0.5 
    text-sm sm:text-base md:text-lg 
    py-2 sm:py-3 md:py-4 
    px-3 sm:px-4 md:px-6
  "
                >
                  <FaWhatsapp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  <span className="truncate">Message on WhatsApp</span>
                </a>

                {/* Additional Help Text */}
                <p className="text-green-600 text-sm mt-2">
                  We're here to help you 24/7
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our{" "}
                <button className="text-blue-600 hover:text-indigo-500 font-medium">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-blue-600 hover:text-indigo-500 font-medium">
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
