import type { useAPI } from "../hooks/useApi";
import type {Category} from "../types/productTypes"

export const categoryService = {
    getCategories: (api: ReturnType< typeof useAPI>) => {
        return api.get<Category[]>("/public/categories")
    }
}


export function normalizeCategories(raw?: Category[] | null): Category[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((c) => ({
    ...c,
    child_category: Array.isArray(c.child_category)
      ? c.child_category.map((cc) => ({
          ...cc,
          child_category: Array.isArray(cc.child_category) ? cc.child_category : [],
        }))
      : [],
  }));
}