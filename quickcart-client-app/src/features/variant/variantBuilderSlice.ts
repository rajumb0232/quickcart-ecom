import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Variant, VariantRequest } from "../../types/productTypes";

export type VariantBuildStage = 1 | 2 | 3 | 4;

export interface VariantBuilder {
  current_stage: VariantBuildStage;
  prev_stage: VariantBuildStage;
  next_stage: VariantBuildStage;
  variant_req: VariantRequest;
  variant_in_server: Variant;
}

const initialState: VariantBuilder = {
  current_stage: 1,
  prev_stage: 1,
  next_stage: 2,
  variant_req: {
    title: "",
    price: 0,
    quantity: 0,
    description: "",
    attributes: {},
  },
  variant_in_server: {
    variant_id: null,
    title: "",
    price: 0,
    quantity: 0,
    description: "",
    created_date: "",
    last_modified_date: "",
    attributes: {},
    image_uris: [],
    is_active: false,
    is_deleted: false,
  },
};

const variantBuilderSlice = createSlice({
  name: "variant_builder",
  initialState,
  reducers: {
    hydrateVariantBuilder(state, action: PayloadAction<Variant>) {
      const variant = action.payload;
      state.variant_in_server = variant;
      state.variant_req = {
        title: variant.title,
        price: variant.price,
        quantity: variant.quantity,
        description: variant.description,
        attributes: { ...variant.attributes },
      };
    },

    moveToNextStage(state) {
      if (state.current_stage < 4) {
        if (state.next_stage < 4) state.next_stage += 1;
        state.prev_stage = state.current_stage;
        state.current_stage += 1;
      }
    },

    moveToPrevStage(state) {
      if (state.current_stage > 1) {
        if (state.prev_stage > 1) state.prev_stage -= 1;
        state.next_stage = state.current_stage;
        state.current_stage -= 1;
      }
    },

    forceNextStage(state, action: PayloadAction<VariantBuildStage>) {
      const next = action.payload;
      if (next >= 1 && next <= 4) {
        state.next_stage = next;
      }
    },

    forcePrevStage(state, action: PayloadAction<VariantBuildStage>) {
      const prev = action.payload;
      if (prev >= 1 && prev <= 4) {
        state.prev_stage = prev;
      }
    },

    setVariantTitle(state, action: PayloadAction<string>) {
      state.variant_req.title = action.payload;
    },

    setVariantDesc(state, action: PayloadAction<string>) {
      state.variant_req.description = action.payload;
    },

    setVariantPrice(state, action: PayloadAction<number>) {
      console.log("updating price to: ", action.payload);
      state.variant_req.price = action.payload;
    },

    setVariantQuantity(state, action: PayloadAction<number>) {
      state.variant_req.quantity = action.payload;
    },

    setVariantAttributes(state, action: PayloadAction<Record<string, string>>) {
      state.variant_req.attributes = action.payload;
    },
  },
});

export const {
  hydrateVariantBuilder,
  moveToNextStage,
  moveToPrevStage,
  forceNextStage,
  forcePrevStage,
  setVariantTitle,
  setVariantDesc,
  setVariantPrice,
  setVariantQuantity,
  setVariantAttributes,
} = variantBuilderSlice.actions;

export default variantBuilderSlice.reducer;
