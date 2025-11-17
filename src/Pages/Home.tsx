import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import ProfileCard from "../Component/Profile/ProfileCard";
import Header from "../Component/layout/Header";
import Footer from "../Component/layout/Footer";
import { Search, X, SlidersHorizontal } from "lucide-react";

export default function Home() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    city: "",
    ageMin: "",
    ageMax: "",
    caste: "",
    religion: "",
    gender: "",
    maritalStatus: "",
    qualification: "",
  });

  // Get isAdmin from AuthContext
  const { isAdmin, currentUser } = useAuth();

  // ✅ Debugging console logs
  console.log("🏠 Home Component Debug:", {
    currentUser: currentUser?.email,
    isAdmin: isAdmin,
    adminEmail: "admin@rishtahub.online",
    profilesCount: profiles.length,
    filteredProfilesCount: filteredProfiles.length,
  });

  useEffect(() => {
    // ✅ Scroll to top once when Home mounts
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Delete profile function - Admin ke liye
  const handleDeleteProfile = async (
    profileId: string,
    profileType: string
  ) => {
    console.log("🗑️ Delete clicked:", { profileId, profileType, isAdmin });

    if (!isAdmin) {
      console.log("❌ Delete blocked: User is not admin");
      return;
    }

    if (window.confirm("Are You Sure to Delete ?")) {
      try {
        // Determine collection name based on profile type
        const collectionName = profileType === "user" ? "users" : "rishtas";
        console.log("🔥 Deleting from collection:", collectionName);

        // Delete from Firebase
        await deleteDoc(doc(db, collectionName, profileId));

        // Frontend se remove karein
        setProfiles((prev) =>
          prev.filter((profile) => profile.id !== profileId)
        );
        setFilteredProfiles((prev) =>
          prev.filter((profile) => profile.id !== profileId)
        );

        console.log("✅ Profile deleted successfully");
        alert("Profile successfully deleted");
      } catch (error) {
        console.error("❌ Delete failed:", error);
        alert("Profile delete nahi ho saka");
      }
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        console.log("🔄 Fetching profiles from both collections...");

        const [usersSnapshot, rishtasSnapshot] = await Promise.all([
          getDocs(
            query(
              collection(db, "users"),
              where("profileCompleted", "==", true)
            )
          ),
          getDocs(
            query(collection(db, "rishtas"), where("status", "==", "active"))
          ),
        ]);

        const currentUser = auth.currentUser;
        console.log("👤 Current auth user:", currentUser?.email);

        const userProfiles = usersSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            type: "user",
            age: calculateAge(doc.data().dateOfBirth),
          }))
          .filter((profile) => profile.id !== currentUser?.uid);

        const rishtaProfiles = rishtasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "rishta",
          age: calculateAge(doc.data().dateOfBirth),
        }));

        const allProfiles = [...userProfiles, ...rishtaProfiles];
        console.log("📊 Profiles loaded:", {
          userProfiles: userProfiles.length,
          rishtaProfiles: rishtaProfiles.length,
          total: allProfiles.length,
        });

        setProfiles(allProfiles);
        setFilteredProfiles(allProfiles);
      } catch (error) {
        console.error("❌ Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
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

  // Apply filters
  useEffect(() => {
    let results = profiles;

    // Search filter
    if (searchTerm) {
      results = results.filter(
        (profile) =>
          profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.currentCity
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          profile.occupation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Advanced filters
    if (filters.city) {
      results = results.filter((profile) =>
        profile.currentCity?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.caste) {
      results = results.filter((profile) => profile.caste === filters.caste);
    }

    if (filters.religion) {
      results = results.filter(
        (profile) => profile.religion === filters.religion
      );
    }

    if (filters.gender) {
      results = results.filter((profile) => profile.gender === filters.gender);
    }

    if (filters.maritalStatus) {
      results = results.filter(
        (profile) => profile.maritalStatus === filters.maritalStatus
      );
    }

    if (filters.qualification) {
      results = results.filter(
        (profile) => profile.qualification === filters.qualification
      );
    }

    // Age filter
    if (filters.ageMin || filters.ageMax) {
      results = results.filter((profile) => {
        const age = calculateAge(profile.dateOfBirth);
        if (filters.ageMin && age < parseInt(filters.ageMin)) return false;
        if (filters.ageMax && age > parseInt(filters.ageMax)) return false;
        return true;
      });
    }

    setFilteredProfiles(results);
  }, [profiles, searchTerm, filters]);

  const clearFilters = () => {
    setFilters({
      city: "",
      ageMin: "",
      ageMax: "",
      caste: "",
      religion: "",
      gender: "",
      maritalStatus: "",
      qualification: "",
    });
    setSearchTerm("");
  };

  const hasActiveFilters =
    Object.values(filters).some((value) => value !== "") || searchTerm !== "";

  if (loading) {
    return (
      <>
        <Header />

        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center text-[110%]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-8 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Find Your Perfect Match 💞
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover meaningful connections with verified profiles. Your journey
            to forever starts here.
          </p>
        </div>

        {/* Admin Banner - Sirf admin ko dikhega */}
        {isAdmin && (
          <div className="max-w-7xl mx-auto mb-6 px-4">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-xl flex items-center justify-between p-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-semibold text-sm truncate">
                  👑 Admin:
                </span>
                <span className="text-sm truncate">Delete Any Profile</span>
              </div>
              <div className="text-xs bg-yellow-200 px-2 py-1 rounded shrink-0">
                Active
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, city, or profession..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 ${
                    showFilters
                      ? "bg-pink-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      !
                    </span>
                  )}
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-300 transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={filters.city}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.ageMin}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          ageMin: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.ageMax}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          ageMax: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Any Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Caste Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caste
                  </label>
                  <select
                    value={filters.caste}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, caste: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Any Caste</option>
                    <option value="Syed">Syed</option>
                    <option value="Mughal">Mughal</option>
                    <option value="Sheikh">Sheikh</option>
                    <option value="Rajput">Rajput</option>
                    <option value="Jat">Jat</option>
                    <option value="Arain">Arain</option>
                    <option value="Pathan">Pathan</option>
                    <option value="Baloch">Baloch</option>
                  </select>
                </div>

                {/* Religion Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religion
                  </label>
                  <select
                    value={filters.religion}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        religion: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Any Religion</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Christian">Christian</option>
                    <option value="Hindu">Hindu</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    value={filters.maritalStatus}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maritalStatus: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Any Status</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                {/* Qualification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualification
                  </label>
                  <select
                    value={filters.qualification}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        qualification: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Any Qualification</option>
                    <option value="Matric">Matric</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Bachelor">Bachelor's</option>
                    <option value="Master">Master's</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold text-pink-600">
                {filteredProfiles.length}
              </span>{" "}
              profiles
              {hasActiveFilters && " (filtered)"}
            </p>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="max-w-7xl mx-auto">
          {filteredProfiles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  isAdmin={isAdmin}
                  onDelete={() => handleDeleteProfile(profile.id, profile.type)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No profiles found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {hasActiveFilters
                  ? "Try adjusting your filters to see more results."
                  : "No profiles available at the moment. Please check back later."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
