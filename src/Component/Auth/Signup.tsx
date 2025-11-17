import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../Common/CustomInput";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Firebase Imports
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import logo1 from "../../assets/images/RishtaHub__1.png";

const Signup = () => {
  const navigate = useNavigate();

  // Signup form state
  const [signupData, setSignupData] = useState({
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    phoneNumber: "",
    password: "",
  });

  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupMessage, setSignupMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);


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

  // Validate phone number
  const isValidPhoneNumber = (phone: string): boolean => {
    const cleaned = formatPhoneNumber(phone);
    // Pakistani phone number format: +92XXXXXXXXXX (10 digits after +92)
    const phoneRegex = /^\+92\d{10}$/;
    return phoneRegex.test(cleaned);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupMessage("");

    // Basic validation
    if (!signupData.phoneNumber.trim()) {
      setSignupMessage("❌ Please enter your WhatsApp number.");
      setSignupLoading(false);
      return;
    }

    const formattedPhone = formatPhoneNumber(signupData.phoneNumber.trim());
    
    if (!isValidPhoneNumber(formattedPhone)) {
      setSignupMessage("❌ Please enter a valid WhatsApp number (e.g., 3218800544).");
      setSignupLoading(false);
      return;
    }

    if (!signupData.password) {
      setSignupMessage("❌ Please enter a password.");
      setSignupLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setSignupMessage("❌ Password should be at least 6 characters.");
      setSignupLoading(false);
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setSignupMessage("❌ Passwords do not match.");
      setSignupLoading(false);
      return;
    }

    try {
      // Check if phone number already exists
      const phoneQuery = query(
        collection(db, "users"),
        where("phoneNumber", "==", formattedPhone)
      );
      const phoneSnapshot = await getDocs(phoneQuery);

      if (!phoneSnapshot.empty) {
        setSignupMessage("❌ This WhatsApp number is already registered. Please login instead.");
        setSignupLoading(false);
        return;
      }

      // Generate a unique email for Firebase Auth (phone@rishtahub.local)
      const emailForAuth = `${formattedPhone.replace(/\+/g, "plus")}@rishtahub.local`;

      // Create user account with generated email
      const userCred = await createUserWithEmailAndPassword(
        auth,
        emailForAuth,
        signupData.password
      );

      // Save user info in Firestore with phone number
      await setDoc(doc(db, "users", userCred.user.uid), {
        phoneNumber: formattedPhone,
        email: emailForAuth, // Store generated email for reference
        uid: userCred.user.uid,
        profileCompleted: false,
        createdAt: new Date().toISOString(),
      });

      // Optional: sign out so user can login again (keeps behavior same as original)
      await signOut(auth);

      toast.success("✅ Account created successfully! Please login.");
      setSignupMessage("✅ Account created successfully! Please login below.");
      
      // Clear signup form
      setSignupData({
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      // Friendly Firebase error messages
      const friendlyMsg =
        error?.code === "auth/email-already-in-use"
          ? "This WhatsApp number is already registered."
          : error?.code === "auth/weak-password"
          ? "Password should be at least 6 characters."
          : error?.message || "An error occurred. Please try again.";

      setSignupMessage("❌ " + friendlyMsg);
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMessage("");

    try {
      // Format phone number
      const formattedPhone = formatPhoneNumber(loginData.phoneNumber.trim());

      if (!formattedPhone || formattedPhone.length < 10) {
        setLoginMessage("❌ Please enter a valid WhatsApp number.");
        setLoginLoading(false);
        return;
      }

      // ✅ Step 1: Look up user by phone number in Firestore
      const phoneQuery = query(
        collection(db, "users"),
        where("phoneNumber", "==", formattedPhone)
      );
      const phoneSnapshot = await getDocs(phoneQuery);

      if (phoneSnapshot.empty) {
        setLoginMessage("❌ No account found with this WhatsApp number. Please register first.");
        setLoginLoading(false);
        return;
      }

      // Get the user document
      const userDoc = phoneSnapshot.docs[0];
      const userData = userDoc.data();
      const emailForAuth = userData.email; // This is the generated email

      if (!emailForAuth) {
        setLoginMessage("❌ Account data is incomplete. Please contact support.");
        setLoginLoading(false);
        return;
      }

      // ✅ Step 2: Login user with the generated email
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailForAuth,
        loginData.password
      );
      const user = userCredential.user;

      // ✅ Step 3: Fetch Firestore document (fresh data)
      const userRef = doc(db, "users", user.uid);
      let userSnap = await getDoc(userRef);

      // ✅ Step 4: Retry once if Firestore hasn't synced yet (rare)
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

      // ✅ Step 5: Redirect logic with toast notifications
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
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.message || "Login failed. Please try again.";
      setLoginMessage("❌ " + errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f7b5b5]">
      {/* Left Side - Enhanced Image Section */}
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
              <span className="text-lg font-semibold text-yellow-300">
                Join Us Today!
              </span>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Start Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Journey
              </span>
            </h1>

            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Create your account and discover a world of possibilities tailored
              just for you.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">
                  Secure & encrypted registration
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Personalized experience</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">24/7 Customer support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section with Signup and Login */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-6">
          {/* Registration Section */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            {/* Bilingual Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Register your profile if you are new to this platform
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                اگر آپ اس پلیٹ فارم پر نئے ہیں تو اپنا پروفائل رجسٹر کریں
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Enter your WhatsApp number in the box below and press NEXT button
              </p>
              <p className="text-sm text-gray-600">
                نیچے دیے گئے خانے میں اپنا وٹس ایپ نمبر درج کریں اور NEXT کا بٹن دبائیں۔
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* WhatsApp Number Input - Two Part */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  WhatsApp Number
                </label>
                <div className="flex gap-2">
                  {/* Country Code Box */}
                  <div className="w-20">
                    <input
                      type="text"
                      value="+92"
                      readOnly
                      className="w-full h-14 px-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-semibold text-center cursor-not-allowed"
                    />
                  </div>
                  {/* Phone Number Input */}
                  <div className="flex-1">
                    <CustomInput
                      type="tel"
                      name="phoneNumber"
                      placeholder="3218800544"
                      value={signupData.phoneNumber}
                      onChange={(e) =>
                        setSignupData((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      className="w-full h-14 px-4 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <CustomInput
                    type={showSignupPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full h-14 px-4 pr-12 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700"
                  >
                    {showSignupPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <CustomInput
                    type={showSignupConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full h-14 px-4 pr-12 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowSignupConfirmPassword(!showSignupConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700"
                  >
                    {showSignupConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message Display */}
              {signupMessage && (
                <div
                  className={`p-3 rounded-lg text-sm font-medium ${
                    signupMessage.startsWith("✅")
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {signupMessage}
                </div>
              )}

              {/* NEXT Button */}
              <button
                type="submit"
                disabled={signupLoading}
                className="w-full h-14 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {signupLoading ? (
                  <>
                    <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  "NEXT"
                )}
              </button>
            </form>
          </div>

          {/* Login Section */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
            {/* Bilingual Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                If you are already registered on this platform, Enter your WhatsApp number and press LOG IN button
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                اگر آپ پلیٹ فارم پر پہلے سے رجسٹرڈ ہیں تو اپنا وٹس ایپ نمبر لکھیں اور LOG IN کا بٹن دبائیں
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* WhatsApp Number Input - Two Part */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  WhatsApp Number
                </label>
                <div className="flex gap-2">
                  {/* Country Code Box */}
                  <div className="w-20">
                    <input
                      type="text"
                      value="+92"
                      readOnly
                      className="w-full h-14 px-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-semibold text-center cursor-not-allowed"
                    />
                  </div>
                  {/* Phone Number Input */}
                  <div className="flex-1">
                    <CustomInput
                      type="tel"
                      name="phoneNumber"
                      placeholder="3218800544"
                      value={loginData.phoneNumber}
                      onChange={(e) =>
                        setLoginData((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      className="w-full h-14 px-4 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <CustomInput
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full h-14 px-4 pr-12 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message Display */}
              {loginMessage && (
                <div
                  className={`p-3 rounded-lg text-sm font-medium ${
                    loginMessage.startsWith("✅")
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {loginMessage}
                </div>
              )}

              {/* LOG IN Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full h-14 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "LOG IN"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
