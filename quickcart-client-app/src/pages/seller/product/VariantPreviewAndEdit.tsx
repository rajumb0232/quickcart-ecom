import type React from "react"
import type { Variant } from "../../../types/productTypes"
import { Box, ChevronLeft, ChevronRight, Edit3, ImageIcon, IndianRupee, Layers, TrendingUp } from "lucide-react";
import { useState } from "react";

export interface VariantPreviewProps {
    product_id: string;
    variants: Variant[];
}


const VariantPreviewAndEditPage: React.FC<VariantPreviewProps> = ({
    variants, product_id
}: VariantPreviewProps) => {
      const [currentVariantIndex, setCurrentVariantIndex] = useState(0);

  const handleAddVariant = () => {
    window.location.href = `/add-variant/${product_id}`;
  };

  const handleEditVariant = (variantId: string) => {
    window.location.href = `/edit-variant/${variantId}`;
  };

  const handlePrevVariant = () => {
    setCurrentVariantIndex((prev) =>
      prev > 0 ? prev - 1 : variants.length - 1
    );
  };

  const handleNextVariant = () => {
    setCurrentVariantIndex((prev) =>
      prev < variants.length - 1 ? prev + 1 : 0
    );
  };

    return (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Layers size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Product Variants
                </h3>
              </div>
              {variants.length > 0 && (
                <button
                  onClick={() =>
                    handleEditVariant(
                      variants[currentVariantIndex].variant_id
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 hover:bg-teal-50 rounded-lg transition-colors group"
                >
                  <Edit3
                    size={18}
                    className="text-gray-600 group-hover:text-teal-600 transition-colors"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-teal-600">
                    Edit Variant
                  </span>
                </button>
              )}
            </div>

            {/* Variant Carousel */}
            {variants.length > 0 ? (
              <div className="relative">
                <div className="flex items-center gap-6">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevVariant}
                    className="shrink-0 w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={variants.length <= 1}
                  >
                    <ChevronLeft
                      size={24}
                      className="text-gray-600 group-hover:text-gray-900"
                    />
                  </button>

                  {/* Variant Cards */}
                  <div className="flex-1 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {variants
                        .slice(currentVariantIndex, currentVariantIndex + 3)
                        .map((variant, idx) => (
                          <div
                            key={variant.variant_id}
                            className={`bg-linear-to-br from-gray-50 to-white rounded-xl border-2 overflow-hidden transition-all ${
                              idx === 0
                                ? "border-teal-300 shadow-lg"
                                : "border-gray-200"
                            }`}
                          >
                            {/* Image */}
                            <div className="h-64 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                              {variant.image_uris.length > 0 ? (
                                <img
                                  src={variant.image_uris[0]}
                                  alt={variant.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageIcon
                                  size={48}
                                  className="text-gray-400"
                                />
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              <h4 className="font-bold text-gray-900 mb-2">
                                {variant.title}
                              </h4>

                              {/* Price & Quantity */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <IndianRupee
                                    size={16}
                                    className="text-green-600"
                                  />
                                  <span className="text-lg font-bold text-gray-900">
                                    ${variant.price.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-lg">
                                  <TrendingUp
                                    size={14}
                                    className="text-blue-600"
                                  />
                                  <span className="text-xs font-semibold text-blue-700">
                                    Stock: {variant.quantity}
                                  </span>
                                </div>
                              </div>

                              {/* Attributes */}
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(variant.attributes).map(
                                  ([key, value]) => (
                                    <span
                                      key={key}
                                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                                    >
                                      {key}: {value}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextVariant}
                    className="shrink-0 w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={variants.length <= 1}
                  >
                    <ChevronRight
                      size={24}
                      className="text-gray-600 group-hover:text-gray-900"
                    />
                  </button>
                </div>

                {/* Carousel Indicators */}
                {variants.length > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {variants.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentVariantIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentVariantIndex
                            ? "w-8 bg-teal-600"
                            : "w-2 bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Box size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  No variants found for this product
                </p>
                <button
                  onClick={handleAddVariant}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Add Your First Variant
                </button>
              </div>
            )}
          </div>
        </div>
    )
}

export default VariantPreviewAndEditPage;