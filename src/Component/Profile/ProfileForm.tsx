import { useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // ✅ optional icon (works if you use lucide-react)

interface ProfileFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function ProfileForm({ formData, setFormData }: ProfileFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage("⚠️ User not logged in!");
        return;
      }

      // ✅ Save profile data to Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...formData,
          email: user.email,
          profileCompleted: true,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      setMessage("✅ Profile completed successfully! Redirecting to Home...");
      setTimeout(() => navigate("/home"), 1800);
    } catch (error: any) {
      setMessage("❌ Error saving profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6 border border-gray-100"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-3"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Complete Your Profile
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Please provide accurate information to complete your profile.
        </p>

        {/* Input Fields */}
        {["name", "fatherName", "age", "education", "caste", "city"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 text-sm font-semibold mb-1 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field] || ""}
              onChange={handleChange}
              placeholder={`Enter your ${field}`}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-semibold ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 transition-colors"
          }`}
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-center text-sm mt-4 ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
