import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectNavHeight } from "../../../features/util/screenSelector";
import { setShowCategories } from "../../../features/util/screenSlice";
import type { StoreRequest } from "../../../types/storeTypes";
import { isApiResponse } from "../../../types/apiResponseType";
import {
  useCreateStore,
  useEditStore,
  useGetStoreById,
} from "../../../hooks/useStore";
import { toast } from "react-toastify";
import {
  Store as StoreIcon,
  MapPin,
  Phone,
  Mail,
  FileText,
  ArrowLeft,
  Save,
  Loader2,
} from "lucide-react";

const StoreForm: React.FC = () => {
  const navHeight = useSelector(selectNavHeight);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setShowCategories(false));
  }, [dispatch]);

  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId?: string }>();
  const shouldFetchStore = !!storeId && storeId.trim() !== "";

  const { data, isLoading, isError } = shouldFetchStore
    ? useGetStoreById(storeId!)
    : { data: undefined, isLoading: false, isError: false };

  const storeData = data && isApiResponse(data) ? data.data : null;

  const editStoreMutation = useEditStore(storeId);
  const createStoreMutation = useCreateStore();

  const [formData, setFormData] = useState<StoreRequest>({
    name: "",
    location: "",
    contact_number: "",
    email: "",
    about: "",
  });

  useEffect(() => {
    if (storeData) {
      setFormData({
        name: storeData.name,
        location: storeData.location,
        contact_number: storeData.contact_number,
        email: storeData.email,
        about: storeData.about,
      });
    }
  }, [storeData]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.location ||
      !formData.contact_number ||
      !formData.email ||
      !formData.about
    ) {
      toast.error("Please fill all the fields.");
      return;
    }

    if (shouldFetchStore) {
      editStoreMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Store Updated Successfully!!");
          navigate(-1);
        },
        onError: (error) => {
          toast.error("Failed to update: " + (error as Error).message);
        },
      });
    } else {
      createStoreMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Store Created Successfully!!");
          navigate(-1);
        },
        onError: (error) => {
          toast.error("Failed to create: " + (error as Error).message);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div
        style={{ marginTop: `${navHeight + 36}px` }}
        className="bg-gray-50 flex items-center justify-center"
      >
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading store data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{ marginTop: `${navHeight + 36}px` }}
        className="min-h-screen bg-gray-50 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <StoreIcon className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-medium">Failed to load store data.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const isSubmitting = shouldFetchStore
    ? editStoreMutation.isPending
    : createStoreMutation.isPending;

  return (
    <div
      style={{ marginTop: `${navHeight - 40}px` }}
      className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back to Stores</span>
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 bg-linear-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <StoreIcon size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {shouldFetchStore ? "Update Store" : "Create New Store"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {shouldFetchStore
                    ? "Modify your store details below"
                    : "Fill in the details to set up your new store"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <StoreIcon size={20} className="text-teal-600" />
              Store Information
            </h2>

            <div className="space-y-6">
              {/* Store Name */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <StoreIcon size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none"
                    placeholder="Enter store name"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={onChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none"
                    placeholder="Enter store location"
                  />
                </div>
              </div>

              {/* Contact Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Number */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={onChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none"
                      placeholder="example@domain.com"
                    />
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  About <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-4 pointer-events-none">
                    <FileText size={18} className="text-gray-400" />
                  </div>
                  <textarea
                    name="about"
                    rows={5}
                    value={formData.about}
                    onChange={onChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none resize-none"
                    placeholder="Tell us about your store..."
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Describe your store, its products, and what makes it unique.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-linear-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-teal-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {shouldFetchStore ? "Update Store" : "Create Store"}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            All fields marked with <span className="text-red-500">*</span> are
            required
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoreForm;
