import React from "react";
import { useSelector } from "react-redux";
import { selectRoles } from "../../features/auth/authSelectors";
import { selectNavHeight } from "../../features/util/screenSelector";
import { useGetUserProfile } from "../../hooks/useAuth";
import { isApiResponse } from "../../types/apiResponseType";

const UserProfilePage: React.FC = () => {
  const roles = useSelector(selectRoles);
  const navHeight = useSelector(selectNavHeight);
  const { data, isLoading, isError } = useGetUserProfile();

  const userData =
    data && isApiResponse(data) ? data.data : null;

  // Tag logic unchanged
  const getDisplayTag = () => {
    if (roles.includes("admin")) return "admin";
    if (roles.includes("seller")) return "seller";
    return null;
  };

  const displayTag = getDisplayTag();
  const sellerProfile = userData?.profiles?.find((p) => p.role === "seller");

  if (isLoading) {
    return (
      <div
        style={{ marginTop: `${navHeight}px` }}
        className="flex justify-center items-center p-12"
      >
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (isError || !userData) {
    return (
      <div
        style={{ marginTop: `${navHeight}px` }}
        className="flex flex-col items-center justify-center p-12 text-center"
      >
        <p className="text-gray-700 mb-4">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div
      style={{ marginTop: `${navHeight}px` }}
      className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-12 flex flex-col sm:flex-row gap-12"
    >
      {/* Left Avatar Section */}
      <div className="flex flex-col items-center w-full sm:w-auto">
        <div className="relative">
          <div className="w-48 h-48 rounded-3xl bg-gray-100 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <svg
                className="w-32 h-32 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <button className="absolute top-3 left-3 bg-gray-800 text-white rounded-full p-2 shadow-lg hover:bg-black transition">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        {/* Upload Buttons */}
        <div className="flex gap-3 mt-6 w-full max-w-xs">
          <button className="flex-1 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-400 hover:border-yellow-400 hover:text-yellow-600 transition flex flex-col items-center gap-1">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-xs">LOGO</span>
          </button>
          <button className="flex-1 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-400 hover:border-yellow-400 hover:text-yellow-600 transition flex flex-col items-center gap-1">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-xs">VENDOR DOCS</span>
          </button>
        </div>
      </div>

      {/* Right Profile Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Name with Tag */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-semibold text-gray-800">
                {userData.first_name} {userData.last_name}
              </h2>
              {displayTag && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide
                  ${displayTag === "admin" ? "bg-black text-yellow-400" : ""}
                  ${displayTag === "seller" ? "bg-yellow-100 text-yellow-700" : ""}
                `}
                >
                  {displayTag}
                </span>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Email:</span>
              <p className="text-gray-800">{userData.email}</p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Phone Number:</span>
              <p className="text-gray-800">{userData.phone}</p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Address:</span>
              <p className="text-gray-800">
                285 N Broad St, Elizabeth, NJ 07208, USA
              </p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            {sellerProfile?.bio && (
              <div>
                <span className="text-sm text-gray-500">Bio:</span>
                <p className="text-gray-700 text-sm">{sellerProfile.bio}</p>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500">Joined:</span>
              <p className="text-gray-700 text-sm">
                {new Date(userData.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button className="mt-8 w-full sm:w-auto px-8 py-3 rounded-lg border-2 border-black text-black hover:text-white font-medium hover:bg-slate-950 transition-colors flex items-center justify-center gap-2">
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          EDIT PROFILE
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;
