import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../components/form/Input";
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

  // Use storeId directly for editing, it's safer.
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
      alert("Please fill all the fields.");
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
          alert("Failed to create: " + (error as Error).message);
        },
      });
    }
  };

  if (isLoading) return <p>Loading store data...</p>;
  if (isError) return <p>Failed to load store data.</p>;

  const isSubmitting = shouldFetchStore
    ? editStoreMutation.isPending
    : createStoreMutation.isPending;

  return (
    <div
      style={{
        marginTop: `${navHeight - 36}px`,
        width: "70%",
        maxWidth: "100%",
        marginLeft: "auto",
        marginRight: "auto",
      }}
      className="p-6 bg-white"
    >
      <h2 className="text-2xl font-semibold mb-4">
        {shouldFetchStore ? "Update Store" : "Create New Store"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Store Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={onChange}
          required
        />
        <Input
          label="Location"
          name="location"
          type="text"
          value={formData.location}
          onChange={onChange}
          required
        />
        <Input
          label="Contact Number"
          name="contact_number"
          type="tel"
          value={formData.contact_number}
          onChange={onChange}
          placeholder="e.g. +1 234 567 890"
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          placeholder="example@domain.com"
          required
        />

        {/* Textarea for About */}
        <div>
          <label
            htmlFor="about"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            About
          </label>
          <textarea
            id="about"
            name="about"
            rows={5}
            value={formData.about}
            onChange={onChange}
            required
            className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:border-black focus:ring-black"
          />
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
            style={{ maxWidth: "max-content" }}
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white py-2 px-4 rounded disabled:opacity-50"
            style={{ maxWidth: "max-content" }}
          >
            {isSubmitting
              ? "Submitting..."
              : shouldFetchStore
              ? "Update Store"
              : "Create Store"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreForm;
