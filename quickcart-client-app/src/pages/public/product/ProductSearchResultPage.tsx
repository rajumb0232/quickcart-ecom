import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectNavHeight } from "../../../features/util/screenSelector";
import { SideBar } from "./SideBar";
import { useSearchProduct } from "../../../hooks/useProducts";
import { isApiResponse } from "../../../types/apiResponseType";
import { setShowCategories } from "../../../features/util/screenSlice";
import { flattenProductsAndVariants, type ProductCard } from "../../../types/productTypes";
import {
  Search,
  ShoppingBag,
  Star,
  Loader2,
  AlertCircle,
  Package,
  TrendingUp,
  MapPin,
} from "lucide-react";

const ProductSearchResultPage: React.FC = () => {
  const location = useLocation();
  const navHeight = useSelector(selectNavHeight);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setShowCategories(false));
  });

  const { data, isLoading, isError } = useSearchProduct(location.search);
  const products = data && isApiResponse(data) ? data.data : [];

  // Flatten variants and attach productId
  const variants: ProductCard[] = React.useMemo(() => {
    return  flattenProductsAndVariants(products)
  }, [products]);

  if (isLoading) {
    return (
      <div style={{ marginTop: `${navHeight - 36}px` }}>
        <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
          <SideBar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-16 h-16 animate-spin text-gray-700 mx-auto mb-4" />
              <p className="text-gray-600 font-medium text-lg">
                Searching for products...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                This won't take long
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ marginTop: `${navHeight - 36}px` }}>
        <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
          <SideBar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn't load the products. Please try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: `${navHeight - 40}px` }}>
      <div className="flex min-h-screen bg-linear-to-br from-gray-50 to-gray-100 font-sans">
        <SideBar />

        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-gray-500 to-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                  <Search size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Search Results
                  </h1>
                  <p className="text-sm text-gray-600">
                    {variants.length} product{variants.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
                <TrendingUp size={16} />
                <span className="font-medium">Showing best matches</span>
              </div>
            </div>
          </div>

          {variants.length === 0 ? (
            <div className="flex flex-col items-center justify-start py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                We couldn't find any products matching your search. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => navigate("/search")}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                Browse All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {variants.map((variant) => (
                <article
                  key={variant.variant_id}
                  className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
                  onClick={() => {
                    if (variant.product_id) {
                      window.open(`/product/${variant.product_id}`, "_blank");
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      if (variant.product_id)
                        navigate(`/product/${variant.product_id}`);
                    }
                  }}
                >
                  {/* Image Section */}
                  <div className="relative h-64 w-full bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                    {variant.image_uris?.length && variant.image_uris[0] ? (
                      <img
                        src={variant.image_uris[0]}
                        alt={variant.title}
                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Package size={48} className="mb-2" />
                        <span className="text-sm">No image</span>
                      </div>
                    )}
                    
                    {/* Stock Badge */}
                    {variant.quantity > 0 ? (
                      <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        In Stock
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Shipping Info */}
                    <div className="flex items-center gap-1 text-xs text-green-600 mb-2 bg-green-50 px-2 py-1 rounded-lg w-fit">
                      <MapPin size={12} />
                      <span className="font-medium">Ships to your location</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {variant.title}
                    </h3>

                    <div className="mt-auto space-y-3">
                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{(variant.price ?? 0).toFixed(2)}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                          <Star size={14} fill="#EAB308" className="text-yellow-500 mr-1" />
                          <span className="text-sm font-bold text-gray-900">
                            {variant.avg_rating?.toFixed(1) || "0.0"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({variant.rating_count || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductSearchResultPage;