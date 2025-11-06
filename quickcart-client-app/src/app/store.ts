import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"
import screenReducer from "../features/util/screenSlice";
import productResultReducer from "../features/product/productResultSlice"
import sellerStoreReducer from "../features/product/sellerStoreSlice"
import productRequestBuilderReducer from "../features/product/productBuilderSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        screen: screenReducer,
        productResult: productResultReducer,
        sellerStore: sellerStoreReducer,
        productRequest: productRequestBuilderReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;