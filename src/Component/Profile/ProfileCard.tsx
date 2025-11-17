import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase, GraduationCap, Heart, Trash2 } from "lucide-react";

interface ProfileCardProps {
  profile: any;
  isAdmin: boolean;
  onDelete: (profileId: string, profileType: string) => void;
}

export default function ProfileCard({
  profile,
  isAdmin,
  onDelete,
}: ProfileCardProps) {
  const navigate = useNavigate();

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 0;
    try {
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
    } catch (error) {
      return 0;
    }
  };

  const handleViewProfile = () => {
    navigate(`/view-profile/${profile.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when delete button is clicked
    onDelete(profile.id, profile.type);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-pink-300 group cursor-pointer">
      {/* Profile Image Section */}
      <div className="relative h-48 overflow-hidden">
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            alt={profile.name}
            className="w-full h-full  object-contain rounded-xl bg-gray-100 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
            <div className="text-5xl text-purple-400">
              {profile.gender === "Female" ? "👩" : "👨"}
            </div>
          </div>
        )}

        {/* Profile Type Badge */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-white">
          {profile.type === "user" ? "User Profile" : "Added Profile"}
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-5">
        {/* Name and Basic Info */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-800 truncate flex-1 mr-2">
              {profile.name || "No Name"}
            </h3>
          </div>

          {/* Gender and Age Row */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                profile.gender === "Male"
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : "bg-pink-100 text-pink-800 border border-pink-200"
              }`}
            >
              {profile.gender || "Not specified"}
            </span>
            
            {profile.dateOfBirth && (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold border border-gray-200">
                {calculateAge(profile.dateOfBirth)} years
              </span>
            )}
          </div>

          {/* Profession and Location */}
          <div className="space-y-2">
            {profile.occupation && (
              <div className="flex items-center gap-2 text-gray-700">
                <Briefcase className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-base font-medium truncate">{profile.occupation}</span>
              </div>
            )}

            {profile.currentCity && (
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-base truncate">{profile.currentCity}</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {profile.qualification && (
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">
                {profile.qualification}
              </span>
            </div>
          )}

          {profile.religion && (
            <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
              <span className="text-base">🕌</span>
              {profile.religion}
            </div>
          )}

          {profile.maritalStatus && (
            <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
              <span className="text-base">💍</span>
              {profile.maritalStatus}
            </div>
          )}

          {profile.caste && (
            <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
              <span className="text-base">👑</span>
              {profile.caste}
            </div>
          )}
        </div>

        {/* About Me Preview */}
        {(profile.aboutMe || profile.bio) && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {profile.aboutMe || profile.bio}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* View Profile Button */}
          <button
            onClick={handleViewProfile}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg text-base"
          >
            <Heart className="h-4 w-4" />
            View Profile
          </button>

          {/* Admin Delete Button */}
          {isAdmin && (
            <button
              onClick={handleDeleteClick}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-200 text-base"
            >
              <Trash2 className="h-4 w-4" />
              Delete Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}