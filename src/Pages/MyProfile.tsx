import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Edit3,
  Save,
  X,
  Camera,
  User,
  MapPin,
  Briefcase,
  Users,
  Heart,
  Phone,
} from "lucide-react";
import Header from "../Component/layout/Header";
import Footer from "../Component/layout/Footer";

// Updated Country data for dropdown
const countries = [
  "Pakistan",
  "Saudi Arabia",
  "United Arab Emirates (UAE)",
  "Qatar",
  "Oman",
  "Kuwait",
  "Malaysia",
  "South Korea",
  "Japan",
  "China",
  "Turkey",
  "United Kingdom (UK)",
  "United States (USA)",
  "Canada",
  "Australia",
  "Italy",
  "Spain",
  "Germany",
  "Norway",
  "Greece",
  "India"
];

// City data for different countries
const cityData: { [key: string]: string[] } = {
  "Pakistan": [
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot"
  ],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam"],
  "United Arab Emirates (UAE)": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman"],
  "Qatar": ["Doha", "Al Rayyan", "Umm Salal", "Al Wakrah", "Al Khor"],
  "Oman": ["Muscat", "Salalah", "Sohar", "Nizwa", "Sur"],
  "Kuwait": ["Kuwait City", "Hawalli", "Farwaniya", "Ahmadi", "Jahra"],
  "Malaysia": ["Kuala Lumpur", "Penang", "Johor Bahru", "Ipoh", "Malacca"],
  "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon"],
  "Japan": ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya"],
  "China": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu"],
  "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
  "United Kingdom (UK)": ["London", "Manchester", "Birmingham", "Liverpool", "Glasgow"],
  "United States (USA)": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  "Italy": ["Rome", "Milan", "Naples", "Turin", "Palermo"],
  "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza"],
  "Germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt"],
  "Norway": ["Oslo", "Bergen", "Stavanger", "Trondheim", "Drammen"],
  "Greece": ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa"],
  "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"]
};

// Height options for dropdown
const heightOptions = [
  "4'0\"", "4'1\"", "4'2\"", "4'3\"", "4'4\"", "4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
  "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\"", "6'7\"", "6'8\"", "6'9\"", "6'10\"", "6'11\"", "7'0\""
];

// Occupation options for dropdown
const occupationOptions = [
  "Accountant", "Actor", "Architect", "Artist", "Banker", "Business Owner", "Chef", "Civil Servant", 
  "Doctor", "Engineer", "Farmer", "Graphic Designer", "Hotel Manager", "IT Professional", "Journalist", 
  "Lawyer", "Lecturer", "Marketing Manager", "Nurse", "Pharmacist", "Pilot", "Police Officer", "Professor", 
  "Real Estate Agent", "Sales Manager", "Scientist", "Software Developer", "Teacher", "Web Developer", 
  "Student", "Homemaker", "Retired", "Unemployed", "Other"
];

// Sibling options for dropdown (1 to 9)
const siblingOptions = Array.from({ length: 9 }, (_, i) => (i + 1).toString());

// Cast options
const castOptions = [
  "Jutt",
  "Rajput",
  "Arain",
  "Gujjar",
  "Awan",
  "Syed",
  "Buttar",
  "Sheikh",
  "Pathan",
  "Baloch",
  "Malik",
  "Mughal",
  "Qureshi",
  "Kashmiri Butt",
  "Dogar",
  "Khokhar",
  "Chauhan",
  "Ansari",
  "Lodhi",
  "Qazi",
  "Niazi"
];

// Preferred cast options (includes "Any" and "No preference")
const preferredCastOptions = [
  "Any",
  "Jutt",
  "Rajput",
  "Arain",
  "Buttar",
  "Gujjar",
  "Awan",
  "Syed",
  "Sheikh",
  "Pathan",
  "Baloch",
  "Malik",
  "Mughal",
  "Qureshi",
  "Kashmiri Butt",
  "Dogar",
  "Khokhar",
  "Chauhan",
  "Ansari",
  "Lodhi",
  "Qazi",
  "Niazi",
  "No preference"
];

// Preferred resident options
const preferredResidentOptions = [
  "No preference",
  "Pakistan",
  "India",
  "Saudi Arabia",
  "United Arab Emirates (UAE)",
  "Qatar",
  "Oman",
  "Kuwait",
  "Malaysia",
  "South Korea",
  "Japan",
  "China",
  "Turkey",
  "United Kingdom (UK)",
  "United States (USA)",
  "Canada",
  "Australia",
  "Italy",
  "Spain",
  "Germany",
  "Norway",
  "Greece",
  "Any"
];

// Get cities based on selected country
const getCitiesForCountry = (country: string) => {
  return cityData[country] || [];
};

