import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { productRequest } from "../../types/productTypes";

export interface productReqState {
  product_request: productRequest;
  product_category_path: string[];
  build_stages: {
    stage1: "select_category";
    stage2: "enter_title";
    stage3: "enter_brand";
    stage4: "write_description";
    stage5: "preview_product";
  };
  current_stage: keyof productReqState["build_stages"];
}

const initialState: productReqState = {
  product_request: {
    store_id: "",
    category_id: "",
    title: "",
    brand: "",
    description: "",
  },
  product_category_path: [],
  build_stages: {
    stage1: "select_category",
    stage2: "enter_title",
    stage3: "enter_brand",
    stage4: "write_description",
    stage5: "preview_product",
  },
  current_stage: "stage1",
};

const productBuilderSlice = createSlice({
  name: "product_builder",
  initialState,
  reducers: {
    setStoreIdToProductRequest: (state, action: PayloadAction<string>) => {
      state.product_request.store_id = action.payload;
    },
    setCategoryIdToProductRequest: (state, action: PayloadAction<string>) => {
      state.product_request.category_id = action.payload;
    },
    setTitleToProductRequest: (state, action: PayloadAction<string>) => {
      state.product_request.title = action.payload;
    },
    setBrandToProductRequest: (state, action: PayloadAction<string>) => {
      state.product_request.brand = action.payload;
    },
    setDescriptionToProductRequest: (state, action: PayloadAction<string>) => {
      state.product_request.description = action.payload;
    },
    setCategoryPathOfProductRequest: (state, action: PayloadAction<string[]>) => {
      state.product_category_path = action.payload;
    },

    /**
     * Moves to the next or specific build stage.
     * If "next" is passed, it auto-advances to the next logical step.
     * If a specific stage key is provided, it jumps there directly.
     */
    updateBuildStage: (
      state,
      action: PayloadAction<"next" | keyof productReqState["build_stages"]>
    ) => {
      const stages = Object.keys(
        state.build_stages
      ) as (keyof productReqState["build_stages"])[];

      const currentIndex = stages.indexOf(state.current_stage);

      if (action.payload === "next") {
        // Move forward unless already at the last stage
        const nextStage = stages[currentIndex + 1];
        if (nextStage) state.current_stage = nextStage;
      } else {
        // Jump directly to a specific stage
        if (stages.includes(action.payload)) {
          state.current_stage = action.payload;
        }
      }
    },
  },
});

export const {
  setStoreIdToProductRequest,
  setCategoryIdToProductRequest,
  setTitleToProductRequest,
  setBrandToProductRequest,
  setDescriptionToProductRequest,
  updateBuildStage,
  setCategoryPathOfProductRequest
} = productBuilderSlice.actions;

export default productBuilderSlice.reducer;
