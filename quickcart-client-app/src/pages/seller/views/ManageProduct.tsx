import React, { useEffect, useState } from "react";
import { useGetProductsByStore } from "../../../hooks/useProducts";
import { useDispatch, useSelector } from "react-redux";
import { selectViewStore } from "../../../features/product/sellerStoreSelectors";
import { isPageResponse } from "../../../types/apiResponseType";
import { type Product } from "../../../types/productTypes";
import {
  AlertCircle,
  Loader2,
  Package,
  Pencil,
  Star,
  MapPin,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setShowCategories } from "../../../features/util/screenSlice";
import { API_BASE } from "../../../api/apiClient";

const PAGE_SIZE = 10;

const ManageProducts: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setShowCategories(false));
  }, [dispatch]);

  const viewingStore = useSelector(selectViewStore);
  const [page, setPage] = useState<number>(0);
  const [openProductId, setOpenProductId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetProductsByStore(
    viewingStore?.store_id,
    {
      page,
      size: PAGE_SIZE,
    }
  );

  const pageResp = data && isPageResponse(data) ? data.page : undefined;
  const products: Product[] = pageResp?.content ?? [];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full bg-linear-to-br from-gray-50 to-gray-100">
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-gray-700 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-lg">
              Loading your products…
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Fetching items from your store
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
              Could not load products
            </h3>
            <p className="text-gray-600 mb-4">
              There was a problem fetching your products. Try reloading.
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

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex h-full bg-linear-to-br from-gray-50 to-gray-100">
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-lg text-center p-8 flex flex-col justify-center items-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              You haven't listed any products yet. Use the product builder to
              add new items to your store.
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

  const productPublishState = (p: Product) => {
    if (p.is_deleted)
      return {
        label: "Deleted",
        style: "bg-red-50 text-red-700 border-red-200",
      };
    if (p.is_active)
      return {
        label: "Published",
        style: "bg-emerald-50 text-emerald-800 border-emerald-200",
      };
    return {
      label: "Unpublished",
      style: "bg-amber-50 text-amber-800 border-amber-200",
    };
  };

  const toggleOpen = (productId: string) => {
    setOpenProductId((prev) => (prev === productId ? null : productId));
  };

  const onRowKeyPress = (e: React.KeyboardEvent, productId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen(productId);
    }
  };

  return (
    <div className="flex bg-linear-to-br from-gray-50 to-gray-100 w-full p-4">
      <main className="flex-1 w-full">
        {/* Outer container with max width control */}
        <div className="w-full">
          {/* Header */}
          <div className="p-4 md:p-6 border-2 border-gray-200 mb-4 bg-white rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shrink-0">
                <Package size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                  Manage Products
                </h1>
                <p className="text-sm text-gray-600">
                  Your store's product list. Click any row to expand and see
                  variants.
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-500 flex items-center gap-2 shrink-0">
              {viewingStore?.name ? (
                <>
                  <MapPin size={14} className="text-gray-400" />
                  <span className="font-medium text-gray-700 truncate">
                    {viewingStore.name}
                  </span>
                </>
              ) : (
                <span className="text-gray-400">No store selected</span>
              )}
            </div>
          </div>

          {/* Scrollable Table Container */}
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs text-gray-500 uppercase border-b-2 border-gray-100 min-w-[800px]">
                <div className="col-span-5">Product</div>
              </div>

              {/* Product Rows */}
              <div className="min-w-[800px]">
                {products.map((p) => {
                  const state = productPublishState(p);
                  const isOpen = openProductId === p.product_id;

                  return (
                    <div
                      key={p.product_id}
                      className="border-b border-gray-100"
                    >
                      {/* Clickable Row */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleOpen(p.product_id)}
                        onKeyDown={(e) => onRowKeyPress(e, p.product_id)}
                        className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 hover:bg-gray-50 transition-colors cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        {/* Product Summary */}
                        <div className="flex items-start gap-4 flex-1 min-w-0 md:col-span-5">
                          <div className="w-20 h-20 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                            {p.variants?.[0]?.image_uris?.[0] ? (
                              <img
                                src={API_BASE + p.variants[0].image_uris[0]}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ShoppingBag
                                size={28}
                                className="text-gray-300"
                              />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                  {p.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 truncate">
                                  {p.brand || "—"}
                                </div>
                              </div>
                              <div
                                className={`text-xs px-2 py-1 rounded-lg border ${state.style} shrink-0 ml-2`}
                              >
                                {state.label}
                              </div>
                            </div>

                            <div className="mt-3 text-xs text-gray-500 space-y-1">
                              <div>
                                Created:{" "}
                                <span className="text-gray-700 font-medium">
                                  {new Date(
                                    p.created_date
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div>
                                Updated:{" "}
                                <span className="text-gray-700 font-medium">
                                  {new Date(
                                    p.last_modified_date
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="truncate">
                                ID:{" "}
                                <span className="text-gray-600">
                                  {p.product_id}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats & Actions */}
                        <div className="w-full md:w-auto flex md:items-center md:gap-6 mt-4 md:mt-0">
                          <div className="text-sm text-gray-700 text-center md:w-24">
                            {p.variants?.length ?? 0}
                            <div className="text-xs text-gray-400">
                              variants
                            </div>
                          </div>

                          <div className="text-sm text-gray-700 text-center md:w-28">
                            {Array.isArray(p.variants)
                              ? p.variants.reduce(
                                  (s, v) => s + (v.quantity ?? 0),
                                  0
                                )
                              : 0}
                            <div className="text-xs text-gray-400">
                              total stock
                            </div>
                          </div>

                          <div className="flex flex-col items-center md:w-24">
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-amber-400" />
                              <span className="text-sm font-medium text-gray-700">
                                {p.avg_rating?.toFixed?.(1) ?? "-"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400">
                              {p.rating_count ?? 0} reviews
                            </div>
                          </div>

                          <div className="ml-auto md:ml-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`/product/manage/${p.product_id}`, "_blank")
                              }}
                              className="px-3 py-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 text-white font-semibold hover:from-amber-500 hover:to-orange-600 transition text-sm flex items-center gap-1.5"
                              title="Edit product"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Variants */}
                      {isOpen && (
                        <div className="bg-gray-50 px-4 pb-6 md:px-10">
                          <div className="pt-4 space-y-6">
                            {/* Audit */}
                            <div className="bg-white rounded-xl border border-gray-100 p-4">
                              <div className="text-xs text-gray-500 uppercase font-semibold mb-2">
                                Product audit
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                <div>
                                  <div className="text-xs text-gray-500">
                                    Created
                                  </div>
                                  <div className="font-medium">
                                    {new Date(p.created_date).toLocaleString()}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">
                                    Last modified
                                  </div>
                                  <div className="font-medium">
                                    {new Date(
                                      p.last_modified_date
                                    ).toLocaleString()}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500">
                                    Status
                                  </div>
                                  <div className="font-medium">
                                    {state.label}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Variants */}
                            <div>
                              <div className="text-sm font-semibold text-gray-900 mb-3">
                                Variants
                              </div>

                              {p.variants && p.variants.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {p.variants.map((v) => (
                                    <div
                                      key={v.variant_id}
                                      className="bg-white rounded-xl border-2 border-gray-100 shadow-sm overflow-hidden"
                                    >
                                      <div className="p-4">
                                        <div className="flex items-start gap-4">
                                          <div className="w-24 h-20 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100 shrink-0">
                                            {v.image_uris?.[0] ? (
                                              <img
                                                src={API_BASE + v.image_uris[0]}
                                                alt={v.title}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <ShoppingBag
                                                size={24}
                                                className="text-gray-300"
                                              />
                                            )}
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <div className="flex justify-between gap-2">
                                              <div className="min-w-0">
                                                <div className="text-sm font-semibold text-gray-900 truncate">
                                                  {v.title}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1 truncate">
                                                  {v.description ?? "—"}
                                                </div>
                                              </div>
                                              <div className="text-right shrink-0">
                                                <div className="text-sm font-semibold text-gray-900">
                                                  ₹
                                                  {v.price?.toFixed?.(2) ??
                                                    v.price}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                  {v.quantity} in stock
                                                </div>
                                              </div>
                                            </div>

                                            <div className="mt-3 text-xs text-gray-500 space-y-0.5">
                                              <div className="truncate">
                                                ID:{" "}
                                                <span className="text-gray-700">
                                                  {v.variant_id}
                                                </span>
                                              </div>
                                              <div>
                                                Created:{" "}
                                                <span className="text-gray-700">
                                                  {new Date(
                                                    v.created_date
                                                  ).toLocaleDateString()}
                                                </span>
                                              </div>
                                              <div>
                                                Updated:{" "}
                                                <span className="text-gray-700">
                                                  {new Date(
                                                    v.last_modified_date
                                                  ).toLocaleDateString()}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-between text-xs">
                                        <span className="text-gray-500">
                                          Status
                                        </span>
                                        <span className="font-medium">
                                          {v.is_deleted
                                            ? "Deleted"
                                            : v.is_active
                                            ? "Active"
                                            : "Unpublished"}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                  <div className="flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    This product has no variants.
                                  </div>
                                  <div className="text-xs text-amber-700 mt-2">
                                    You can add variants from the product edit
                                    screen.
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-sm text-gray-600">
                Page {pageResp ? pageResp.page + 1 : 1} of{" "}
                {pageResp ? pageResp.total_pages : 1}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page <= 0}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={pageResp ? page >= pageResp.total_pages - 1 : false}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="h-6" />
        </div>
      </main>
    </div>
  );
};

export default ManageProducts;
