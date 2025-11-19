import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Firebase Imports
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import logo1 from "../../assets/images/RishtaHub__1.png";

const Signup = () => {
  const navigate = useNavigate();

  // Signup form state
  const [signupData, setSignupData] = useState({
    countryCode: "+92",
    phoneNumber: "",
    password: "",
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    countryCode: "+92",
    phoneNumber: "",
    password: "",
  });

  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupMessage, setSignupMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Country codes for specified countries
  const countryCodes = [
    { code: "+92", country: "Pakistan" },
    { code: "+91", country: "India" },
    { code: "+966", country: "Saudi Arabia" },
    { code: "+971", country: "United Arab Emirates (UAE)" },
    { code: "+974", country: "Qatar" },
    { code: "+968", country: "Oman" },
    { code: "+965", country: "Kuwait" },
    { code: "+60", country: "Malaysia" },
    { code: "+82", country: "South Korea" },
    { code: "+27", country: "South Africa" },
    { code: "+81", country: "Japan" },
    { code: "+90", country: "Turkey" },
    { code: "+44", country: "United Kingdom (UK)" },
    { code: "+1", country: "Canada" },
    { code: "+49", country: "Germany" },
    { code: "+39", country: "Italy" },
    { code: "+61", country: "Australia" },
    { code: "+1", country: "United States (USA)" },
    { code: "+86", country: "China" },
    { code: "+46", country: "Sweden" },
    { code: "+34", country: "Spain" },
    { code: "+33", country: "France" },
    { code: "+47", country: "Norway" },
    { code: "+45", country: "Denmark" },
    { code: "+351", country: "Portugal" },
    { code: "+32", country: "Belgium" },
    { code: "+30", country: "Greece" },
    { code: "+353", country: "Ireland" },
    { code: "+41", country: "Switzerland" },
    { code: "+48", country: "Poland" },
  ];

  // Format phone number (remove spaces, dashes, etc.)
  const formatPhoneNumber = (phone: string, countryCode: string): string => {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, "");
    
    // If it doesn't start with +, add the country code
    if (!cleaned.startsWith("+")) {
      // Remove leading 0 if present
      if (cleaned.startsWith("0")) {
        cleaned = cleaned.substring(1);
      }
      cleaned = countryCode + cleaned;
    }
    
    return cleaned;
  };

  // Validate phone number
  const isValidPhoneNumber = (phone: string, countryCode: string): boolean => {
    const cleaned = formatPhoneNumber(phone, countryCode);
    // Basic validation: should start with + and have at least 7 digits after country code
    const phoneRegex = /^\+\d{1,4}\d{7,15}$/;
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

    const formattedPhone = formatPhoneNumber(signupData.phoneNumber.trim(), signupData.countryCode);
    
    if (!isValidPhoneNumber(signupData.phoneNumber.trim(), signupData.countryCode)) {
      setSignupMessage("❌ Please enter a valid WhatsApp number.");
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

    try {
      // Check if phone number already exists
      const phoneQuery = query(
        collection(db, "users"),
        where("phoneNumber", "==", formattedPhone)
      );
      const phoneSnapshot = await getDocs(phoneQuery);

      if (!phoneSnapshot.empty) {
        setSignupMessage("❌ This WhatsApp number is already registered. Please use the login form below to sign in.");
        toast.error("This WhatsApp number is already registered. Please login instead.");
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

      // User is already signed in, navigate directly to complete profile
      toast.success("✅ Account created successfully! Please complete your profile.");
      setSignupMessage("✅ Account created successfully! Redirecting to profile completion...");
      
      // Clear signup form
      setSignupData({
        countryCode: "+92",
        phoneNumber: "",
        password: "",
      });

      // Navigate to complete profile page
      setTimeout(() => {
        navigate("/complete-profile");
      }, 1500);
    } catch (error: any) {
      // Friendly Firebase error messages
      let friendlyMsg = "";
      
      if (error?.code === "auth/email-already-in-use") {
        friendlyMsg = "This WhatsApp number is already registered. Please use the login form below to sign in.";
        toast.error("This WhatsApp number is already registered. Please login instead.");
      } else if (error?.code === "auth/weak-password") {
        friendlyMsg = "Password should be at least 6 characters.";
      } else {
        friendlyMsg = error?.message || "An error occurred. Please try again.";
      }

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
      const formattedPhone = formatPhoneNumber(loginData.phoneNumber.trim(), loginData.countryCode);

      if (!isValidPhoneNumber(loginData.phoneNumber.trim(), loginData.countryCode)) {
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
        setTimeout(() => navigate("/home"), 1500);
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
      <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-6 overflow-y-auto bg-[#fce3e3]">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="text-center mb-4">
            {/* Logo - Same as left side */}
            <div className="flex justify-center mb-2">
              <img src={logo1} alt="RishtaHub" className="w-[120px] h-auto" />
            </div>
            
            {/* Welcome Text */}
            <p className="text-xl font-medium text-gray-600 mb-1">WELCOME TO</p>
            <h1 className="text-[50px] md:text-5xl font-black text-gray-800 mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}>
              Rishta Hub
            </h1>
            <p className="text-xl text-gray-600">
              Genuine People - Real Profiles
            </p>
          </div>

          {/* Single Card with Both Forms */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
            {/* Registration Section */}
            <div className="mb-4">
              {/* Bilingual Header */}
              <div className="mb-3">
                <div className="flex items-start gap-2 mb-1">
                  <h2 className="text-xs font-semibold text-black leading-tight flex-1">
                    Register your profile if you are new to this platform
                  </h2>
                  <p className="text-xs text-black leading-tight flex-1 text-right">
                    اگر آپ اس پلیٹ فارم پر نئے ہیں تو اپنا پروفائل رجسٹر کریں
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <p className="text-xs text-gray-700 flex-1">
                    Enter your WhatsApp number and password in the box below and press NEXT button
                  </p>
                    <div className="text-xs text-gray-700 flex-1 text-right">
                      <p>
                        نیچے دیئے گئے باکس میں اپنا واٹس ایپ نمبر اور پاس ورڈ درج کریں اور{" "}
                        <span className="font-semibold text-[16px]">نیکسٹ</span> بٹن دبائیں۔
                      </p>
                  </div>
                </div>
              </div>

            <form onSubmit={handleSignup} className="space-y-3">
              {/* WhatsApp Number Input - Two Part */}
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="w-24">
                  <select
                    name="countryCode"
                    value={signupData.countryCode}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        countryCode: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-2 border border-gray-400 rounded bg-white text-gray-800 font-medium text-center text-xs focus:outline-none focus:border-gray-500"
                  >
                    {countryCodes.map((cc) => (
                      <option key={cc.code} value={cc.code}>
                        {cc.code}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Phone Number Input */}
                <div className="flex-1">
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="3xxxxxxxxx"
                    value={signupData.phoneNumber}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 border border-gray-400 rounded bg-white text-gray-800 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
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
                  className="w-full h-10 px-3 pr-10 border border-gray-400 rounded bg-white text-gray-800 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                >
                  {showSignupPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Message Display */}
              {signupMessage && (
                <div
                  className={`p-2 rounded text-xs font-medium ${
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
                className="w-full h-10 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-sm rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {signupLoading ? (
                  <>
                    <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "NEXT"
                )}
              </button>
            </form>
            </div>

            {/* Login Section */}
            <div className="mt-4">
              {/* Bilingual Header */}
              <div className="mb-3">
                <div className="flex items-start gap-2">
                  <h2 className="text-xs font-semibold text-black leading-tight flex-1">
                    If you are already registered on this platform, enter your WhatsApp number & password and press LOG IN
                  </h2>
                  <p className="text-xs text-black leading-tight flex-1 text-right">
                    اگر آپ پہلے ہی اس پلیٹ فارم پر رجسٹرڈ ہیں تو اپنا واٹس ایپ نمبر اور پاس ورڈ درج کریں اور{" "}
                    <span className="font-semibold text-[16px]">لاگ ان</span> دبائیں۔
                  </p>
                </div>
              </div>

            <form onSubmit={handleLogin} className="space-y-3">
              {/* WhatsApp Number Input - Two Part */}
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="w-24">
                  <select
                    name="countryCode"
                    value={loginData.countryCode}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        countryCode: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-2 border border-gray-400 rounded bg-white text-gray-800 font-medium text-center text-xs focus:outline-none focus:border-gray-500"
                  >
                    {countryCodes.map((cc) => (
                      <option key={cc.code} value={cc.code}>
                        {cc.code}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Phone Number Input */}
                <div className="flex-1">
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="3xxxxxxxxx"
                    value={loginData.phoneNumber}
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className="w-full h-10 px-3 border border-gray-400 rounded bg-white text-gray-800 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
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
                  className="w-full h-10 px-3 pr-10 border border-gray-400 rounded bg-white text-gray-800 placeholder-gray-500 text-xs focus:outline-none focus:border-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                >
                  {showLoginPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {/* Message Display */}
              {loginMessage && (
                <div
                  className={`p-2 rounded text-xs font-medium ${
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
                className="w-full h-10 bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-sm rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loginLoading ? (
                  <>
                    <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
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
    </div>
  );
};

export default Signup;
