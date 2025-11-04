import type { useAPI } from "../hooks/useApi";
import type { Product } from "../types/productTypes";

export const productService = {
    search: (api: ReturnType< typeof useAPI>, params: URLSearchParams) => {
        return api.get<Product[]>("/public/products/filter", params);
    }
}