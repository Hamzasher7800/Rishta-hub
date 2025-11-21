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
    <div className="rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden cursor-pointer">
      {/* Image */}
      <div className="relative bg-gray-100 aspect-[4/5] w-full overflow-hidden flex items-center justify-center border-b border-gray-200">
        {profile.profileImage && !profile.__imgError ? (
          <img
            src={profile.profileImage}
            alt={profile.name}
            className="w-full h-full object-cover object-center rounded-md"
            onError={e => { e.currentTarget.style.display = 'none'; if (profile) profile.__imgError = true; }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-6xl text-gray-300">
            {profile.gender === 'Female' ? '👩' : '👨'}
          </div>
        )}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-black/60 text-white">
          {profile.type === 'user' ? 'User Profile' : 'Added Profile'}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3 text-sm">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {profile.name || "No Name"}
            </h3>

            {profile.currentCity && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-pink-600 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                <MapPin className="h-3 w-3" />
                {profile.currentCity}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {profile.gender && (
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  profile.gender === "Male"
                    ? "bg-blue-50 border-blue-100 text-blue-700"
                    : "bg-pink-50 border-pink-100 text-pink-700"
                }`}
              >
                {profile.gender}
              </span>
            )}

            {profile.dateOfBirth && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-gray-50 border-gray-100 text-gray-700">
                {calculateAge(profile.dateOfBirth)} years
              </span>
            )}

            {profile.maritalStatus && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-purple-50 border-purple-100 text-purple-700">
                {profile.maritalStatus}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 text-[13px] text-gray-600">
          {profile.occupation && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
              <span className="truncate">{profile.occupation}</span>
            </div>
          )}

          {profile.qualification && (
            <div className="flex items-center gap-2">
              <GraduationCap className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
              <span className="truncate">{profile.qualification}</span>
            </div>
          )}

          {profile.religion && (
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">🕌</span>
              <span className="truncate">{profile.religion}</span>
            </div>
          )}

          {profile.caste && (
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">👑</span>
              <span className="truncate">{profile.caste}</span>
            </div>
          )}
        </div>

        {(profile.aboutMe || profile.bio) && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {profile.aboutMe || profile.bio}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 space-y-2">
        <button
          onClick={handleViewProfile}
          className="w-full text-sm font-semibold text-white bg-pink-500 hover:bg-pink-600 rounded-xl py-2.5 flex items-center justify-center gap-1 transition-colors"
        >
          <Heart className="h-4 w-4" />
          View Profile Details
        </button>

        {isAdmin && (
          <button
            onClick={handleDeleteClick}
            className="w-full text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-xl py-2.5 flex items-center justify-center gap-1 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete Profile
          </button>
        )}
      </div>
    </div>
  );
}