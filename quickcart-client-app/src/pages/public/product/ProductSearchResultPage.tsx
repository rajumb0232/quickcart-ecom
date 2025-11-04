import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectNavHeight } from "../../../features/util/screenSelector";
import { SideBar } from "./SideBar";
import { useSearchProduct } from "../../../hooks/useProducts";
import { isApiResponse } from "../../../types/apiResponseType";

interface Result {
  variant_id: string;
  title: string;
  price: number;
  quantity: number;
  description: string;
  created_date: string;
  last_modified_date: string;
  avg_rating: number;
  rating_count: number;
  attributes: {
    fit: string;
    size: string;
    type: string;
    color: string;
    "Care Instruction": string;
  };
  is_active: boolean;
  is_deleted: boolean;
}

const ProductSearchResultPage: React.FC = () => {
  const location = useLocation();
  const navHeight = useSelector(selectNavHeight);
  // const dispatch = useDispatch<AppDispatch>();

  // fetch products
  const {data, isLoading, isError} = useSearchProduct(location.search);
  const products = data && isApiResponse(data) ? data.data : [];

  // Transform products to variants with combined titles like before
  const variants: Result[] = [];
  products.forEach((product) => {
    product.variants.forEach((v) => {
      variants.push({
        ...v,
        title: product.title + " - " + v.title,
        avg_rating: product.avg_rating,
        rating_count: product.rating_count,
      });
    });
  });

  if (isLoading) return <div className="px-4 py-2">Loading categories...</div>;
  if (isError) return <div className="px-4 py-2 text-red-500">Failed to load categories</div>;

  return (
    <div style={{ marginTop: `${navHeight}px` }}>
      <div className="flex min-h-screen bg-gray-50 font-sans">
        <SideBar />

        <main className="flex-1 p-4">
          {variants.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {variants.map((variant) => (
                <div
                  className="bg-gray-100 rounded-lg shadow-sm hover:shadow-lg transition duration-150 border border-gray-100 flex flex-col"
                  key={variant.variant_id}
                >
                  <div className="h-50 w-full bg-gray-100 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-400">Image</span>
                  </div>

                  <div className="p-3">
                    <span className="text-xs text-gray-400 mb-1">
                      Ships to Your Location
                    </span>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      {variant.title}
                    </h3>

                    <div className="mt-auto">
                      <p className="font-bold text-lg text-gray-900 mb-1">
                        ₹{variant.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.round(variant.avg_rating) ? (
                              <span className="text-yellow-500">★</span>
                            ) : (
                              <span className="text-gray-300">★</span>
                            )}
                          </span>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          {variant.rating_count} reviews
                        </span>
                      </div>
                      <div className="flex flex-wrap text-xs text-gray-600 gap-x-4">
                        <span>Size: {variant.attributes.size}</span>
                        <span>Color: {variant.attributes.color}</span>
                        <span>Fit: {variant.attributes.fit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductSearchResultPage;
