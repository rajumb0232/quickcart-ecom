import React, { useState } from "react";
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
} from "lucide-react";
import type { Product } from "../../../types/productTypes";
import { useDispatch, useSelector } from "react-redux";
import { selectNavHeight } from "../../../features/util/screenSelector";
import { setShowCategories } from "../../../features/util/screenSlice";
import VariantPreviewAndEditPage from "./VariantPreviewAndEdit";

// Component
const ProductPreviewAndEditPage: React.FC = () => {
  // For now, using mock data structure
  const dispatch = useDispatch();
  const navHeight = useSelector(selectNavHeight);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product data on mount
  React.useEffect(() => {
    dispatch(setShowCategories(false));
    setProduct({
      product_id: "prod_123",
      title: "Premium Cotton T-Shirt",
      description:
        "High-quality cotton t-shirt perfect for everyday wear. Breathable, comfortable, and stylish.",
      brand: "StyleCraft",
      category_path: "Mens/Clothing/Shirts",
      avg_rating: 4.5,
      rating_count: 128,
      created_date: "2024-01-15T10:30:00Z",
      last_modified_date: "2024-11-05T14:20:00Z",
      is_active: true,
      is_deleted: false,
      variants: [
        {
          variant_id: "var_001",
          title: "Blue - Medium",
          price: 29.99,
          quantity: 45,
          description: "Blue color, Medium size",
          created_date: "2024-01-15T10:30:00Z",
          last_modified_date: "2024-11-05T14:20:00Z",
          attributes: { color: "Blue", size: "M", fit: "Regular" },
          image_uris: [],
          is_active: true,
          is_deleted: false,
        },
        {
          variant_id: "var_002",
          title: "Red - Large",
          price: 29.99,
          quantity: 32,
          description: "Red color, Large size",
          created_date: "2024-01-15T10:30:00Z",
          last_modified_date: "2024-11-05T14:20:00Z",
          attributes: { color: "Red", size: "L", fit: "Regular" },
          image_uris: [],
          is_active: true,
          is_deleted: false,
        },
      ],
    });
    setLoading(false);
  }, []);

  if (loading || !product) {
    return (
      <div
        style={{ marginTop: `${navHeight - 40}px` }}
        className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center"
      >
        <div className="text-center">
          <Package
            size={48}
            className="text-teal-600 animate-pulse mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

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
                  <h1 className="text-3xl font-bold mb-1">Product Overview</h1>
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
};

export default ProductPreviewAndEditPage;
