import React from "react";
import { useState, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Briefcase,
  Users,
  Plus,
  Camera,
  Upload,
  X,
  Heart,
} from "lucide-react";
import Button from "../Component/Common/Button";
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
  "India",
];

// City data for different countries
const cityData: { [key: string]: string[] } = {
  Pakistan: [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Sialkot",
  ],
  "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam"],
  "United Arab Emirates (UAE)": [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Al Ain",
    "Ajman",
  ],
  Qatar: ["Doha", "Al Rayyan", "Umm Salal", "Al Wakrah", "Al Khor"],
  Oman: ["Muscat", "Salalah", "Sohar", "Nizwa", "Sur"],
  Kuwait: ["Kuwait City", "Hawalli", "Farwaniya", "Ahmadi", "Jahra"],
  Malaysia: ["Kuala Lumpur", "Penang", "Johor Bahru", "Ipoh", "Malacca"],
  "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon"],
  Japan: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya"],
  China: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu"],
  Turkey: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
  "United Kingdom (UK)": [
    "London",
    "Manchester",
    "Birmingham",
    "Liverpool",
    "Glasgow",
  ],
  "United States (USA)": [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
  ],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  Italy: ["Rome", "Milan", "Naples", "Turin", "Palermo"],
  Spain: ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza"],
  Germany: ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt"],
  Norway: ["Oslo", "Bergen", "Stavanger", "Trondheim", "Drammen"],
  Greece: ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa"],
  India: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"],
};

// Height options for dropdown
const heightOptions = [
  "4'0\"",
  "4'1\"",
  "4'2\"",
  "4'3\"",
  "4'4\"",
  "4'5\"",
  "4'6\"",
  "4'7\"",
  "4'8\"",
  "4'9\"",
  "4'10\"",
  "4'11\"",
  "5'0\"",
  "5'1\"",
  "5'2\"",
  "5'3\"",
  "5'4\"",
  "5'5\"",
  "5'6\"",
  "5'7\"",
  "5'8\"",
  "5'9\"",
  "5'10\"",
  "5'11\"",
  "6'0\"",
  "6'1\"",
  "6'2\"",
  "6'3\"",
  "6'4\"",
  "6'5\"",
  "6'6\"",
  "6'7\"",
  "6'8\"",
  "6'9\"",
  "6'10\"",
  "6'11\"",
  "7'0\"",
];

// Occupation options for dropdown
const occupationOptions = [
  "Accountant",
  "Actor",
  "Architect",
  "Artist",
  "Banker",
  "Business Owner",
  "Chef",
  "Civil Servant",
  "Doctor",
  "Engineer",
  "Farmer",
  "Graphic Designer",
  "Hotel Manager",
  "IT Professional",
  "Journalist",
  "Lawyer",
  "Lecturer",
  "Marketing Manager",
  "Nurse",
  "Pharmacist",
  "Pilot",
  "Police Officer",
  "Professor",
  "Real Estate Agent",
  "Sales Manager",
  "Scientist",
  "Software Developer",
  "Teacher",
  "Web Developer",
  "Student",
  "Homemaker",
  "Retired",
  "Unemployed",
  "Other",
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
  "Niazi",
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
  "No preference",
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
  "Any",
];

