import type { RootState } from "../../app/store"; // adjust the path to your store's root reducer

export const selectNavHeight = (state: RootState) => state.screen.navHeight;
