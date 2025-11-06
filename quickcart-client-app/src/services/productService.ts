import type { useAPI } from "../hooks/useApi";
import type { ApiAck } from "../types/apiResponseType";
import type { Product, productRequest } from "../types/productTypes";

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
    }
}