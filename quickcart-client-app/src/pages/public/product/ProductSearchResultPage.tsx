import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { selectNavHeight } from "../../../features/util/screenSelector";
import { SideBar } from "./SideBar";
import { useSearchProduct } from "../../../hooks/useProducts";
import { isApiResponse } from "../../../types/apiResponseType";

// keep API base outside the component and not exported from inside it
const RAW_API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/api/v1";
const API_BASE = RAW_API_BASE.replace(/\/$/, "");

interface Result {
  variant_id: string;
  title: string;
  price: number;
  quantity: number;
  description?: string;
  created_date?: string;
  last_modified_date?: string;
  avg_rating: number;
  rating_count: number;
  attributes: {
    fit?: string;
    size?: string;
    type?: string;
    color?: string;
    "Care Instruction"?: string;
  };
  image_uris: string[];
  is_active?: boolean;
  is_deleted?: boolean;
}

const PLACEHOLDER = (
  <div className="flex items-center justify-center h-full w-full text-gray-400">No image</div>
);

const ProductSearchResultPage: React.FC = () => {
  const location = useLocation();
  const navHeight = useSelector(selectNavHeight);

  const { data, isLoading, isError } = useSearchProduct(location.search);
  const products = data && isApiResponse(data) ? data.data : [];

  // Flatten product -> variants and prefix image URIs with API_BASE if needed
  const variants: Result[] = React.useMemo(() => {
    const out: Result[] = [];
    products.forEach((product: any) => {
      (product.variants || []).forEach((v: any) => {
        const imageUris: string[] = Array.isArray(v.image_uris)
          ? v.image_uris.map((u: string) => (u ? (u.startsWith("http") ? u : `${API_BASE}${u}`) : ""))
          : [];

        out.push({
          ...v,
          image_uris: imageUris,
          title: `${product.title || ""} - ${v.title || ""}`,
          avg_rating: product.avg_rating ?? v.avg_rating ?? 0,
          rating_count: product.rating_count ?? v.rating_count ?? 0,
        });
      });
    });
    return out;
  }, [products]);

  if (isLoading) return <div className="px-4 py-2">Loading products...</div>;
  if (isError) return <div className="px-4 py-2 text-red-500">Failed to load products</div>;

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
                <article
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition duration-150 border border-gray-200 flex flex-col overflow-hidden"
                  key={variant.variant_id}
                >
                  <div className="h-56 w-full bg-gray-100 rounded-t-lg flex items-center justify-center overflow-hidden">
                    {variant.image_uris && variant.image_uris.length > 0 && variant.image_uris[0] ? (
                      <img
                        src={variant.image_uris[0]}
                        alt={variant.title}
                        className="object-contain h-full w-full"
                        onError={(e) => {
                          // fallback to placeholder on error
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      PLACEHOLDER
                    )}
                  </div>

                  <div className="p-3 flex flex-col flex-1">
                    <span className="text-xs text-gray-400 mb-1">Ships to Your Location</span>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">{variant.title}</h3>

                    <div className="mt-auto">
                      <p className="font-bold text-lg text-gray-900 mb-1">₹{(variant.price ?? 0).toFixed(2)}</p>

                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.round(variant.avg_rating || 0) ? (
                              <span className="text-yellow-500">★</span>
                            ) : (
                              <span className="text-gray-300">★</span>
                            )}
                          </span>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">{variant.rating_count} reviews</span>
                      </div>

                      {/* <div className="flex flex-wrap text-xs text-gray-600 gap-x-4">
                        {variant.attributes?.size && <span>Size: {variant.attributes.size}</span>}
                        {variant.attributes?.color && <span>Color: {variant.attributes.color}</span>}
                        {variant.attributes?.fit && <span>Fit: {variant.attributes.fit}</span>}
                      </div> */}
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
