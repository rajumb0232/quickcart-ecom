import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  setStoreIdToProductRequest,
  updateBuildStage,
} from "../../../features/product/productBuilderSlice";
import {
  selectProductReq,
  selectStoreIdInProductReq,
  selectCategoryIdInProductReq,
} from "../../../features/product/productBuilderSelectors";

import LinkButton from "../../../components/form/LinkButton";
import BlackButton from "../../../components/form/BlackButton";
import { useCreateProduct } from "../../../hooks/useProducts";
import { selectViewStore } from "../../../features/product/sellerStoreSelectors";

const PreviewProduct: React.FC = () => {
  const dispatch = useDispatch();
  const product = useSelector(selectProductReq);
  const storeId = useSelector(selectStoreIdInProductReq);
  const categoryId = useSelector(selectCategoryIdInProductReq);
  const storeViewing = useSelector(selectViewStore);

  useEffect(() => {
    if (storeViewing) {
      console.log("store in view", storeViewing);
      dispatch(setStoreIdToProductRequest(storeViewing.store_id));
    }
  },[])

  const createProductMutation = useCreateProduct(storeId, categoryId);

  const handleBack = () => {
    dispatch(updateBuildStage("stage4")); // go back to WriteDescription
  };

  const handleConfirm = async () => {
    console.log("submitting...");
    if (!storeId || !categoryId) {
      toast.error("Store or Category is missing!");
      return;
    }

    if (storeViewing) {
    console.log("store in view", storeViewing);
    dispatch(setStoreIdToProductRequest(storeViewing.store_id));
  }

    try {
      await createProductMutation.mutateAsync(product);
      toast.success("✅ Product created successfully!");
      console.log("Product Created:", product);
      // You can add reset/navigate logic here after success
    } catch (err: any) {
      console.error("❌ Product creation failed:", err);
      toast.error(err.message || "Failed to create product");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 p-6">
      <div className="w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Preview Product Details
        </h2>

        <div className="border border-gray-200 rounded-md p-4 bg-white shadow-sm space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Title:</span>{" "}
            <span className="text-gray-600">{product.title || "—"}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Brand:</span>{" "}
            <span className="text-gray-600">{product.brand || "—"}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Description:</span>
            <p className="text-gray-600 mt-1 whitespace-pre-wrap border border-gray-100 rounded p-2 bg-gray-50">
              {product.description || "—"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <LinkButton
            label="← Go Back"
            onClick={handleBack}
            disabled={createProductMutation.isPending}
          />

          <div className="w-48">
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
        </div>
      </div>
    </div>
  );
};

export default PreviewProduct;
