import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StoreDetails } from "../../types/storeTypes";

export interface StoreState {
  sellerStores: StoreDetails[];
  viewStore: StoreDetails | undefined;
}

const LOCAL_STORAGE_KEY = "view_store_id";

/**
 * Load the last viewed store ID from localStorage.
 */
const loadViewStoreId = (): string | undefined => {
  try {
    const id = localStorage.getItem(LOCAL_STORAGE_KEY);
    console.log("view store ID: ", id);
    return id ? id : undefined;
  } catch (err) {
    console.error("Failed to read viewStore ID from localStorage:", err);
    return undefined;
  }
};

const initialState: StoreState = {
  sellerStores: [],
  viewStore: undefined,
};

const sellerStoreSlice = createSlice({
  name: "seller_store",
  initialState,
  reducers: {
    /**
     * Sets all seller stores.
     */
    setSellerStores: (state, action: PayloadAction<StoreDetails[]>) => {
      state.sellerStores = action.payload;
    },

    /**
     * Sets the currently viewed store and saves its ID to localStorage.
     */
    setViewStore: (state, action: PayloadAction<StoreDetails>) => {
      state.viewStore = action.payload;
      try {
        console.log("setting new store...");
        localStorage.setItem(LOCAL_STORAGE_KEY, action.payload.store_id);
      } catch (err) {
        console.error("Failed to save viewStore ID to localStorage:", err);
      }
    },

    /**
     * Rehydrates the viewStore from the saved storeId.
     * If the saved ID doesn’t exist or doesn’t match any current stores,
     * defaults to the first store (if available).
     */
    rehydrateViewStore: (state, action: PayloadAction<StoreDetails[]>) => {
      const savedId = loadViewStoreId();
      const stores = action.payload;

      state.sellerStores = stores;

      console.log("stores found: ", stores);

      if (stores.length === 0) {
        state.viewStore = undefined;
        return;
      }

      const matchedStore = savedId
        ? stores.find((store) => store.store_id === savedId)
        : undefined;

      console.log("matched store: ", matchedStore);
      state.viewStore = matchedStore ?? stores[0];

      // If fallback used, update localStorage to new ID
      if (!matchedStore) {
        try {
          console.log("setting first store as view store.");
          localStorage.setItem(LOCAL_STORAGE_KEY, stores[0].store_id);
        } catch (err) {
          console.error("Failed to update fallback storeId:", err);
        }
      }
    },

    /**
     * Clears the current view store and removes it from localStorage.
     */
    clearViewStore: (state) => {
      state.viewStore = undefined;
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    },
  },
});

export const {
  setSellerStores,
  setViewStore,
  rehydrateViewStore,
  clearViewStore,
} = sellerStoreSlice.actions;

export default sellerStoreSlice.reducer;
