import type {
  productRequest,
  Product,
  productEditRequest,
  VariantRequest,
  Variant,
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
    queryFn: () => {
      if (!id) throw new Error("Invalid product ID");
      return productService.fetchProduct(api, id);
    },
    retry: 2,
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export const useCreateProduct = (storeId: string, categoryId: string) => {
  const api = useAPI();

  return useMutation<ApiAck, Error, productRequest>({
    mutationFn: async (body: productRequest) => {
      if (!storeId || !categoryId) throw new Error("Invalid storeId or categoryId");
      return productService.createProduct(api, storeId, categoryId, body);
    },
  });
};

export const useGetBrands = () => {
  const api = useAPI();

  return useQuery<ApiResult<string[]>, Error>({
    queryKey: ["brands"],
    queryFn: () => productService.getBrands(api),
    retry: 2,
    staleTime: 30 * 60 * 1000,
  });
};

export const useGetProductsByStore = (
  storeId: string | undefined,
  pageInfo: PaginatedRequest
) => {
  const api = useAPI();

  return useQuery<ApiResult<Product>, Error>({
    queryKey: ["store", storeId, pageInfo],
    queryFn: () => {
      if (!storeId) throw new Error("Invalid storeId");
      return productService.fetchProductByStore(api, storeId, pageInfo);
    },
    retry: 2,
    staleTime: 2 * 60 * 1000,
  });
};

export const useGetProductIgnoreStatus = (productId: string | undefined) => {
  const api = useAPI();

  return useQuery<ApiResult<Product>, Error>({
    queryKey: ["product", "ignore_case", productId],
    queryFn: () => {
      if (!productId) throw new Error("Invalid product ID");
      return productService.fetchProductIgnoreStatus(api, productId);
    },
    retry: 2,
    staleTime: 2 * 60 * 1000,
  });
};

export const usePublishProduct = () => {
  const api = useAPI();

  return useMutation<ApiAck, Error, string>({
    mutationFn: async (productId: string) => {
      if (!productId) throw new Error("Invalid product ID");
      return productService.publishProduct(api, productId);
    },
  });
};

export const useUpdateProduct = () => {
  const api = useAPI();

  return useMutation<ApiResult<Product>, Error, { productId: string; body: productEditRequest }>({
    mutationFn: async ({ productId, body }) => {
      if (!productId) throw new Error("Invalid product ID");
      return productService.updateProduct(api, productId, body);
    },
  });
};

export const useAddVariant = () => {
  const api = useAPI();

  return useMutation<ApiResult<Variant>, Error, { productId: string; body: VariantRequest }>({
    mutationFn: async ({ productId, body }) => {
      if (!productId) throw new Error("Invalid product ID");
      return productService.addVariant(api, productId, body);
    },
  });
};

export const useUpdateVariant = () => {
  const api = useAPI();

  return useMutation<ApiResult<Variant>, Error, { variantId: string; body: VariantRequest }>({
    mutationFn: async ({ variantId, body }) => {
      if (!variantId) throw new Error("Invalid variant ID");
      return productService.updateVariant(api, variantId, body);
    },
  });
};

export const useGetVariant = (variantId: string) => {
  const api = useAPI();

  return useQuery<ApiResult<Variant>, Error>({
    queryKey: ["variant", variantId],
    queryFn: () => productService.fetchVariant(api, variantId),
    retry: 2,
    staleTime: 5 * 1000,
  });
};
