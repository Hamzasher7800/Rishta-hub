import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Briefcase,
  Users,
  Book,
  Mail,
  Globe,
  Star,
  Shield,
  Crown,
} from "lucide-react";
import Button from "../Component/Common/Button";
import Header from "../Component/layout/Header";
import Footer from "../Component/layout/Footer";

interface ProfileData {
  // Basic Information
  id: string;
  type?: "user" | "rishta";
  uid?: string;
  profileCompleted?: boolean;
  profileCreatedBy: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  height: string;

  // Personal Details
  maritalStatus: string;
  religion: string;
  sect: string;
  caste: string;

  // Residential Information
  country: string;
  currentCity: string;

  // Education/Qualifications/Profession
  qualification: string;
  educationField: string;
  occupation: string;

  // Family Information
  fatherOccupation: string;
  motherOccupation: string;
  totalBrothers: string;
  marriedBrothers: string;
  totalSisters: string;
  marriedSisters: string;

  // Partner Preferences
  partnerPrefs?: {
    partnerAgeMin: string;
    partnerAgeMax: string;
    preferredCaste: string;
    preferredSect: string;
    preferredResident: string;
    detailedExpectations: string;
  };

  profileImage?: string;
  email?: string;
  createdAt?: string;
}

// Updated Country data
// const countries = [
//   "Pakistan",
//   "Saudi Arabia",
//   "United Arab Emirates (UAE)",
//   "Qatar",
//   "Oman",
//   "Kuwait",
//   "Malaysia",
//   "South Korea",
//   "Japan",
//   "China",
//   "Turkey",
//   "United Kingdom (UK)",
//   "United States (USA)",
//   "Canada",
//   "Australia",
//   "Italy",
//   "Spain",
//   "Germany",
//   "Norway",
//   "Greece",
//   "India"
// ];

// City data for different countries
// const cityData: { [key: string]: string[] } = {
//   "Pakistan": [
//     "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot"
//   ],
//   "Saudi Arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam"],
//   "United Arab Emirates (UAE)": ["Dubai", "Abu Dhabi", "Sharjah", "Al Ain", "Ajman"],
//   "Qatar": ["Doha", "Al Rayyan", "Umm Salal", "Al Wakrah", "Al Khor"],
//   "Oman": ["Muscat", "Salalah", "Sohar", "Nizwa", "Sur"],
//   "Kuwait": ["Kuwait City", "Hawalli", "Farwaniya", "Ahmadi", "Jahra"],
//   "Malaysia": ["Kuala Lumpur", "Penang", "Johor Bahru", "Ipoh", "Malacca"],
//   "South Korea": ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon"],
//   "Japan": ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya"],
//   "China": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu"],
//   "Turkey": ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
//   "United Kingdom (UK)": ["London", "Manchester", "Birmingham", "Liverpool", "Glasgow"],
//   "United States (USA)": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
//   "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
//   "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
//   "Italy": ["Rome", "Milan", "Naples", "Turin", "Palermo"],
//   "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza"],
//   "Germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt"],
//   "Norway": ["Oslo", "Bergen", "Stavanger", "Trondheim", "Drammen"],
//   "Greece": ["Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa"],
//   "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"]
// };

// Height options
// const heightOptions = [
//   "4'0\"", "4'1\"", "4'2\"", "4'3\"", "4'4\"", "4'5\"", "4'6\"", "4'7\"", "4'8\"", "4'9\"", "4'10\"", "4'11\"",
//   "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"",
//   "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\"", "6'5\"", "6'6\"", "6'7\"", "6'8\"", "6'9\"", "6'10\"", "6'11\"", "7'0\""
// ];

// Cast options
// const castOptions = [
//   "Jutt",
//   "Rajput",
//   "Arain",
//   "Gujjar",
//   "Awan",
//   "Syed",
//   "Buttar",
//   "Sheikh",
//   "Pathan",
//   "Baloch",
//   "Malik",
//   "Mughal",
//   "Qureshi",
//   "Kashmiri Butt",
//   "Dogar",
//   "Khokhar",
//   "Chauhan",
//   "Ansari",
//   "Lodhi",
//   "Qazi",
//   "Niazi"
// ];

// Preferred cast options
// const preferredCastOptions = [
//   "Any",
//   "Jutt",
//   "Rajput",
//   "Arain",
//   "Buttar",
//   "Gujjar",
//   "Awan",
//   "Syed",
//   "Sheikh",
//   "Pathan",
//   "Baloch",
//   "Malik",
//   "Mughal",
//   "Qureshi",
//   "Kashmiri Butt",
//   "Dogar",
//   "Khokhar",
//   "Chauhan",
//   "Ansari",
//   "Lodhi",
//   "Qazi",
//   "Niazi",
//   "No preference"
// ];

