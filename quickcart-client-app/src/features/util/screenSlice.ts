import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ScreenState {
  navHeight: number;
}

const initialState: ScreenState = {
  navHeight: 0,
};

const screenSlice = createSlice({
  name: "screen",
  initialState,
  reducers: {
    setNavHeight: (state, action: PayloadAction<number>) => {
      state.navHeight = action.payload;
    },
  },
});

export const { setNavHeight } = screenSlice.actions;

export default screenSlice.reducer;
