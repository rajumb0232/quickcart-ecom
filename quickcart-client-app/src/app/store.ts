import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"
import screenReducer from "../features/util/screenSlice";
import productResultReducer from "../features/product/productResultSlice"
import sellerStoreReducer from "../features/product/sellerStoreSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        screen: screenReducer,
        productResult: productResultReducer,
        sellerStore: sellerStoreReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;