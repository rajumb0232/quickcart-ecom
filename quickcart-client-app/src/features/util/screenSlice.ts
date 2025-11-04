import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ScreenState {
  navHeight: number;
  screenHeight: number;
  showCategories: boolean;
}

const initialState: ScreenState = {
  navHeight: 0,
  screenHeight: 0,
  showCategories: true,
};

const screenSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    setNavHeight: (state, action: PayloadAction<number>) => {
      state.navHeight = action.payload;
    },
    setScreenHeight: (state, action: PayloadAction<number>) => {
      state.screenHeight = action.payload;
    },
    setShowCategories: (state, action: PayloadAction<boolean>) => {
      state.showCategories = action.payload;
    }
  },
});

export const { setNavHeight, setScreenHeight, setShowCategories } = screenSlice.actions;

export default screenSlice.reducer;
