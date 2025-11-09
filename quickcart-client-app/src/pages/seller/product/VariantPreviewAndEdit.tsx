import React, { useMemo, useState } from "react";
import type { Variant } from "../../../types/productTypes";
import {
  Box,
  ChevronLeft,
  ChevronRight,
  Edit3,
  ImageIcon,
  IndianRupee,
  Layers,
  TrendingUp,
} from "lucide-react";
import { API_BASE } from "../../../api/apiClient";
import { useAddVariant } from "../../../hooks/useProducts";
import { isApiResponse } from "../../../types/apiResponseType";
import { toast } from "react-toastify";

export interface VariantPreviewProps {
  product_id: string;
  variants: Variant[];
}

const safeUrl = (uri: string) => {
  if (!uri) return uri;
  // If uri already looks absolute, return as-is, else prefix with API_BASE
  if (uri.startsWith("http://") || uri.startsWith("https://")) return uri;
  // Ensure slash handling
  if (API_BASE.endsWith("/") && uri.startsWith("/"))
    return `${API_BASE}${uri.slice(1)}`;
  if (!API_BASE.endsWith("/") && !uri.startsWith("/"))
    return `${API_BASE}/${uri}`;
  return `${API_BASE}${uri}`;
};

const VariantPreviewAndEditPage: React.FC<VariantPreviewProps> = ({
  variants,
  product_id,
}) => {
  const [currentVariantIndex, setCurrentVariantIndex] = useState<number>(0);
  const addVariantMutation = useAddVariant();

  const variantCount = variants.length;
  const currentVariant = variants[currentVariantIndex];

  const allThumbnails = useMemo(
    () =>
      variants.map((v) =>
        v.image_uris && v.image_uris.length > 0
          ? safeUrl(v.image_uris[0])
          : null
      ),
    [variants]
  );

  const handleAddVariant = async () => {
    console.log("Adding variant for product: ", product_id);
    if (product_id) {
      try {
        const data = await addVariantMutation.mutateAsync({
          productId: product_id,
          body: {
            title: "",
            description: "",
            price: 0,
            quantity: 0,
            attributes: {},
          },
        });
        if (isApiResponse(data)) {
          const variant = data.data;
          window.open(`/variant/build/${variant.variant_id}`, "_blank");
        } else throw Error("Failed to create variant.");
      } catch (error) {
        console.error("Failed to create Variant, ", error);
        toast.error("Failed to initiate building variant");
      }
    }
  };

  const handleEditVariant = (variantId: string | null) => {
    window.open(`/variant/build/${variantId}`, "_blank");
  };

  const handlePrevVariant = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentVariantIndex((prev) => (prev > 0 ? prev - 1 : variantCount - 1));
  };

  const handleNextVariant = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentVariantIndex((prev) => (prev < variantCount - 1 ? prev + 1 : 0));
  };

  if (!variants || variants.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4">
            <Box className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No variants yet
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This product currently has no variants. Add your first variant to
            get started.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleAddVariant}
              className="px-5 py-2 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
            >
              Add Variant
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
      <div className="p-8 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <Layers size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Product Variants
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Preview and quick-edit individual variants for this product.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleEditVariant(currentVariant.variant_id)}
              className="px-4 py-2 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-2"
              title="Edit current variant"
            >
              <Edit3 size={16} className="text-gray-700" />
              <span className="text-sm font-medium text-gray-700">
                Edit Variant
              </span>
            </button>

            <button
              onClick={handleAddVariant}
              className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition"
            >
              Add Variant
            </button>
          </div>
        </div>

        {/* Main area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Images grid + prev/next controls */}
          <div className="col-span-2 relative rounded-xl overflow-hidden border-2 border-gray-100 bg-linear-to-br from-gray-50 to-white">
            {/* Top-right prev/next buttons */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={handlePrevVariant}
                disabled={variantCount <= 1}
                className="w-10 h-10 rounded-md bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                aria-label="Previous variant"
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <button
                onClick={handleNextVariant}
                disabled={variantCount <= 1}
                className="w-10 h-10 rounded-md bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                aria-label="Next variant"
              >
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>

            {/* All images for current variant: grid layout */}
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentVariant.image_uris &&
                currentVariant.image_uris.length > 0 ? (
                  currentVariant.image_uris.map((uri, i) => {
                    const src = safeUrl(uri);
                    return (
                      <div
                        key={i}
                        className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50"
                      >
                        <button
                          onClick={() => window.open(src, "_blank")}
                          className="w-full h-44 md:h-56 flex items-center justify-center overflow-hidden"
                          aria-label={`Open image ${i + 1}`}
                        >
                          <img
                            src={src}
                            alt={`${currentVariant.title}-img-${i}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <ImageIcon
                      size={48}
                      className="text-gray-300 mx-auto mb-4"
                    />
                    <div className="text-gray-600">
                      No images uploaded for this variant
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails strip for switching variants */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allThumbnails.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentVariantIndex(idx)}
                    className={`rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
                      idx === currentVariantIndex
                        ? "border-teal-400 shadow-lg"
                        : "border-gray-100"
                    } shrink-0`}
                    aria-label={`Show variant ${idx + 1}`}
                    title={`Variant ${idx + 1}`}
                  >
                    <div className="w-24 h-24 bg-gray-50 flex items-center justify-center">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={`variant-${idx}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={24} className="text-gray-300" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Variant details (price, qty, description, attributes, audit) */}
          <aside className="rounded-xl border-2 border-gray-100 p-6 bg-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {currentVariant.title}
                </h4>
                <div className="text-sm text-gray-500 mt-1">
                  {currentVariant.description || "—"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Status</div>
                <div
                  className={`mt-1 inline-block px-3 py-1 rounded-lg text-sm font-semibold ${
                    currentVariant.is_deleted
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : currentVariant.is_active
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {currentVariant.is_deleted
                    ? "Deleted"
                    : currentVariant.is_active
                    ? "Active"
                    : "Unpublished"}
                </div>
              </div>
            </div>

            {/* Price & Quantity Pills */}
            <div className="flex items-center gap-3 mt-6">
              <div className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-semibold text-gray-800 inline-flex items-center gap-2">
                <IndianRupee size={16} className="text-green-600" />
                <span className="text-lg">
                  {currentVariant.price?.toFixed(2)}
                </span>
              </div>

              <div className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-semibold text-gray-800 inline-flex items-center gap-2">
                <TrendingUp size={14} className="text-blue-600" />
                <span className="text-sm">
                  Stock: {currentVariant.quantity}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-gray-700 mb-2">
                Description
              </div>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-b pb-4">
                {currentVariant.description || "—"}
              </div>
            </div>

            {/* Attributes */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-gray-700 mb-3">
                Other Details (attributes)
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-wrap gap-2">
                  {currentVariant.attributes &&
                  Object.keys(currentVariant.attributes).length > 0 ? (
                    Object.entries(currentVariant.attributes).map(([k, v]) => (
                      <div
                        key={k}
                        className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-700"
                      >
                        <span className="font-medium">{k}:</span>{" "}
                        <span className="ml-1">{v}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500">No attributes</div>
                  )}
                </div>
              </div>
            </div>

            {/* Auditing */}
            <div className="mt-6 border-t pt-4 text-sm text-gray-600">
              <div className="mb-2">
                <span className="text-xs text-gray-500">Variant ID:</span>
                <div className="font-medium text-gray-800">
                  {currentVariant.variant_id}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div>
                  <div className="text-xs text-gray-500">Created</div>
                  <div className="text-sm text-gray-700">
                    {new Date(currentVariant.created_date).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Last modified</div>
                  <div className="text-sm text-gray-700">
                    {new Date(
                      currentVariant.last_modified_date
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => handleEditVariant(currentVariant.variant_id)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit Variant
              </button>

              <button
                onClick={() => {
                  setCurrentVariantIndex((prev) =>
                    prev < variantCount - 1 ? prev + 1 : 0
                  );
                }}
                className="px-4 py-2 rounded-lg bg-amber-400 text-white text-sm font-semibold hover:bg-amber-500 transition"
              >
                View Next
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default VariantPreviewAndEditPage;
