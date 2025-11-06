import type { RootState } from "../../app/store";

export const selectStoreIdInProductReq = (state: RootState) => state.productRequest.product_request.store_id;
export const selectCategoryIdInProductReq = (state: RootState) => state.productRequest.product_request.category_id;
export const selectTitleInProductReq = (state: RootState) => state.productRequest.product_request.title;
export const selectBrandInProductReq = (state: RootState) => state.productRequest.product_request.brand;
export const selectDescriptionInProductReq = (state: RootState) => state.productRequest.product_request.description;
export const selectProductReqBuildStage = (state: RootState) => state.productRequest.current_stage;

export const selectCategoryPathInProductReq = (state: RootState) => state.productRequest.product_category_path;

export const selectProductReq = (state: RootState) => state.productRequest.product_request;

export const selectForcedBackStage = (state: RootState) => state.productRequest.forced_back_stage;