import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/productTypes";
import { productService } from "../../services/productService";
import { useAPI } from "../../hooks/useApi";
import { isApiResponse } from "../../types/apiResponseType";

export const fetchProducts = createAsyncThunk<Product[], string>(
  "product/fetchProducts",
  async (queryString) => {
    const api = useAPI(); 
    const params = new URLSearchParams(queryString);
    const response = await productService.search(api, params);
    if (response && isApiResponse(response)) return response.data;
    else return [];
  }
);

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // your reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export const { /* your filter actions here */ } = productSlice.actions;

export default productSlice.reducer;
