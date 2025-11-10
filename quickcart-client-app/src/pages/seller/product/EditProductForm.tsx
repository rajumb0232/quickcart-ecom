import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

import { setShowCategories } from "../../../features/util/screenSlice";
import { isApiResponse } from "../../../types/apiResponseType";

import { useUpdateProduct } from "../../../hooks/useProducts";
import { useGetProductIgnoreStatus } from "../../../hooks/useProducts"; // make sure this exists in your hooks index
import type { Product, productEditRequest } from "../../../types/productTypes";
import { selectNavHeight } from "../../../features/util/screenSelector";
import BrandFilter from "../../public/product/BrandFilter";

export interface EditProductProps {
  exProduct?: Product; // optional: if caller provides product already
}

const MIN_TITLE = 3;
const MAX_TITLE = 100;
const MAX_DESC = 5000;

const EditProductForm: React.FC<EditProductProps> = ({
  exProduct,
}: EditProductProps) => {
  const navHeight = useSelector(selectNavHeight);
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // hide categories while editing
  useEffect(() => {
    dispatch(setShowCategories(false));
  }, [dispatch]);

  // If exProduct is not provided, fetch using ignore-status hook
  const shouldFetch = !exProduct && !!id;
  const {
    data: fetchedData,
    isLoading: isFetching,
    isError: isFetchError,
  } = shouldFetch ? useGetProductIgnoreStatus(id) : {};

  const productFromApi =
    fetchedData && isApiResponse(fetchedData) ? fetchedData.data : null;
  const product = exProduct ?? productFromApi ?? null;

  // form state
  const [title, setTitle] = useState<string>(product?.title ?? "");
  const [brand, setBrand] = useState<string>(product?.brand ?? "");
  const [description, setDescription] = useState<string>(
    product?.description ?? ""
  );
  const [submitting, setSubmitting] = useState(false);

  // ensure form is populated when product becomes available (exProduct OR fetched)
  useEffect(() => {
    if (product) {
      setTitle(product.title ?? "");
      setBrand(product.brand ?? "");
      setDescription(product.description ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.product_id]);

  const updateProduct = useUpdateProduct();

  const titleValid =
    title.trim().length >= MIN_TITLE && title.trim().length <= MAX_TITLE;
  const descValid = description.length <= MAX_DESC;
  const canSubmit = titleValid && descValid && !!id && !submitting;

  const handleCancel = () => {
    if (id) navigate(`/product/${id}`);
    else navigate(-1);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) {
      toast.error("Fix validation errors before saving.");
      return;
    }

    const body: productEditRequest = {
      title: title.trim(),
      brand: brand.trim(),
      description: description.trim(),
    };

    try {
      if (product) {
        setSubmitting(true);
        await updateProduct.mutateAsync({
          productId: product.product_id,
          body: body,
        });

        toast.success("Product updated successfully.");
        if (id) navigate(`/product/${id}`);
      }
    } catch (err: any) {
      console.error("Update failed", err);
      toast.error(err?.message ?? "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading / error UI
  if (isFetching) {
    return (
      <div
        style={{ marginTop: `${navHeight - 42}px` }}
        className="min-h-[60vh] flex items-center justify-center"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <Sparkles className="text-amber-600" />
          </div>
          <div className="text-gray-700 font-medium">Loading product...</div>
        </div>
      </div>
    );
  }

  if (isFetchError && !exProduct) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        style={{ marginTop: `${navHeight - 42}px` }}
      >
        <div className="text-center max-w-md bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Could not load product</h3>
          <p className="text-gray-600 mb-4">
            Try reloading or check the product ID.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-400 text-white rounded-md"
            >
              Retry
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded-md"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If product isn't available yet (no exProduct and no fetched product), show message
  if (!product) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        style={{ marginTop: `${navHeight - 42}px` }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <Sparkles className="text-amber-600" />
          </div>
          <div className="text-gray-700">Preparing editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ marginTop: `${navHeight - 42}px` }}
      className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100"
    >
      <div className="max-w-4xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-sm text-gray-500 mt-1">
              Update the primary product information shown to customers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-md border border-gray-200 text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                canSubmit
                  ? "bg-amber-500 text-white hover:bg-orange-500"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Save
              <ArrowRight size={16} className="inline-block ml-2" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-6"
        >
          {/* Title */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={MAX_TITLE}
              className={`w-full px-4 py-3 rounded-xl border-2 transition focus:outline-none ${
                titleValid
                  ? "border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  : "border-amber-200 bg-amber-50"
              }`}
              placeholder="e.g., Premium Cotton T-Shirt - Slim Fit"
              aria-invalid={!titleValid}
              aria-describedby="title-help"
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <div
                id="title-help"
                className={`${titleValid ? "text-gray-500" : "text-amber-700"}`}
              >
                {title.trim().length === 0
                  ? "Enter a descriptive product title."
                  : titleValid
                  ? "Title looks good."
                  : `Title must be at least ${MIN_TITLE} characters.`}
              </div>
              <div
                className={`font-medium ${
                  titleValid ? "text-gray-500" : "text-amber-700"
                }`}
              >
                {title.length}/{MAX_TITLE}
              </div>
            </div>
          </div>

          {/* Brand */}
          <BrandFilter onSelect={(b) => setBrand(b)} selectedBrand={product?.brand} />

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={8}
              className={`w-full px-4 py-3 rounded-xl border-2 transition focus:outline-none ${
                descValid
                  ? "border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  : "border-red-200 bg-red-50"
              }`}
              placeholder="Enter detailed product description"
              maxLength={MAX_DESC}
              aria-describedby="desc-help desc-count"
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <div
                id="desc-help"
                className={`${descValid ? "text-gray-500" : "text-red-600"}`}
              >
                {descValid
                  ? "Describe features, materials and sizing."
                  : `Description too long (max ${MAX_DESC} chars).`}
              </div>
              <div
                id="desc-count"
                className={`${descValid ? "text-gray-500" : "text-red-600"}`}
              >
                {description.length}/{MAX_DESC}
              </div>
            </div>
          </div>

          {/* tips */}
          <div className="mb-6 bg-amber-50 rounded-xl border-2 border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <Sparkles size={16} className="text-amber-600 mt-1" />
              <div className="text-sm text-gray-700">
                <div className="font-semibold">
                  Tips for an effective product listing
                </div>
                <ul className="mt-2 text-xs text-gray-700 list-disc list-inside space-y-1">
                  <li>Use clear, searchable keywords in the title.</li>
                  <li>
                    Highlight material, fit and main benefits in the first 1–2
                    lines of description.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Save bar */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-sm text-gray-500">
              Last modified:{" "}
              <span className="font-medium text-gray-700">
                {product?.last_modified_date
                  ? new Date(product.last_modified_date).toLocaleString()
                  : "—"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-md border border-gray-200 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                  canSubmit
                    ? "bg-amber-500 text-white hover:bg-orange-500"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {submitting ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
