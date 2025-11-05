import type { useAPI } from "../hooks/useApi";
import type { ApiAck } from "../types/apiResponseType";
import type { StoreDetails, StoreRequest } from "../types/storeTypes";

export const storeService = {
  createStore: (api: ReturnType<typeof useAPI>, body: StoreRequest) => {
    return api.post<ApiAck>("/stores", body);
  },
  fetchStore: (api: ReturnType<typeof useAPI>, storeId: string) => {
    return api.get<StoreDetails>(`/stores/${storeId}`);
  },
  fetchSellerStores: (api: ReturnType<typeof useAPI>) => {
    return api.get<StoreDetails[]>("/stores");
  },
  editStore: (api: ReturnType< typeof useAPI>, storeId: string, body: StoreRequest) => {
    return api.put<StoreDetails>(`/stores/${storeId}`, body);
  }
};
