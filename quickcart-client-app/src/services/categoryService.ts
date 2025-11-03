import type { useAPI } from "../hooks/useApi";
import type {Category} from "../types/productTypes"

export const categoryService = {
    getCategories: (api: ReturnType< typeof useAPI>) => {
        return api.get<Category[]>("/public/categories")
    }
}