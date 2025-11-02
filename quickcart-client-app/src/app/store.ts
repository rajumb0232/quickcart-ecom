import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"
import screenReducer from "../features/util/screenSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        screen: screenReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;