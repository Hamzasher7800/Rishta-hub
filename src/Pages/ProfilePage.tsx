import { useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [userData, setUserData] = useState<{ name?: string; profileImage?: string } | null>(null);
  const user = auth.currentUser; // Get current logged-in user

  // 🔹 Handle image file upload (convert to Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfileImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  // 🔹 Save profile data to Firestore
  const handleSaveProfile = async () => {
    if (!user) {
      alert("User not logged in!");
      return;
    }

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          name,
          profileImage,
        },
        { merge: true }
      );
      alert("Profile saved successfully!");
      fetchUserProfile(); // Refresh UI
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    }
  };

  // 🔹 Fetch user profile from Firestore
  const fetchUserProfile = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data() as { name?: string; profileImage?: string });
    }
  };

  // 🔹 Fetch on component mount
  useEffect(() => {
    if (user) fetchUserProfile();
  }, [user]);

  return (
    <div className="p-4 text-[110%]">
      <h2 className="text-xl font-bold mb-4">Create Profile</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-3"
      />

      {profileImage && (
        <img
          src={profileImage}
          alt="Preview"
          className="w-24 h-24 rounded-full object-cover mb-3"
        />
      )}

      <button
        onClick={handleSaveProfile}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Profile
      </button>

      <div className="mt-6">
        <h1 className="text-lg font-semibold mb-2">This is saved profile:</h1>
        {userData ? (
          <div className="flex items-center gap-3">
            <img
              src={userData.profileImage}
              alt="Profile"
              className="rounded-full w-16 h-16 object-cover"
            />
            <p className="text-base font-medium">{userData.name}</p>
          </div>
        ) : (
          <p>No profile data found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
