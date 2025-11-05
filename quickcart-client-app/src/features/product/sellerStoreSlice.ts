import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StoreDetails } from "../../types/storeTypes";

export interface StoreState {
  sellerStores: StoreDetails[];
  viewStore: StoreDetails | undefined;
}

const initialState: StoreState = {
  sellerStores: [],
  viewStore: undefined,
};

const sellerStoreSlice = createSlice({
  name: "seller_store",
  initialState,
  reducers: {
    setSellerStores: (state, action: PayloadAction<StoreDetails[]>) => {
      state.sellerStores = action.payload;
    },
    setViewStore: (state, action: PayloadAction<StoreDetails>) => {
      state.viewStore = action.payload;
    }
  },
});

export const { setSellerStores, setViewStore } = sellerStoreSlice.actions;
export default sellerStoreSlice.reducer;
