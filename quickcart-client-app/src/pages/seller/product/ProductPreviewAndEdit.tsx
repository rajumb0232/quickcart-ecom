import React from "react";
import {
  ArrowLeft,
  Edit3,
  Plus,
  ChevronRight,
  Package,
  Tag,
  Calendar,
  Star,
  Box,
  AlertCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectNavHeight } from "../../../features/util/screenSelector";
import { setShowCategories } from "../../../features/util/screenSlice";
import VariantPreviewAndEditPage from "./VariantPreviewAndEdit";
import { useParams } from "react-router-dom";
import { useGetProductIgnoreStatus } from "../../../hooks/useProducts";
import { isApiResponse } from "../../../types/apiResponseType";

// Component
const ProductPreviewAndEditPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const { id: product_id } = params;

  const { data, isError, isLoading } = useGetProductIgnoreStatus(product_id);
  const product = data && isApiResponse(data) ? data.data : null;

  // For now, using mock data structure
  const dispatch = useDispatch();
  const navHeight = useSelector(selectNavHeight);

  // Fetch product data on mount
  React.useEffect(() => {
    dispatch(setShowCategories(false));
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full bg-linear-to-br from-gray-50 to-gray-100">
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-gray-700 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-lg">
              Loading…
            </p>
            <p className="text-gray-400 text-sm mt-2">
              We are fetching your product from store, hang tight!
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex h-full bg-linear-to-br from-gray-50 to-gray-100">
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-lg text-center p-8 flex flex-col justify-center items-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Could not load product
            </h3>
            <p className="text-gray-600 mb-4">
              There was a problem fetching your product. Try reloading.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 flex bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <RotateCcw />
              <span className="ml-2">Retry</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!isLoading && !isError && product) {

    const handleBack = () => {
      window.location.href = "/seller/manage-product";
    };

    const handleEditProduct = () => {
      window.location.href = `/edit-product/${product.product_id}`;
    };

    const handleAddVariant = () => {
      window.location.href = `/add-variant/${product.product_id}`;
    };

    const categories = product.category_path.split("/");

    return (
      <div
        style={{ marginTop: `${navHeight - 42}px` }}
        className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-8 md:px-16"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="font-medium">Back</span>
            </button>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-linear-to-br from-amber-400 to-orange-500 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Package size={32} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-1">
                      Product Overview
                    </h1>
                    <p className="text-gray-500">
                      View and manage your product details
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Product Card */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden mb-6">
            <div className="p-8">
              {/* Product Header with Edit Button */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {product.title}
                    </h2>
                    <button
                      onClick={handleEditProduct}
                      className="p-2 hover:bg-teal-50 rounded-lg transition-colors group"
                      title="Edit Product"
                    >
                      <Edit3
                        size={20}
                        className="text-gray-600 group-hover:text-teal-600 transition-colors"
                      />
                    </button>
                  </div>

                  {/* Category Path */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {categories.map((cat, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium">
                          {cat}
                        </span>
                        {idx < categories.length - 1 && (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    product.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.is_active ? "Published" : "Unpublished"}
                </div>
              </div>

              {/* Product Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-linear-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Tag size={20} className="text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        Brand
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {product.brand}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-linear-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Box size={20} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        Variants
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {product.variants.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-linear-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Star size={20} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        Rating
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {product.avg_rating.toFixed(1)} ({product.rating_count})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Calendar size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase">
                        Created
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(product.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-6 text-xs text-gray-500 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    Last Modified:{" "}
                    {new Date(product.last_modified_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Package size={14} />
                  <span>ID: {product.product_id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add Variant Button */}
          <button
            onClick={handleAddVariant}
            className="w-full mb-6 bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-3 group"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform"
            />
            <span>Add New Variant</span>
          </button>

          {/* Variants Section */}
          <VariantPreviewAndEditPage
            variants={product.variants}
            product_id={product.product_id}
          />

          {/* Bottom Tip */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              💡 Tip: Keep your product information up to date for better
              visibility
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default ProductPreviewAndEditPage;
