import { useState, useRef } from "react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Heart,
  Camera,
  Upload,
  X,
  Briefcase,
  Users,
} from "lucide-react";
import Button from "../Component/Common/Button";

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

// Height options for dropdown (4'0" to 6'5" with half inch increments)
const heightOptions = [
  "4'0\"",
  "4'0.5\"",
  "4'1\"",
  "4'1.5\"",
  "4'2\"",
  "4'2.5\"",
  "4'3\"",
  "4'3.5\"",
  "4'4\"",
  "4'4.5\"",
  "4'5\"",
  "4'5.5\"",
  "4'6\"",
  "4'6.5\"",
  "4'7\"",
  "4'7.5\"",
  "4'8\"",
  "4'8.5\"",
  "4'9\"",
  "4'9.5\"",
  "4'10\"",
  "4'10.5\"",
  "4'11\"",
  "4'11.5\"",
  "5'0\"",
  "5'0.5\"",
  "5'1\"",
  "5'1.5\"",
  "5'2\"",
  "5'2.5\"",
  "5'3\"",
  "5'3.5\"",
  "5'4\"",
  "5'4.5\"",
  "5'5\"",
  "5'5.5\"",
  "5'6\"",
  "5'6.5\"",
  "5'7\"",
  "5'7.5\"",
  "5'8\"",
  "5'8.5\"",
  "5'9\"",
  "5'9.5\"",
  "5'10\"",
  "5'10.5\"",
  "5'11\"",
  "5'11.5\"",
  "6'0\"",
  "6'0.5\"",
  "6'1\"",
  "6'1.5\"",
  "6'2\"",
  "6'2.5\"",
  "6'3\"",
  "6'3.5\"",
  "6'4\"",
  "6'4.5\"",
  "6'5\"",
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

export default function CompleteProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    // Basic Information
    profileCreatedBy: "",
    name: "",
    gender: "",
    dateOfBirth: "",
    height: "",

    // Personal Details
    maritalStatus: "",
    maritalStatusDescription: "", // For "Describe your Status" option
    relation: "",
    sect: "",
    caste: "",

    // Qualification/Profession
    qualification: "",
    occupation: "",

    // Residential Details
    country: "",
    currentCity: "",
    house: "",

    // Family Information
    fatherOccupation: "",
    motherOccupation: "",
    totalBrothers: "",
    marriedBrothers: "",
    totalSisters: "",
    marriedSisters: "",

    // Contact Information
    contactPersonName: "",
    contactPersonRelation: "",
    phoneNumber: "",
    noCallMessagesOnly: false,
    preferredCallTimings: "",
  });

  const [partnerPrefs, setPartnerPrefs] = useState({
    partnerAgeMin: "",
    partnerAgeMax: "",
    preferredQualification: "",
    preferredHeight: "",
    preferredCountry: "",
    preferredCity: "",
    preferredResidence: "",
    preferredCaste: "",
    preferredReligion: "",
    preferredSect: "",
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

      // Reset marital status description when marital status changes
      if (name === "maritalStatus" && value !== "Describe your Status") {
        updatedData.maritalStatusDescription = "";
      }

      // Reset city when country changes
      if (name === "country") {
        updatedData.currentCity = "";
      }

      // Reset preferred city when preferred country changes
      if (name === "preferredCountry") {
        setPartnerPrefs((prev) => ({ ...prev, preferredCity: "" }));
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

    // Validate marital status description if "Describe your Status" is selected
    if (
      profileData.maritalStatus === "Describe your Status" &&
      !profileData.maritalStatusDescription.trim()
    ) {
      alert("Please describe your marital status.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    setLoading(true);

    try {
      await setDoc(doc(db, "users", user.uid), {
        ...profileData,
        partnerPrefs,
        profileImage: imagePreview || "",
        uid: user.uid,
        email: user.email || "",
        createdAt: new Date().toISOString(),
        profileCompleted: true,
      });

      alert("🎉 Profile saved successfully!");
      navigate("/home");
    } catch (err: any) {
      console.error("❌ Error saving profile:", err);
      alert(`Error saving profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-4 text-[120%]">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-pink-500  font-medium mb-4 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#e67b7b] to-[#d86a6a] p-6 text-white">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="h-8 w-8" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Complete Your Profile
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl mx-auto">
                Tell us more about yourself to help us find your perfect match.
              </p>
            </div>
          </div>

          {/* Form Sections */}
          <div className="p-4 md:p-6">
            <form onSubmit={handleSubmit}>
              {/* Personal Information Section */}
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
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
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
                          className="px-4 h-8 md:px-6 md:h-10 text-xs md:text-sm font-semibold bg-gradient-to-r from-[#e67b7b] to-[#d86a6a] text-white rounded-lg flex items-center gap-1"
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
                    <User className="h-5 w-5 text-blue-600" />
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
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                      >
                        <option value="">Select</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Relative">Relative</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Name of Candidate */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Name of Candidate *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        placeholder="Enter candidate's full name"
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
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
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                      />
                    </div>

                    {/* Height */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Height *
                      </label>
                      <select
                        name="height"
                        value={profileData.height}
                        onChange={handleProfileChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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

                {/* Personal Details */}
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
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Never Married">Never Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widow">Widow</option>
                        <option value="Widower">Widower</option>
                        <option value="Describe your Status">Describe your Status</option>
                      </select>
                    </div>

                    {/* Marital Status Description - Show only if "Describe your Status" is selected */}
                    {profileData.maritalStatus === "Describe your Status" && (
                      <div className="md:col-span-2 lg:col-span-3 space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Describe your Status (50 words max) *
                        </label>
                        <textarea
                          name="maritalStatusDescription"
                          value={profileData.maritalStatusDescription}
                          onChange={handleProfileChange}
                          placeholder="Describe your marital status..."
                          maxLength={250}
                          rows={3}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          {profileData.maritalStatusDescription.length}/250 characters
                        </p>
                      </div>
                    )}

                    {/* Relation */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Relation
                      </label>
                      <input
                        type="text"
                        name="relation"
                        value={profileData.relation}
                        onChange={handleProfileChange}
                        placeholder="Enter relation"
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>

                    {/* Sect */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Sect
                      </label>
                      <select
                        name="sect"
                        value={profileData.sect}
                        onChange={handleProfileChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">Select Sect</option>
                        {getSectOptions("Muslim").map((sect) => (
                          <option key={sect} value={sect}>
                            {sect}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cast */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Cast
                      </label>
                      <select
                        name="caste"
                        value={profileData.caste}
                        onChange={handleProfileChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">Select Cast</option>
                        {castOptions.map((caste) => (
                          <option key={caste} value={caste}>
                            {caste}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Qualification/Profession */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex flex-wrap items-center gap-2 break-words">
                    <Briefcase className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="break-words leading-tight">
                      Qualification/Profession
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Qualification */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Qualifications
                      </label>
                      <select
                        name="qualification"
                        value={profileData.qualification}
                        onChange={handleProfileChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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

                    {/* Profession */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Profession
                      </label>
                      <select
                        name="occupation"
                        value={profileData.occupation}
                        onChange={handleProfileChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">Select Profession</option>
                        {occupationOptions.map((occupation) => (
                          <option key={occupation} value={occupation}>
                            {occupation}
                            </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Residential Details */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Residential Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Country Living In */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Country Living In
                      </label>
                      <select
                        name="country"
                        value={profileData.country}
                        onChange={handleProfileChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        City
                      </label>
                      <select
                        name="currentCity"
                        value={profileData.currentCity}
                        onChange={handleProfileChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        disabled={!profileData.country}
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

                    {/* House */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        House
                      </label>
                      <input
                        type="text"
                        name="house"
                        value={profileData.house}
                        onChange={handleProfileChange}
                        placeholder="Enter house details"
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Family Details */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Family Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Father Occupation */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Father Occupation
                      </label>
                      <select
                        name="fatherOccupation"
                        value={profileData.fatherOccupation}
                        onChange={handleProfileChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">Select Occupation</option>
                        {occupationOptions.map((occupation) => (
                          <option key={occupation} value={occupation}>
                            {occupation}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mother Occupation */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Mother Occupation
                      </label>
                      <select
                        name="motherOccupation"
                        value={profileData.motherOccupation}
                        onChange={handleProfileChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">Select</option>
                        {siblingOptions.map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Number of Married Brothers */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Number of Married Brothers
                      </label>
                      <select
                        name="marriedBrothers"
                        value={profileData.marriedBrothers}
                        onChange={handleProfileChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">Select</option>
                        {siblingOptions.map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Number of Married Sisters */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Number of Married Sisters
                      </label>
                      <select
                        name="marriedSisters"
                        value={profileData.marriedSisters}
                        onChange={handleProfileChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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

                {/* Partner Preferences */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-blue-800">
                          Partner Preferences
                        </h3>
                        <p className="text-blue-600 text-sm">
                          Tell us what you're looking for in a partner
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Age Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Age (Min)
                      </label>
                      <input
                        type="number"
                        name="partnerAgeMin"
                        value={partnerPrefs.partnerAgeMin}
                        onChange={handlePartnerChange}
                        placeholder="Min age"
                        min="18"
                        max="100"
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Age (Max)
                      </label>
                      <input
                        type="number"
                        name="partnerAgeMax"
                        value={partnerPrefs.partnerAgeMax}
                        onChange={handlePartnerChange}
                        placeholder="Max age"
                        min="18"
                        max="100"
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>

                    {/* Preferred Qualification */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Qualification
                      </label>
                      <select
                        name="preferredQualification"
                        value={partnerPrefs.preferredQualification}
                        onChange={handlePartnerChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">Any Qualification</option>
                        <option value="Matric">Matric</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Bachelor">Bachelor's</option>
                        <option value="Master">Master's</option>
                        <option value="PhD">PhD</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Preferred Height */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Height
                      </label>
                      <select
                        name="preferredHeight"
                        value={partnerPrefs.preferredHeight}
                        onChange={handlePartnerChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">Any Height</option>
                        {heightOptions.map((height) => (
                          <option key={height} value={height}>
                            {height}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred Country */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <select
                        name="preferredCountry"
                        value={partnerPrefs.preferredCountry}
                        onChange={handlePartnerChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">Any Country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred City */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        City
                      </label>
                      <select
                        name="preferredCity"
                        value={partnerPrefs.preferredCity}
                        onChange={handlePartnerChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        disabled={!partnerPrefs.preferredCountry}
                      >
                        <option value="">Any City</option>
                        {getCitiesForCountry(partnerPrefs.preferredCountry).map(
                          (city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Preferred Residence */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Residence
                      </label>
                      <select
                        name="preferredResidence"
                        value={partnerPrefs.preferredResidence}
                        onChange={handlePartnerChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">No preference</option>
                        {preferredResidentOptions.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred Cast */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Cast
                      </label>
                      <select
                        name="preferredCaste"
                        value={partnerPrefs.preferredCaste}
                        onChange={handlePartnerChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">Any Cast</option>
                        {preferredCastOptions.map((caste) => (
                          <option key={caste} value={caste}>
                            {caste}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred Religion */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Religion
                      </label>
                      <select
                        name="preferredReligion"
                        value={partnerPrefs.preferredReligion}
                        onChange={handlePartnerChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      >
                        <option value="">Any Religion</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Christian">Christian</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Preferred Sect */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Sect
                      </label>
                      <select
                        name="preferredSect"
                        value={partnerPrefs.preferredSect}
                        onChange={handlePartnerChange}
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                  </div>
                    </div>

                {/* Contact Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Contact Person Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        name="contactPersonName"
                        value={profileData.contactPersonName}
                        onChange={handleProfileChange}
                        placeholder="Enter contact person name"
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>

                    {/* Contact Person's Relation with candidate */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Contact Person's Relation with candidate
                      </label>
                      <input
                        type="text"
                        name="contactPersonRelation"
                        value={profileData.contactPersonRelation}
                        onChange={handleProfileChange}
                        placeholder="e.g., Father, Mother, Brother"
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>

                    {/* Mobile/WhatsApp Number */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        Mobile/WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleProfileChange}
                        placeholder="+92 300 1234567"
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                      />
                    </div>

                    {/* No call - Messages only */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        No call - Messages only
                      </label>
                      <div className="flex items-center h-12">
                        <input
                          type="checkbox"
                          name="noCallMessagesOnly"
                          checked={profileData.noCallMessagesOnly}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              noCallMessagesOnly: e.target.checked,
                            }))
                          }
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Messages only, no calls
                        </span>
                  </div>
                </div>

                    {/* Preferred Call timings */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Preferred Call timings
                      </label>
                      <input
                        type="text"
                        name="preferredCallTimings"
                        value={profileData.preferredCallTimings}
                        onChange={handleProfileChange}
                        placeholder="e.g., 9 AM - 6 PM"
                        className="w-full h-12 px-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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
                      onChange={(e) => setConfirmationChecked(e.target.checked)}
                      className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <label
                      htmlFor="confirmation"
                      className="text-sm text-gray-700 leading-relaxed"
                    >
                      <span className="block mb-1">
                        میں تصدیق کرتا ہوں/ کرتی ہوں کہ فارم میں درج کی گئی معلومات میرے علم کے مطابق صحیح اور درست ہیں ۔
                      </span>
                      <span className="block">
                        I hereby certify that the information entered in the form is true and correct to the best of my knowledge.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={loading || !confirmationChecked}
                    className="px-8 h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    value={
                      loading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving Profile...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Complete Profile
                          <Heart className="h-4 w-4" />
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
  );
}
