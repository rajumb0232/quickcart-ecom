import type { RootState } from "../../app/store";

export const selectSelectStores = (state: RootState) => state.sellerStore.sellerStores;
export const selectViewStore = (state: RootState) => state.sellerStore.viewStore;