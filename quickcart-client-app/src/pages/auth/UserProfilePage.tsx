import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectRoles } from "../../features/auth/authSelectors";
import { selectNavHeight } from "../../features/util/screenSelector";
import { useGetUserProfile } from "../../hooks/useAuth";
import { isApiResponse } from "../../types/apiResponseType";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Upload,
  Camera,
  FileText,
  Loader2,
  AlertCircle,
  Shield,
  Store,
  Award,
} from "lucide-react";
import { setShowCategories } from "../../features/util/screenSlice";

export interface UserProfilePageProps {
  modal: boolean;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ modal }) => {
  const roles = useSelector(selectRoles);
  const navHeight = useSelector(selectNavHeight);
  const { data, isLoading, isError } = useGetUserProfile();
  const dispatch = useDispatch();

  const userData = data && isApiResponse(data) ? data.data : null;

  useEffect(() => {
    dispatch(setShowCategories(false));
  }, []);

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
        style={{ marginTop: `${modal ? 0 : navHeight}px` }}
        className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex justify-center items-center p-12"
      >
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium text-lg">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !userData) {
    return (
      <div
        style={{ marginTop: `${modal ? 0 : navHeight}px` }}
        className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-12 text-center"
      >
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Unable to Load Profile
        </h3>
        <p className="text-gray-600 mb-4">
          We couldn't load your profile data. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      style={{ marginTop: `${modal ? 0 : navHeight}px` }}
      className="min-h-screen h-max bg-linear-to-br from-gray-50 via-white to-gray-50 p-4"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="text-black p-6 mb-4 bg-white border-2 border-gray-200 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shrink-0">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">My Profile</h1>
              <p className="text-gray-500">Manage your account information</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Avatar Section */}
              <div className="flex flex-col items-center lg:w-80">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-56 h-56 rounded-2xl bg-linear-to-br from-gray-100 to-gray-300 flex items-center justify-center overflow-hidden shadow-lg">
                    <User size={80} className="text-gray-400" />
                  </div>
                  <button className="absolute bottom-3 right-3 bg-linear-to-r from-gray-500 to-gray-800 text-white rounded-xl p-3 shadow-lg hover:from-gray-700 hover:to-gray-900 transition-all group-hover:scale-110">
                    <Camera size={20} />
                  </button>
                </div>

                {/* Upload Buttons */}
                <div className="w-full mt-6 space-y-3">
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 hover:border-teal-400 hover:bg-teal-50 transition-all group">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 group-hover:bg-teal-100 rounded-lg flex items-center justify-center transition-colors">
                        <Upload
                          size={20}
                          className="text-gray-400 group-hover:text-teal-600"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 group-hover:text-teal-600">
                        Upload Logo
                      </span>
                    </div>
                  </button>

                  {displayTag && (
                    <button className="w-full border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 hover:border-orange-400 hover:bg-orange-50 transition-all group">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-gray-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center transition-colors">
                          <FileText
                            size={20}
                            className="text-gray-400 group-hover:text-orange-600"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-orange-600">
                          Upload Vendor Docs
                        </span>
                      </div>
                    </button>
                  )}
                </div>

                {/* Role Badge Card */}
                {displayTag && (
                  <div
                    className={`w-full mt-6 rounded-xl p-4 ${
                      displayTag === "admin"
                        ? "bg-linear-to-br from-gray-900 to-black"
                        : "bg-linear-to-br from-amber-400 to-orange-500"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-white">
                      {displayTag === "admin" ? (
                        <Shield size={24} />
                      ) : (
                        <Store size={24} />
                      )}
                      <div>
                        <p className="text-xs font-medium opacity-90">
                          Account Type
                        </p>
                        <p className="text-lg font-bold uppercase">
                          {displayTag}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Profile Information */}
              <div className="flex-1 space-y-6">
                {/* Name Section */}
                <div className="bg-linear-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-100">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {userData.first_name} {userData.last_name}
                    </h2>
                    {displayTag === "seller" && (
                      <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm">
                        <Award size={16} className="text-amber-600" />
                        <span className="text-xs font-semibold text-gray-700">
                          Verified Seller
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Member since{" "}
                    {new Date(userData.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Mail size={20} className="text-teal-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                        <Mail size={18} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          Email Address
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {userData.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center shrink-0">
                        <Phone size={18} className="text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          Phone Number
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {userData.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          Address
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          285 N Broad St, Elizabeth, NJ 07208, USA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio & Additional Info */}
                {(sellerProfile?.bio || userData.created_at) && (
                  <div className="pt-6 border-t-2 border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText size={20} className="text-orange-600" />
                      Additional Information
                    </h3>
                    <div className="space-y-4">
                      {sellerProfile?.bio && (
                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            Bio
                          </p>
                          <p className="text-sm text-gray-700">
                            {sellerProfile.bio}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <Calendar size={18} className="text-gray-600" />
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Member Since
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(userData.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Edit Profile Button */}
                <div className="pt-6">
                  <button className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 flex items-center justify-center gap-3 group">
                    <Edit3
                      size={20}
                      className="group-hover:rotate-12 transition-transform"
                    />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tip */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 Keep your profile information up to date for better account
            security
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