// Preferred resident options
// const preferredResidentOptions = [
//   "No preference",
//   "Pakistan",
//   "India",
//   "Saudi Arabia",
//   "United Arab Emirates (UAE)",
//   "Qatar",
//   "Oman",
//   "Kuwait",
//   "Malaysia",
//   "South Korea",
//   "Japan",
//   "China",
//   "Turkey",
//   "United Kingdom (UK)",
//   "United States (USA)",
//   "Canada",
//   "Australia",
//   "Italy",
//   "Spain",
//   "Germany",
//   "Norway",
//   "Greece",
//   "Any"
// ];

// Get sect options based on religion
// const getSectOptions = (religion: string) => {
//   switch (religion) {
//     case "Muslim":
//       return [
//         "No Sect - Prefer to be Muslim Only",
//         "Barelvi",
//         "Deobandi",
//         "Ahl-i Hadith",
//         "Hanafi",
//         "Tablighi Jamaat",
//         "Wahhabi",
//         "Chishti",
//         "Naqshbandi",
//         "Qadiri",
//         "Suhrawardi",
//         "Maliki",
//         "Shafi'i",
//         "Hanbali",
//         "Imamia/Jaafry",
//         "Ismailis (Aga Khanis)",
//         "Dawoodi Bohras",
//         "Sulaymani Bohras",
//         "Zaydi",
//         "Alvi",
//         "Hazara",
//         "Other"
//       ];
//     case "Christian":
//       return [
//         "Catholic",
//         "Protestant",
//         "Presbyterian",
//         "Methodist",
//         "Pentecostal",
//         "Seventh-day Adventist",
//         "Orthodox",
//         "Salvation Army"
//       ];
//     case "Hindu":
//       return [
//         "Hindu",
//         "Vaishnavism",
//         "Shaivism",
//         "Shaktism",
//         "Smartism",
//         "Ganapatya"
//       ];
//     default:
//       return ["Other"];
//   }
// };