export default function AddRishta() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    // Basic Information
    profileCreatedBy: "",
    name: "",
    gender: "",
    dateOfBirth: "",
    phoneNumber: "",
    height: "",

    // Personal Details (formerly Background Details)
    maritalStatus: "",
    religion: "",
    sect: "",
    caste: "",

    // Residential Information (formerly Location & Physical)
    country: "",
    currentCity: "",

    // Education/Qualifications/Profession (formerly Education & Career)
    qualification: "",
    educationField: "",
    occupation: "",

    // Family Information
    fatherOccupation: "",
    motherOccupation: "",
    totalBrothers: "",
    marriedBrothers: "",
    totalSisters: "",
    marriedSisters: "",
  });

  const [partnerPrefs, setPartnerPrefs] = useState({
    partnerAgeMin: "",
    partnerAgeMax: "",
    preferredCaste: "",
    preferredSect: "",
    preferredResident: "",
    detailedExpectations: "",
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [confirmationChecked, setConfirmationChecked] = useState(false);

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
          "Other",
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
          "Salvation Army",
        ];
      case "Hindu":
        return [
          "Hindu",
          "Vaishnavism",
          "Shaivism",
          "Shaktism",
          "Smartism",
          "Ganapatya",
        ];
      default:
        return ["Other"];
    }
  };

  const handleProfileChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setProfileData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
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
    setPartnerPrefs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (JPEG, PNG, etc.)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Please select an image smaller than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmationChecked) {
      alert(
        "Please confirm that all information submitted is true and correct."
      );
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to add a rishta.");
      navigate("/login");
      return;
    }

    // Validation check
    if (!profileData.name || !profileData.gender || !profileData.dateOfBirth) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // ✅ Create complete rishta data object
      const rishtaData = {
        // Profile Data
        ...profileData,

        // Partner Preferences
        partnerPrefs: {
          ...partnerPrefs,
        },

        // Image
        profileImage: imagePreview || "",

        // Metadata
        createdBy: user.uid,
        createdByEmail: user.email || "",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "active",
        isApproved: true,

        // For filtering and search
        searchKeywords: [
          profileData.name?.toLowerCase(),
          profileData.currentCity?.toLowerCase(),
          profileData.caste?.toLowerCase(),
          profileData.sect?.toLowerCase(),
          profileData.occupation?.toLowerCase(),
        ].filter(Boolean),
      };

      console.log("📝 Adding rishta data:", rishtaData);

      // ✅ Add to 'rishtas' collection
      const docRef = await addDoc(collection(db, "rishtas"), rishtaData);

      console.log("✅ Rishta added successfully with ID:", docRef.id);
      alert("🎉 Rishta profile added successfully!");

      // ✅ Reset form and redirect
      resetForm();
      navigate("/home");
    } catch (err: any) {
      console.error("❌ Error adding rishta:", err);
      alert(`Error adding rishta: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProfileData({
      profileCreatedBy: "",
      name: "",
      gender: "",
      dateOfBirth: "",
      phoneNumber: "",
      height: "",
      maritalStatus: "",
      religion: "",
      sect: "",
      caste: "",
      country: "",
      currentCity: "",
      qualification: "",
      educationField: "",
      occupation: "",
      fatherOccupation: "",
      motherOccupation: "",
      totalBrothers: "",
      marriedBrothers: "",
      totalSisters: "",
      marriedSisters: "",
    });

    setPartnerPrefs({
      partnerAgeMin: "",
      partnerAgeMax: "",
      preferredCaste: "",
      preferredSect: "",
      preferredResident: "",
      detailedExpectations: "",
    });

    setImagePreview("");
    setConfirmationChecked(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-4 text-[110%]">
        <div className="max-w-6xl mx-auto">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              {/* Back Button - Form ke andar */}
              <div className="mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2  hover:text-black font-medium transition-colors group"
                >
                  <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-8 w-8" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Add New Profile
                </h1>
                <p className="text-green-100 text-sm md:text-base max-w-2xl mx-auto">
                  Create a new profile. You can add unlimited profiles to find
                  the perfect match.
                </p>
              </div>
            </div>

            {/* Form Sections */}
            <div className="p-4 md:p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Profile Picture Upload */}
                  <div className="text-center bg-gray-50 rounded-xl p-4">
                    <label className="text-sm font-semibold text-gray-700 block mb-3">
                      Profile Picture
                    </label>

                    <div className="flex flex-col items-center space-y-3">
                      {imagePreview ? (
                        <div className="relative">
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            <img
                              src={imagePreview}
                              alt="Profile preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-200"
                        >
                          <Camera className="h-6 w-6 md:h-8 md:w-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500 text-center px-1">
                            Click to upload
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col items-center space-y-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageSelect}
                          accept="image/*"
                          className="hidden"
                        />

                        {!imagePreview && (
                          <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 h-8 md:px-6 md:h-10 text-xs md:text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg flex items-center gap-1"
                            value={
                              <span className="flex items-center gap-1">
                                <Upload className="h-3 w-3 md:h-4 md:w-4" />
                                Choose Photo
                              </span>
                            }
                          />
                        )}

                        <p className="text-xs text-gray-500">Max 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information Section */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-green-600" />
                      Basic Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Profile Created By */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Profile Created By *
                        </label>
                        <select
                          name="profileCreatedBy"
                          value={profileData.profileCreatedBy}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select</option>
                          <option value="Self">Self</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Relative">Relative</option>
                          <option value="Friend">Friend</option>
                        </select>
                      </div>

                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          placeholder="Enter full name"
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        />
                      </div>

                      {/* Gender */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Gender *
                        </label>
                        <select
                          name="gender"
                          value={profileData.gender}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      {/* Date of Birth */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={profileData.dateOfBirth}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        />
                      </div>

                      {/* Height - Moved to Basic Information */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Height *
                        </label>
                        <select
                          name="height"
                          value={profileData.height}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select Height</option>
                          {heightOptions.map((height) => (
                            <option key={height} value={height}>
                              {height}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Personal Details (formerly Background Details) */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Personal Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Marital Status */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Marital Status *
                        </label>
                        <select
                          name="maritalStatus"
                          value={profileData.maritalStatus}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select Status</option>
                          <option value="Never Married">Never Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </div>

                      {/* Religion */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Religion *
                        </label>
                        <select
                          name="religion"
                          value={profileData.religion}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select Religion</option>
                          <option value="Muslim">Muslim</option>
                          <option value="Christian">Christian</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Sect - Dynamic based on religion */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Sect *
                        </label>
                        <select
                          name="sect"
                          value={profileData.sect}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select Sect</option>
                          {getSectOptions(profileData.religion).map((sect) => (
                            <option key={sect} value={sect}>
                              {sect}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Caste */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Caste *
                        </label>
                        <select
                          name="caste"
                          value={profileData.caste}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select Caste</option>
                          {castOptions.map((caste) => (
                            <option key={caste} value={caste}>
                              {caste}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Residential Information (formerly Location & Physical) */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Residential Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Country - Updated Dropdown */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={profileData.country}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Current City - Dynamic based on country */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Current City *
                        </label>
                        <select
                          name="currentCity"
                          value={profileData.currentCity}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select City</option>
                          {getCitiesForCountry(profileData.country).map(
                            (city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Education/Qualifications/Profession (formerly Education & Career) */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex flex-wrap items-center gap-2 break-words">
                      <Briefcase className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="break-words leading-tight">
                        Education / Qualifications / Profession
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Qualification */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Qualification *
                        </label>
                        <select
                          name="qualification"
                          value={profileData.qualification}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select Qualification</option>
                          <option value="Matric">Matric</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Bachelor">Bachelor's</option>
                          <option value="Master">Master's</option>
                          <option value="PhD">PhD</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Education Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Education Field *
                        </label>
                        <select
                          name="educationField"
                          value={profileData.educationField}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select Field</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Medical">Medical</option>
                          <option value="Arts">Arts</option>
                          <option value="Commerce">Commerce</option>
                          <option value="Science">Science</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Occupation */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Occupation *
                        </label>
                        <select
                          name="occupation"
                          value={profileData.occupation}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select Occupation</option>
                          {occupationOptions.map((occupation) => (
                            <option key={occupation} value={occupation}>
                              {occupation}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Family Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Family Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Father's Occupation */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Father's Occupation *
                        </label>
                        <select
                          name="fatherOccupation"
                          value={profileData.fatherOccupation}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select Occupation</option>
                          {occupationOptions.map((occupation) => (
                            <option key={occupation} value={occupation}>
                              {occupation}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Mother's Occupation */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Mother's Occupation *
                        </label>
                        <select
                          name="motherOccupation"
                          value={profileData.motherOccupation}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        >
                          <option value="">Select Occupation</option>
                          {occupationOptions.map((occupation) => (
                            <option key={occupation} value={occupation}>
                              {occupation}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Number of Brothers */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Number of Brothers
                        </label>
                        <select
                          name="totalBrothers"
                          value={profileData.totalBrothers}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                        >
                          <option value="">Select</option>
                          {siblingOptions.map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Married Brothers */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Married Brothers
                        </label>
                        <select
                          name="marriedBrothers"
                          value={profileData.marriedBrothers}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                        >
                          <option value="">Select</option>
                          {siblingOptions.map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Number of Sisters */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Number of Sisters
                        </label>
                        <select
                          name="totalSisters"
                          value={profileData.totalSisters}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                        >
                          <option value="">Select</option>
                          {siblingOptions.map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Married Sisters */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Married Sisters
                        </label>
                        <select
                          name="marriedSisters"
                          value={profileData.marriedSisters}
                          onChange={handleProfileChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                        >
                          <option value="">Select</option>
                          {siblingOptions.map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Number Section */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-green-600" />
                      Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={profileData.phoneNumber}
                          onChange={handleProfileChange}
                          placeholder="+92 300 1234567"
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Partner Preferences Section */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-green-800">
                            Partner Preferences
                          </h3>
                          <p className="text-green-600 text-sm">
                            Tell us what you're looking for in a partner
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Preferred Age Range */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Preferred Age Min *
                        </label>
                        <input
                          type="number"
                          name="partnerAgeMin"
                          value={partnerPrefs.partnerAgeMin}
                          onChange={handlePartnerChange}
                          placeholder="Min age"
                          min="18"
                          max="100"
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Preferred Age Max *
                        </label>
                        <input
                          type="number"
                          name="partnerAgeMax"
                          value={partnerPrefs.partnerAgeMax}
                          onChange={handlePartnerChange}
                          placeholder="Max age"
                          min="18"
                          max="100"
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                          required
                        />
                      </div>

                      {/* Preferred Caste */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Preferred Caste
                        </label>
                        <select
                          name="preferredCaste"
                          value={partnerPrefs.preferredCaste}
                          onChange={handlePartnerChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                        >
                          <option value="">Any Caste</option>
                          {preferredCastOptions.map((caste) => (
                            <option key={caste} value={caste}>
                              {caste}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Preferred Sect */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Preferred Sect
                        </label>
                        <select
                          name="preferredSect"
                          value={partnerPrefs.preferredSect}
                          onChange={handlePartnerChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                        >
                          <option value="">Any Sect</option>
                          <option value="No preference">No preference</option>
                          {getSectOptions("Muslim").map((sect) => (
                            <option key={sect} value={sect}>
                              {sect}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Preferred Resident */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Preferred Resident
                        </label>
                        <select
                          name="preferredResident"
                          value={partnerPrefs.preferredResident}
                          onChange={handlePartnerChange}
                          className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                        >
                          <option value="">Select</option>
                          {preferredResidentOptions.map((location) => (
                            <option key={location} value={location}>
                              {location}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Detailed Expectations */}
                      <div className="md:col-span-2 lg:col-span-3 space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Detailed Expectations
                        </label>
                        <textarea
                          name="detailedExpectations"
                          value={partnerPrefs.detailedExpectations}
                          onChange={handlePartnerChange}
                          placeholder="Specific qualities you desire in a partner..."
                          rows={4}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="confirmation"
                        checked={confirmationChecked}
                        onChange={(e) =>
                          setConfirmationChecked(e.target.checked)
                        }
                        className="mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="confirmation"
                        className="text-sm text-gray-700"
                      >
                        I confirm that all information submitted above is true
                        and correct.
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                    <Button
                      type="button"
                      onClick={resetForm}
                      disabled={loading}
                      className="px-8 h-12 text-base font-semibold bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl flex items-center gap-2"
                      value="Reset Form"
                    />

                    <Button
                      type="submit"
                      disabled={loading || !confirmationChecked}
                      className="px-8 h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={
                        loading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Adding ...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Profile
                          </span>
                        )
                      }
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