// Get sect options based on selected religion
const getSectOptions = (religion: string) => {
  switch (religion) {
    case "Muslim":
      return [
        "No Sect - Prefer to be Muslim Only",
        "Barelvi",
        "SHIA",
        "Deobandi",
        "Ahl-i Hadith",
        "Hanafi",
        "Tablighi Jamaat",
        "Wahhabi",
        "Chishti",
        "Naqshbandi",
        "Qadiri",
        "Suhrawardi",
        "Maliki",
        "Shafi'i",
        "Hanbali",
        "Imamia/Jaafry",
        "Ismailis (Aga Khanis)",
        "Dawoodi Bohras",
        "Sulaymani Bohras",
        "Zaydi",
        "Alvi",
        "Hazara",
        "Other"
      ];
    case "Christian":
      return [
        "Catholic",
        "Protestant",
        "Presbyterian",
        "Methodist",
        "Pentecostal",
        "Seventh-day Adventist",
        "Orthodox",
        "Salvation Army"
      ];
    case "Hindu":
      return [
        "Hindu",
        "Vaishnavism",
        "Shaivism",
        "Shaktism",
        "Smartism",
        "Ganapatya"
      ];
    default:
      return ["Other"];
  }
};

export default function MyProfile() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setProfileData(userDoc.data());
      } else {
        setMessage("No profile found!");
      }
    } catch (error: any) {
      console.error(error);
      setMessage("Error fetching profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setProfileData((prev: any) => {
      const updatedData = {
        ...prev,
        [name]: value
      };

      // Reset sect when religion changes
      if (name === "religion") {
        updatedData.sect = "";
      }

      // Reset city when country changes
      if (name === "country") {
        updatedData.currentCity = "";
      }

      return updatedData;
    });
  };

  const handlePartnerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setProfileData((prev: any) => ({
      ...prev,
      partnerPrefs: {
        ...prev.partnerPrefs,
        [name]: value,
      },
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const user = auth.currentUser;
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5MB");
      return;
    }

    // Convert image to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;

      try {
        setUploadingImage(true);

        await updateDoc(doc(db, "users", user.uid), {
          profileImage: base64String,
        });

        setProfileData((prev: any) => ({
          ...prev,
          profileImage: base64String,
        }));
        setMessage("✅ Profile picture updated!");
      } catch (error: any) {
        console.error("Error updating profile image:", error);
        setMessage("❌ Failed to update image.");
      } finally {
        setUploadingImage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Ensure partnerPrefs exists before updating
      const updateData = {
        ...profileData,
        partnerPrefs: profileData.partnerPrefs || {},
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, "users", user.uid), updateData);
      setMessage("✅ Profile updated successfully!");
      setEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage("❌ Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage("");
    fetchProfile(); // Reset to original data
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center text-[110%]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading My profile</p>
          </div>
        </div>
        <Footer />
      </>
    );

  if (!profileData)
    return (
      <div className="text-center mt-20 text-gray-600">No profile found.</div>
    );

  const ProfileSection = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-orange-200">
        <Icon className="h-6 w-6 text-orange-600" />
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );

  // Fixed InputField component with proper event handling
  const InputField = ({
    label,
    name,
    value,
    type = "text",
    options = [],
    onChange,
    dynamicOptions = null,
  }: any) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {editing ? (
        type === "select" ? (
          <select
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full h-12 px-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
          >
            <option value="">Select {label}</option>
            {(dynamicOptions ? dynamicOptions : options).map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            name={name}
            value={value || ""}
            onChange={onChange}
            rows={3}
            className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none transition-all"
            placeholder={`Enter ${label}`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full h-12 px-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            placeholder={`Enter ${label}`}
          />
        )
      ) : (
        <div className="h-12 px-3 border-2 border-transparent bg-orange-50 rounded-lg flex items-center text-gray-700">
          {value || "Not specified"}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">Manage your profile information</p>
          </div>

          {/* Profile Image */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 text-center mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-200 mx-auto">
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                    <User className="h-12 w-12 text-orange-400" />
                  </div>
                )}
              </div>
              {editing && (
                <label className="absolute bottom-2 right-2 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-md">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
            {uploadingImage && (
              <p className="text-orange-600 text-sm mt-2">Uploading image...</p>
            )}
          </div>

          {/* Edit/Save Buttons */}
          <div className="flex justify-end gap-4 mb-6">
            {editing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold shadow-lg transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-semibold shadow-lg transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-xl mb-6 text-center font-semibold ${
                message.includes("✅")
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Profile Sections */}
          <div className="space-y-6">
            {/* Basic Information */}
            <ProfileSection title="Basic Information" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Profile Created By"
                  name="profileCreatedBy"
                  value={profileData.profileCreatedBy}
                  options={[
                    "Self",
                    "Father",
                    "Mother", 
                    "Brother",
                    "Sister",
                    "Relative",
                    "Friend",
                  ]}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                />
                <InputField
                  label="Gender"
                  name="gender"
                  value={profileData.gender}
                  options={["Male", "Female"]}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Date of Birth"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  type="date"
                  onChange={handleChange}
                />
                <InputField
                  label="Height"
                  name="height"
                  value={profileData.height}
                  options={heightOptions}
                  type="select"
                  onChange={handleChange}
                />
              </div>
            </ProfileSection>

            {/* Personal Details */}
            <ProfileSection title="Personal Details" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Marital Status"
                  name="maritalStatus"
                  value={profileData.maritalStatus}
                  options={["Never Married", "Divorced", "Widowed"]}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Religion"
                  name="religion"
                  value={profileData.religion}
                  options={["Muslim", "Christian", "Hindu", "Other"]}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Sect"
                  name="sect"
                  value={profileData.sect}
                  dynamicOptions={getSectOptions(profileData.religion)}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Caste"
                  name="caste"
                  value={profileData.caste}
                  options={castOptions}
                  type="select"
                  onChange={handleChange}
                />
              </div>
            </ProfileSection>

            {/* Residential Information */}
            <ProfileSection title="Residential Information" icon={MapPin}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Country"
                  name="country"
                  value={profileData.country}
                  options={countries}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Current City"
                  name="currentCity"
                  value={profileData.currentCity}
                  dynamicOptions={getCitiesForCountry(profileData.country)}
                  type="select"
                  onChange={handleChange}
                />
              </div>
            </ProfileSection>

            {/* Education/Qualifications/Profession */}
            <ProfileSection title="Education/Qualifications/Profession" icon={Briefcase}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Qualification"
                  name="qualification"
                  value={profileData.qualification}
                  options={[
                    "Matric",
                    "Intermediate",
                    "Bachelor",
                    "Master",
                    "PhD",
                    "Other",
                  ]}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Education Field"
                  name="educationField"
                  value={profileData.educationField}
                  options={[
                    "Engineering",
                    "Medical",
                    "Arts",
                    "Commerce",
                    "Science",
                    "Other",
                  ]}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Occupation"
                  name="occupation"
                  value={profileData.occupation}
                  options={occupationOptions}
                  type="select"
                  onChange={handleChange}
                />
              </div>
            </ProfileSection>

            {/* Family Information */}
            <ProfileSection title="Family Information" icon={Users}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Father's Occupation"
                  name="fatherOccupation"
                  value={profileData.fatherOccupation}
                  options={occupationOptions}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Mother's Occupation"
                  name="motherOccupation"
                  value={profileData.motherOccupation}
                  options={occupationOptions}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Number of Brothers"
                  name="totalBrothers"
                  value={profileData.totalBrothers}
                  options={siblingOptions}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Married Brothers"
                  name="marriedBrothers"
                  value={profileData.marriedBrothers}
                  options={siblingOptions}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Number of Sisters"
                  name="totalSisters"
                  value={profileData.totalSisters}
                  options={siblingOptions}
                  type="select"
                  onChange={handleChange}
                />
                <InputField
                  label="Married Sisters"
                  name="marriedSisters"
                  value={profileData.marriedSisters}
                  options={siblingOptions}
                  type="select"
                  onChange={handleChange}
                />
              </div>
            </ProfileSection>

            {/* Contact Information */}
            <ProfileSection title="Contact Information" icon={Phone}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Mobile Number"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </ProfileSection>

            {/* Partner Preferences */}
            <ProfileSection title="Partner Preferences" icon={Heart}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Preferred Age Min"
                  name="partnerAgeMin"
                  value={profileData.partnerPrefs?.partnerAgeMin || ""}
                  type="number"
                  onChange={handlePartnerChange}
                />
                <InputField
                  label="Preferred Age Max"
                  name="partnerAgeMax"
                  value={profileData.partnerPrefs?.partnerAgeMax || ""}
                  type="number"
                  onChange={handlePartnerChange}
                />
                <InputField
                  label="Preferred Caste"
                  name="preferredCaste"
                  value={profileData.partnerPrefs?.preferredCaste || ""}
                  options={preferredCastOptions}
                  type="select"
                  onChange={handlePartnerChange}
                />
                <InputField
                  label="Preferred Sect"
                  name="preferredSect"
                  value={profileData.partnerPrefs?.preferredSect || ""}
                  options={["No preference", ...getSectOptions("Muslim")]}
                  type="select"
                  onChange={handlePartnerChange}
                />
                <InputField
                  label="Preferred Resident"
                  name="preferredResident"
                  value={profileData.partnerPrefs?.preferredResident || ""}
                  options={preferredResidentOptions}
                  type="select"
                  onChange={handlePartnerChange}
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Detailed Expectations"
                    name="detailedExpectations"
                    value={profileData.partnerPrefs?.detailedExpectations || ""}
                    type="textarea"
                    onChange={handlePartnerChange}
                  />
                </div>
              </div>
            </ProfileSection>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}