export default function ViewProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError("Profile ID not found");
        setLoading(false);
        return;
      }

      try {
        console.log("🔄 Fetching profile with ID:", userId);

        // ✅ Pehle users collection mein check karein
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          console.log("✅ Profile found in users collection");
          setProfile({
            ...(userDocSnap.data() as ProfileData),
            id: userDocSnap.id,
            type: "user",
          });
          setLoading(false);
          return;
        }

        // ✅ Agar users mein nahi mila, toh rishtas collection mein check karein
        const rishtaDocRef = doc(db, "rishtas", userId);
        const rishtaDocSnap = await getDoc(rishtaDocRef);

        if (rishtaDocSnap.exists()) {
          console.log("✅ Profile found in rishtas collection");
          const rishtaData = rishtaDocSnap.data() as any;

          // ✅ Convert rishta data to match ProfileData structure
          setProfile({
            ...rishtaData,
            id: rishtaDocSnap.id,
            type: "rishta",
            // Agar aapke ProfileData mein specific fields hain, unko map karein
            uid: rishtaData.createdBy || rishtaDocSnap.id,
            profileCompleted: true,
          });
          setLoading(false);
          return;
        }

        // ✅ Agar dono collections mein nahi mila
        console.log("❌ Profile not found in any collection");
        setError("Profile not found");
      } catch (err: any) {
        console.error("❌ Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleWhatsAppClick = () => {
    if (!profile?.phoneNumber) return;

    // Remove any non-digit characters from phone number
    const cleanPhoneNumber = profile.phoneNumber.replace(/\D/g, "");

    // Create WhatsApp URL with a professional message
    const message = `Hello ${profile.name}, I came across your profile on the RishtaHub app and would like to connect with you.`;
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center text-[110%]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading profile information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center text-[110%]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Profile Not Available
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The profile you're looking for doesn't exist or has been removed."}
          </p>
          <Button
            onClick={() => navigate("/")}
            className="px-6 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
            value="Return to Home"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 px-3 sm:px-4 text-[110%]">
        <div className="max-w-6xl mx-auto">
          {/* Main Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header with Navigation */}
            <div className="bg-white border-b border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-blue-700 hover:text-indigo-600 font-semibold transition-colors group text-sm sm:text-base"
                >
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
                  Back to Profiles
                </button>

                {/* Profile Status Badge */}
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-green-800">
                    Profile Active
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Image and Basic Info */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-200">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage}
                        alt={profile.name}
                        onClick={() =>
                          setZoomedImage(profile.profileImage || null)
                        }
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                      </div>
                    )}
                  </div>
                  {/* Verification Badge */}
                  <div className="absolute bottom-1 right-1 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center">
                    <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                      {profile.name}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium border border-blue-200">
                        {profile.gender}
                      </span>
                      <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium border border-green-200">
                        {calculateAge(profile.dateOfBirth)} Years
                      </span>
                      {profile.maritalStatus && (
                        <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium border border-purple-200">
                          {profile.maritalStatus}
                        </span>
                      )}
                      {profile.height && (
                        <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm font-medium border border-orange-200">
                          {profile.height}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 text-gray-700 text-sm sm:text-base">
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                      <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                      <span className="text-xs sm:text-sm">
                        {profile.occupation || "Professional"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      <span className="text-xs sm:text-sm">
                        {profile.currentCity}, {profile.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                      <Book className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                      <span className="text-xs sm:text-sm">
                        {profile.qualification}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {zoomedImage && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                {/* Close button */}
                <button
                  onClick={() => setZoomedImage(null)}
                  className="fixed top-4 right-4 z-[60] text-white text-3xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition"
                >
                  ✕
                </button>

                {/* Image */}
                <img
                  src={zoomedImage}
                  alt="Zoomed"
                  className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl object-contain"
                />
              </div>
            )}

            {/* Profile Details */}
            <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
              <div className="space-y-6">
                {/* Main Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Personal Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <SectionCard
                      icon={<User className="h-4 w-4 sm:h-5 sm:w-5" />}
                      title="Basic Information"
                      color="blue"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <InfoItem
                          icon={<Calendar className="h-4 w-4" />}
                          label="Date of Birth"
                          value={profile.dateOfBirth}
                        />
                        <InfoItem
                          icon={<User className="h-4 w-4" />}
                          label="Profile Created By"
                          value={profile.profileCreatedBy}
                        />
                        <InfoItem
                          icon="📏"
                          label="Height"
                          value={profile.height}
                        />
                      </div>
                    </SectionCard>

                    {/* Personal Details */}
                    <SectionCard
                      icon={<Shield className="h-4 w-4 sm:h-5 sm:w-5" />}
                      title="Personal Details"
                      color="indigo"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <InfoItem
                          icon={<Heart className="h-4 w-4" />}
                          label="Marital Status"
                          value={profile.maritalStatus}
                        />
                        <InfoItem
                          icon={<Globe className="h-4 w-4" />}
                          label="Religion"
                          value={profile.religion}
                        />
                        <InfoItem
                          icon={<Crown className="h-4 w-4" />}
                          label="Sect"
                          value={profile.sect}
                        />
                        <InfoItem
                          icon={<Shield className="h-4 w-4" />}
                          label="Caste"
                          value={profile.caste}
                        />
                      </div>
                    </SectionCard>

                    {/* Education/Qualifications/Profession */}
                    <SectionCard
                      icon={<Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />}
                      title="Education/Qualifications/Profession"
                      color="purple"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <InfoItem
                          icon={<Book className="h-4 w-4" />}
                          label="Qualification"
                          value={profile.qualification}
                        />
                        <InfoItem
                          icon={<Star className="h-4 w-4" />}
                          label="Education Field"
                          value={profile.educationField}
                        />
                        <InfoItem
                          icon={<Briefcase className="h-4 w-4" />}
                          label="Occupation"
                          value={profile.occupation}
                        />
                      </div>
                    </SectionCard>

                    {/* Family Information */}
                    <SectionCard
                      icon={<Users className="h-4 w-4 sm:h-5 sm:w-5" />}
                      title="Family Information"
                      color="green"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <InfoItem
                          icon={<User className="h-4 w-4" />}
                          label="Father's Occupation"
                          value={profile.fatherOccupation}
                        />
                        <InfoItem
                          icon={<User className="h-4 w-4" />}
                          label="Mother's Occupation"
                          value={profile.motherOccupation}
                        />
                        {profile.totalBrothers && (
                          <InfoItem
                            icon={<Users className="h-4 w-4" />}
                            label="Number of Brothers"
                            value={profile.totalBrothers}
                          />
                        )}
                        {profile.marriedBrothers && (
                          <InfoItem
                            icon={<Heart className="h-4 w-4" />}
                            label="Married Brothers"
                            value={profile.marriedBrothers}
                          />
                        )}
                        {profile.totalSisters && (
                          <InfoItem
                            icon={<Users className="h-4 w-4" />}
                            label="Number of Sisters"
                            value={profile.totalSisters}
                          />
                        )}
                        {profile.marriedSisters && (
                          <InfoItem
                            icon={<Heart className="h-4 w-4" />}
                            label="Married Sisters"
                            value={profile.marriedSisters}
                          />
                        )}
                      </div>
                    </SectionCard>
                  </div>

                  {/* Right Column - Additional Info */}
                  <div className="space-y-6">
                    {/* Contact Card with WhatsApp */}
                    <SectionCard
                      icon={<Phone className="h-4 w-4 sm:h-5 sm:w-5" />}
                      title="Contact Information"
                      color="blue"
                    >
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <InfoItem
                            icon={<Phone className="h-4 w-4" />}
                            label="Mobile Number"
                            value={profile.phoneNumber}
                          />
                          {profile.email && (
                            <InfoItem
                              icon={<Mail className="h-4 w-4" />}
                              label="Email Address"
                              value={profile.email}
                            />
                          )}
                        </div>

                        {/* WhatsApp Button with Official Logo */}
                        <button
                          onClick={handleWhatsAppClick}
                          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.209-3.553-8.485" />
                          </svg>
                          WhatsApp Chat
                        </button>
                      </div>
                    </SectionCard>

                    {/* Residential Information */}
                    <SectionCard
                      icon={<MapPin className="h-4 w-4 sm:h-5 sm:w-5" />}
                      title="Residential Information"
                      color="orange"
                    >
                      <div className="space-y-3">
                        <InfoItem
                          icon={<Globe className="h-4 w-4" />}
                          label="Country"
                          value={profile.country}
                        />
                        <InfoItem
                          icon={<MapPin className="h-4 w-4" />}
                          label="Current City"
                          value={profile.currentCity}
                        />
                      </div>
                    </SectionCard>
                  </div>
                </div>

                {/* Partner Preferences */}
                {profile.partnerPrefs && (
                  <SectionCard
                    icon={<Heart className="h-4 w-4 sm:h-5 sm:w-5" />}
                    title="Partner Preferences"
                    color="pink"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <InfoItem
                        icon="🎂"
                        label="Age Range"
                        value={`${profile.partnerPrefs.partnerAgeMin} - ${profile.partnerPrefs.partnerAgeMax} years`}
                      />
                      {profile.partnerPrefs.preferredCaste && (
                        <InfoItem
                          icon="👑"
                          label="Preferred Caste"
                          value={profile.partnerPrefs.preferredCaste}
                        />
                      )}
                      {profile.partnerPrefs.preferredSect && (
                        <InfoItem
                          icon="🕌"
                          label="Preferred Sect"
                          value={profile.partnerPrefs.preferredSect}
                        />
                      )}
                      {profile.partnerPrefs.preferredResident && (
                        <InfoItem
                          icon="📍"
                          label="Preferred Resident"
                          value={profile.partnerPrefs.preferredResident}
                        />
                      )}
                    </div>

                    {profile.partnerPrefs.detailedExpectations && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                          Detailed Expectations
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {profile.partnerPrefs.detailedExpectations}
                        </p>
                      </div>
                    )}
                  </SectionCard>
                )}
              </div>

              {/* Single Back Button at Bottom */}
              <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => navigate(-1)}
                  className="px-6 sm:px-8 h-10 sm:h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                  value="Back to Profiles"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Helper Component for Info Items
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors text-[110%]">
      <div className="w-5 h-5 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs sm:text-sm font-semibold text-gray-500 mb-1">
          {label}
        </div>
        <div className="text-gray-800 font-medium text-sm sm:text-base">
          {value || "Not specified"}
        </div>
      </div>
    </div>
  );
}

// Section Card Component
interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  color?: "blue" | "indigo" | "purple" | "green" | "orange" | "pink";
}

function SectionCard({
  icon,
  title,
  children,
  color = "blue",
}: SectionCardProps) {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50",
    indigo: "border-indigo-200 bg-indigo-50",
    purple: "border-purple-200 bg-purple-50",
    green: "border-green-200 bg-green-50",
    orange: "border-orange-200 bg-orange-50",
    pink: "border-pink-200 bg-pink-50",
  };

  const iconColors = {
    blue: "text-blue-600",
    indigo: "text-indigo-600",
    purple: "text-purple-600",
    green: "text-green-600",
    orange: "text-orange-600",
    pink: "text-pink-600",
  };

  return (
    <div
      className={`border rounded-xl p-4 sm:p-6 text-[110%] ${colorClasses[color]}`}
    >
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
        <span className={iconColors[color]}>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}
