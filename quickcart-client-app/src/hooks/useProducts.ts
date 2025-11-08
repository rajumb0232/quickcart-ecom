import type {
  productRequest,
  Product,
  productEditRequest,
} from "./../types/productTypes";
import type {
  ApiAck,
  ApiResult,
  PaginatedRequest,
} from "./../types/apiResponseType";
import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useGetProductById = (id: string | undefined) => {
  const api = useAPI();

  return useQuery<ApiResult<Product>, Error>({
    queryKey: ["product", id],
    queryFn: () => productService.fetchProduct(api, id),
    retry: 2,
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export const useCreateProduct = (storeId: string, categoryId: string) => {
  const api = useAPI();

  return useMutation<ApiAck, Error, productRequest>({
    mutationFn:
      storeId && categoryId
        ? (body: productRequest) =>
            productService.createProduct(api, storeId, categoryId, body)
        : async () => {
            throw new Error("Invalid storeId or categoryId");
          },
  });
};

export const useGetBrands = () => {
  const api = useAPI();

  return useQuery<ApiResult<string[]>, Error>({
    queryKey: ["brands"],
    queryFn: () => productService.getBrands(api),
    retry: 2,
    staleTime: 30 * 60 * 1000, // 30 mins
  });
};

export const useGetProductsByStore = (
  storeId: string | undefined,
  pageInfo: PaginatedRequest
) => {
  const api = useAPI();

  return useQuery<ApiResult<Product>, Error>({
    queryKey: ["store", storeId],
    queryFn: () => productService.fetchProductByStore(api, storeId, pageInfo),
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 mins
  });
};

export const useGetProductIgnoreStatus = (productId: string | undefined) => {
  const api = useAPI();
  if (productId) {
    return useQuery<ApiResult<Product>, Error>({
      queryKey: ["product", "ignore_case", productId],
      queryFn: () => productService.fetchProductIgnoreStatus(api, productId),
      retry: 2,
      staleTime: 2 * 60 * 1000, // 2 mins
    });
  } else throw Error("Invalid product ID");
};

export const usePublishProduct = (productId: string | undefined) => {
  const api = useAPI();

  return productId
    ? useMutation<ApiAck, Error>({
        mutationFn: () => productService.publishProduct(api, productId),
      })
    : async () => {
        throw Error("Invalid product ID");
      };
};

export const useUpdateProduct = (productId: string | undefined) => {
  const api = useAPI();

  return productId
    ? useMutation<ApiResult<Product>, Error, productEditRequest>({
        mutationFn: (body: productEditRequest) =>
          productService.updateProduct(api, productId, body),
      })
    : async () => {
        throw Error("Invalid product ID");
      };
};
