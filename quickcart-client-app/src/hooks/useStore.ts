import { useMutation, useQuery } from "@tanstack/react-query";
import { useAPI } from "./useApi";
import { type ApiResult, type ApiAck } from "../types/apiResponseType";
import { type StoreDetails, type StoreRequest } from "../types/storeTypes";
import { storeService } from "../services/storeService";

export const useCreateStore = () => {
  const api = useAPI();

  return useMutation<ApiAck, Error, StoreRequest>({
    mutationFn: (data: StoreRequest) => storeService.createStore(api, data),
  });
};

export const useGetSellerStores = () => {
  const api = useAPI();

  return useQuery<ApiResult<StoreDetails[]>, Error>({
    queryKey: ["stores"],
    queryFn: () => storeService.fetchSellerStores(api),
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 mins
  });
};

export const useGetStoreById = (id: string) => {
  const api = useAPI();

  return useQuery<ApiResult<StoreDetails>, Error>({
    queryKey: ["store", id],
    queryFn: () => storeService.fetchStore(api, id),
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 mins
  });
};

export const useEditStore = (id: string | undefined) => {
  const api = useAPI();

  return useMutation<ApiResult<StoreDetails>, Error, StoreRequest>({
    mutationFn: id
      ? (body: StoreRequest) => storeService.editStore(api, id, body)
      : async () => {
          throw new Error("Store ID missing for editStore mutation");
        },
  });
};
