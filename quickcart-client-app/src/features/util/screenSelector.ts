import type { RootState } from "../../app/store"; // adjust the path to your store's root reducer

export const selectNavHeight = (state: RootState) => state.screen.navHeight;
export const selectScreenHeight = (state: RootState) => state.screen.screenHeight;
export const selectShowCategories = (state: RootState) => state.screen.showCategories;