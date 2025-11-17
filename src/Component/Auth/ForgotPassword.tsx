import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Common/Button";
import CustomInput from "../Common/CustomInput";
// import loginHero from "../../assets/images/about-01.png";
import { Mail, ArrowRight, ArrowLeft, Shield } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset link sent to your email! Please check your inbox.");
    } catch (error: any) {
      const friendlyMsg =
        error.code === "auth/user-not-found"
          ? "No account found with this email address."
          : error.code === "auth/invalid-email"
          ? "Please enter a valid email address."
          : error.message;
      
      setMessage("❌ " + friendlyMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f7b5b5]">
      {/* Left Side - Enhanced Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20 z-10" />
        {/* <img
          src={loginHero}
          alt="Security"
          className="w-full h-full object-cover transform scale-105"
        /> */}
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col justify-center p-16 text-white">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-8 w-8 text-yellow-300" />
              <span className="text-lg font-semibold text-yellow-300">Secure Recovery</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Reset Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Password</span>
            </h1>
            
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Don't worry! Enter your email address and we'll send you a secure link to reset your password.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Secure & encrypted recovery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">Instant email delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100">24/7 Security support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Reset Password
            </h1>
            <p className="text-gray-600 text-lg">
              Enter your email to recover your account
            </p>
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-blue-600 hover:text-indigo-500 font-medium mb-6 transition-colors group lg:hidden"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>

          {/* Enhanced Forgot Password Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100/80 backdrop-blur-sm">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                Forgot Password?
              </h2>
              <p className="text-gray-500 text-lg">
                Enter your email address and we'll send you a reset link
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 tracking-wide">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <CustomInput
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-14 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`p-4 rounded-xl border-2 text-sm font-medium ${
                    message.startsWith("✅") 
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Send Reset Link Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl flex items-center justify-center gap-2 group"
                value={
                  loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Reset Link...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Reset Link
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )
                }
              />

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500 font-medium">
                    Remember your password?
                  </span>
                </div>
              </div>

              {/* Back to Login Button */}
              <Button
                type="button"
                onClick={() => navigate("/login")}
                 className="w-full h-14 text-base font-semibold bg-blue-400 border-2 border-blue-400 text-white hover:bg-blue-500 hover:border-blue-500 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg"
              
                value="Back to Login"
              />
            </form>

            {/* Additional Help */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-800 mb-1">Security Tips</h3>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• Check your spam folder if you don't see the email</li>
                    <li>• The reset link expires in 1 hour for security</li>
                    <li>• Create a strong, unique password</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Need help? Contact our{" "}
                <button className="text-blue-600 hover:text-indigo-500 font-medium">
                  Support Team
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;