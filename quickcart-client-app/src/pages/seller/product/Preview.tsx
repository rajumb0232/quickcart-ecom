import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react"; // ✅ Pencil icon

import {
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

import BlackButton from "../../../components/form/BlackButton";
import { useCreateProduct } from "../../../hooks/useProducts";
import { selectViewStore } from "../../../features/product/sellerStoreSelectors";

const PreviewProduct: React.FC = () => {
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

  // ✅ Handles editing of a particular field
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
    if (!storeId || !categoryId) {
      toast.error("Store or Category is missing!");
      return;
    }

    if (storeViewing) {
      dispatch(setStoreIdToProductRequest(storeViewing.store_id));
    }

    try {
      await createProductMutation.mutateAsync(product);
      toast.success("✅ Product created successfully!");
      console.log("Product Created:", product);
      // You can add navigation/reset here if desired
    } catch (err: any) {
      console.error("❌ Product creation failed:", err);
      toast.error(err.message || "Failed to create product");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-start px-2 py-8 md:px-8">
      <div className="w-full max-w-3xl mx-auto">
        <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <h2 className="text-3xl text-center my-4 mt-8 font-bold text-gray-900 mb-8 tracking-tight">
            Product Preview
          </h2>
          <hr className="border-[0.7px] border-gray-100"/>
          <div className="p-6 md:p-10 space-y-6">
            {/* Category Row */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase font-semibold text-gray-500 mb-2 tracking-wide">
                  Category
                </div>
                <div className="flex flex-wrap gap-2">
                  {categoryPath.length > 0 ? (
                    categoryPath.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full bg-amber-300 text-yellow-950 border border-amber-300"
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
                className="ml-3 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                title="Edit Category"
              >
                <Pencil size={18} />
              </button>
            </div>

            {/* Title Row */}
            <div className="flex items-center justify-between">
              <div className="w-full pr-6">
                <div className="text-xs uppercase font-semibold text-gray-500 mb-2">
                  Title
                </div>
                <div className="text-gray-900 text-lg font-medium">
                  {product.title || "—"}
                </div>
              </div>
              <button
                onClick={() => editRequestHandler("title")}
                aria-label="Edit title"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                title="Edit Title"
              >
                <Pencil size={18} />
              </button>
            </div>

            {/* Brand Row */}
            <div className="flex items-center justify-between">
              <div className="w-full pr-6">
                <div className="text-xs uppercase font-semibold text-gray-500 mb-2">
                  Brand
                </div>
                <div className="text-gray-800 text-base">
                  {product.brand || "—"}
                </div>
              </div>
              <button
                onClick={() => editRequestHandler("brand")}
                aria-label="Edit brand"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                title="Edit Brand"
              >
                <Pencil size={18} />
              </button>
            </div>

            {/* Description Row */}
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-6">
                <div className="text-xs uppercase font-semibold text-gray-500 mb-2">
                  Description
                </div>
                <div className="text-gray-700 bg-gray-50 border border-gray-200 rounded-md p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {product.description || "—"}
                </div>
              </div>
              <button
                onClick={() => editRequestHandler("description")}
                aria-label="Edit description"
                className="ml-3 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 self-start"
                title="Edit Description"
              >
                <Pencil size={18} />
              </button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col items-end gap-2 border-t">
            <div className="w-full md:w-48">
              <BlackButton
                label={
                  createProductMutation.isPending
                    ? "Creating..."
                    : "Create Product"
                }
                onClick={handleConfirm}
                disabled={createProductMutation.isPending}
              />
            </div>
            <div className="mt-2 text-xs text-gray-400 text-right">
              Click the pencil to edit a field before creating the product.
            </div>
          </div>
        </section>
        {/* Footer spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
};

export default PreviewProduct;
