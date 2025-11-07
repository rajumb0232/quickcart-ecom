import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SquarePen, CheckCircle } from "lucide-react";

import {
  clearProductBuilderData,
  forceBackStage,
  setStoreIdToProductRequest,
  updateBuildStage,
} from "../../../features/product/productBuilderSlice";
import {
  selectProductReq,
  selectStoreIdInProductReq,
  selectCategoryIdInProductReq,
  selectCategoryPathInProductReq,
} from "../../../features/product/productBuilderSelectors";

import { useCreateProduct } from "../../../hooks/useProducts";
import { selectViewStore } from "../../../features/product/sellerStoreSelectors";
import { useNavigate } from "react-router-dom";

const PreviewProduct: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector(selectProductReq);
  const storeId = useSelector(selectStoreIdInProductReq);
  const categoryId = useSelector(selectCategoryIdInProductReq);
  const storeViewing = useSelector(selectViewStore);
  const categoryPath = useSelector(selectCategoryPathInProductReq);

  // Ensure store_id is set from viewStore when this component mounts
  useEffect(() => {
    if (storeViewing) {
      dispatch(setStoreIdToProductRequest(storeViewing.store_id));
    }
  }, [dispatch, storeViewing]);

  const createProductMutation = useCreateProduct(storeId, categoryId);

  // Handles editing of a particular field
  const editRequestHandler = (
    field: "title" | "brand" | "description" | "category"
  ) => {
    dispatch(forceBackStage("stage5"));
    switch (field) {
      case "category":
        dispatch(updateBuildStage("stage1"));
        break;
      case "title":
        dispatch(updateBuildStage("stage2"));
        break;
      case "brand":
        dispatch(updateBuildStage("stage3"));
        break;
      case "description":
        dispatch(updateBuildStage("stage4"));
        break;
    }
  };

  const handleConfirm = async () => {
    console.log("attempting create product.");
    if (!storeId || !categoryId) {
      toast.error("Store or Category is missing!");
      return;
    }

    if (storeViewing) {
      dispatch(setStoreIdToProductRequest(storeViewing.store_id));
    }

    try {
      await createProductMutation.mutateAsync(product);
      dispatch(clearProductBuilderData());
      toast.success("Product created successfully!");
      console.log("Product Created:", product);
      navigate("/seller/manage-products");
    } catch (err: any) {
      console.error("Product creation failed:", err);
      toast.error(err?.message || "Failed to create product");
    }
  };

  return (
    <div className="w-full flex items-start justify-center">
      <div className="w-full max-w-6xl">
        <div className="bg-white overflow-hidden">
          <div className="px-8 space-y-6">
            {/* Category Row */}
            <div className="flex items-start justify-between border-2 border-gray-100 rounded-xl p-6">
              <div className="flex-1">
                <div className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
                  Category
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(categoryPath) && categoryPath.length > 0 ? (
                    categoryPath.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border-[1.5px] border-emerald-300"
                      >
                        {c}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => editRequestHandler("category")}
                aria-label="Edit category"
                className="ml-4 p-2 rounded-md hover:bg-gray-50 transition-colors text-gray-600"
                title="Edit Category"
              >
                <SquarePen />
              </button>
            </div>

            {/* Title Row */}
            <div className="flex items-center justify-between border-2 border-gray-100 rounded-xl p-6">
              <div className="w-full pr-6">
                <div className="text-xs uppercase font-semibold text-gray-500 mb-2">
                  Title
                </div>
                <div className="text-gray-900 text-lg font-medium">
                  {product?.title || "—"}
                </div>
              </div>
              <button
                onClick={() => editRequestHandler("title")}
                aria-label="Edit title"
                className="p-2 rounded-md hover:bg-gray-50 transition-colors text-gray-600"
                title="Edit Title"
              >
                <SquarePen />
              </button>
            </div>

            {/* Brand Row */}
            <div className="flex items-center justify-between border-2 border-gray-100 rounded-xl p-6">
              <div className="w-full pr-6">
                <div className="text-xs uppercase font-semibold text-gray-500 mb-2">
                  Brand
                </div>
                <div className="text-gray-800 text-base">
                  {product?.brand || "—"}
                </div>
              </div>
              <button
                onClick={() => editRequestHandler("brand")}
                aria-label="Edit brand"
                className="p-2 rounded-md hover:bg-gray-50 transition-colors text-gray-600"
                title="Edit Brand"
              >
                <SquarePen />
              </button>
            </div>

            {/* Description Row */}
            <div className="flex items-start justify-between border-2 border-gray-100 rounded-xl p-6">
              <div className="flex-1 pr-6">
                <div className="text-xs uppercase font-semibold text-gray-500 mb-2">
                  Description
                </div>
                <div className="text-gray-700 bg-gray-50 rounded-md text-sm leading-relaxed whitespace-pre-wrap p-4">
                  {product?.description || "—"}
                </div>
              </div>
              <button
                onClick={() => editRequestHandler("description")}
                aria-label="Edit description"
                className="ml-4 p-2 rounded-md hover:bg-gray-50 transition-colors text-gray-600 self-start"
                title="Edit Description"
              >
                <SquarePen />
              </button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row items-center md:items-end justify-between gap-3 border-t mt-6">
            <div className="text-sm text-gray-500 md:pr-4">
              Click the pencil to edit a field before creating the product.
            </div>

            <div className="flex items-center">
              <div className="w-full">
                <button
                  onClick={handleConfirm}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg bg-linear-to-r from-gray-700 to-gray-900 text-white hover:from-gray-800 hover:to-gray-950 shadow-gray-200`}
                >
                  <CheckCircle className="text-green-400" />
                  <span>
                    {createProductMutation.isPending ? "Creating..." : "Create"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default PreviewProduct;
