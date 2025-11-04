import { type Product } from "./../types/productTypes";
import { type ApiResult } from "./../types/apiResponseType";
import { useQuery } from "@tanstack/react-query";
import { useAPI } from "./useApi";
import { productService } from "../services/productService";

export const useSearchProduct = (query: string) => {
  const params = new URLSearchParams(query);
  const api = useAPI();

  return useQuery<ApiResult<Product[]>, Error>({
    queryKey: ["products", query],
    queryFn: () => productService.search(api, params),
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });
};