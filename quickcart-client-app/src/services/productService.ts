import type { useAPI } from "../hooks/useApi";
import { type ApiAck, type PaginatedRequest } from "../types/apiResponseType";
import { type Variant, type Product, type productEditRequest, type productRequest, type VariantRequest } from "../types/productTypes";

export const productService = {
    search: (api: ReturnType< typeof useAPI>, params: URLSearchParams) => {
        return api.get<Product[]>("/public/products/filter", params);
    },

    fetchProduct: (api: ReturnType<typeof useAPI>, productId: string | undefined) => {
        return api.get<Product>(`/public/products/${productId}`)
    },

    createProduct: (api: ReturnType< typeof useAPI>, storeId: string | undefined, categoryId: string | undefined, body: productRequest) => {
        const req = {
            title: body.title,
            brand: body.brand,
            description: body.description
        }
        return api.post<ApiAck>(`/stores/${storeId}/categories/${categoryId}/products`, req);
    },

    getBrands: (api: ReturnType< typeof useAPI>) => {
        return api.get<string[]>("/public/brands");
    },

    fetchProductByStore: (api: ReturnType< typeof useAPI>, storeId: string | undefined, pageInfo: PaginatedRequest) => {
        if(!storeId) {
            throw Error("Invalid store ID");
        }
        const pageNo = pageInfo.page ? pageInfo.page : 0;
        const size = pageInfo.size ? pageInfo.size : 15;
        return api.get<Product>(`/stores/${storeId}/products?page=${pageNo}&size=${size}`)
    },

    fetchProductIgnoreStatus: (api: ReturnType< typeof useAPI>, productId: string) => {
        return api.get<Product>(`/products/${productId}`)
    },

    publishProduct: (api: ReturnType< typeof useAPI>, productId: string) => {
        return api.post<ApiAck>(`/products/${productId}/publish`)
    },

    updateProduct: (api: ReturnType< typeof useAPI>, productId: string, body: productEditRequest) => {
        return api.put(`/products/${productId}`, body);
    },

    addVariant: (api: ReturnType< typeof useAPI>, productId: string, body: VariantRequest) => {
        return api.post<Variant>(`/products/${productId}/variants`, body);
    },

    updateVariant: (api: ReturnType< typeof useAPI>, variantId: string, body: VariantRequest) => {
        return api.put<Variant>(`/variants/${variantId}`, body);
    },

    fetchVariant: (api: ReturnType< typeof useAPI>, variantId: string) => {
        return api.get<Variant>(`/variants/${variantId}`);
    }
}