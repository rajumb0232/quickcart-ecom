import type React from "react";
import { useState, useEffect } from "react";
import { useGetUserProfile, useUpdateSellerProfile, useUpdateUserProfile } from "../../hooks/useAuth";
import type {
  SellerProfileEditRequest,
  UserProfile,
  UserProfileEditRequest,
  UserRoleProfile,
} from "../../types/auth";
import { isApiResponse } from "../../types/apiResponseType";
import {
  User,
  Mail,
  FileText,
  Save,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectNavHeight } from "../../features/util/screenSelector";
import { setShowCategories } from "../../features/util/screenSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditProfile: React.FC = () => {
  const { data, isError, isLoading } = useGetUserProfile();
  const profile: UserProfile | null =
    data && isApiResponse(data) ? data.data : null;

  const navHeight = useSelector(selectNavHeight);
  const dispatch = useDispatch();

  const updateUserProfileMutation = useUpdateUserProfile();
  const updateSellerProfileMutation = useUpdateSellerProfile();
  
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Determine if user has seller or admin role (needs bio field)
  const hasSellerOrAdminRole = profile?.profiles.some(
    (p) => p.role === "seller" || p.role === "admin"
  );

  // Get seller bio if exists
  const sellerProfile = profile?.profiles.find((p) => p.role === "seller");

  useEffect(() => {
    dispatch(setShowCategories(false));
  }, []);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhoneNumber(profile.phone || "");
      setBio(sellerProfile?.bio || "");
    }
  }, [profile, sellerProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Prepare user profile edit request
      const userProfileRequest: UserProfileEditRequest = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phoneNumber.trim(),
      };

      await updateUserProfileMutation.mutateAsync(userProfileRequest);
      console.log("User Profile Update:", userProfileRequest);

      // If user has seller/admin role, also update bio
      if (hasSellerOrAdminRole) {
        const sellerProfileRequest: SellerProfileEditRequest = {
          bio: bio.trim(),
        };
        await updateSellerProfileMutation.mutateAsync(sellerProfileRequest);
        console.log("Seller Profile Update:", sellerProfileRequest);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
      toast.success("Profile updated successfully.")
      navigate(-1)
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{ marginTop: `${navHeight}px` }}
        className="w-full max-w-3xl mx-auto px-6 py-8"
      >
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 size={48} className="text-orange-500 animate-spin" />
            <p className="text-gray-600 font-medium">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !profile) {
    return (
      <div
        style={{ marginTop: `${navHeight - 60}px` }}
        className="w-full max-w-3xl mx-auto px-6 py-8"
      >
        <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-8">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertCircle size={48} className="text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">
              Failed to Load Profile
            </h2>
            <p className="text-gray-600 text-center">
              We couldn't load your profile information. Please try refreshing
              the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ marginTop: `${navHeight - 60}px` }}
      className="w-full max-w-3xl mx-auto px-6 py-8"
    >
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Profile
            </h1>
            <p className="text-gray-600">Update your personal information</p>
          </div>

          {/* Role Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {profile.profiles.map((roleProfile: UserRoleProfile, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                  roleProfile.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : roleProfile.role === "seller"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {roleProfile.role}
              </span>
            ))}
          </div>

          {/* Email Display (Read-only) */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border-2 border-gray-200">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-500" />
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  Email Address
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {profile.email}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
                  maxLength={50}
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors"
                  maxLength={50}
                  required
                />
              </div>
            </div>


            {/* Bio (Only for Seller/Admin) */}
            {hasSellerOrAdminRole && (
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Bio {sellerProfile && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-4">
                    <FileText size={18} className="text-gray-400" />
                  </div>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:outline-none transition-colors resize-none"
                    rows={4}
                    maxLength={500}
                    required={!!sellerProfile}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {bio.length}/500 characters
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t-2 border-gray-200">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full px-6 py-3 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Account Info */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <p className="text-xs text-gray-500">
              Account created on{" "}
              {new Date(profile.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {profile.updated_at !== profile.created_at && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated on{" "}
                {new Date(profile.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
