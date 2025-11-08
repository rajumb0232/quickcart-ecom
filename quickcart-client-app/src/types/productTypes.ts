import { API_BASE } from "../api/apiClient";

export type CategoryStatus = "ACTIVE" | "DRAFT" | "ARCHIVE";
export type CategoryLevel = 1 | 2 | 3;

export interface Category {
  category_id: string;
  name: string;
  status: CategoryStatus;
  category_level: CategoryLevel;
  thumbnail: string | null;
  child_category?: Category[] | null; // optional OR null
}

export interface categoryGroup {
  level1: Category | null;
  level2: Category | null;
  level3: Category | null;
}

export interface Variant {
  variant_id: string;
  title: string;
  price: number;
  quantity: number;
  description: string;
  created_date: string;
  last_modified_date: string;
  attributes: Record<string, string>;
  image_uris: string[];
  is_active: boolean;
  is_deleted: boolean;
}

export interface Product {
  product_id: string;
  title: string;
  description: string;
  brand: string;
  category_path: string;
  avg_rating: number;
  rating_count: number;
  created_date: string;
  last_modified_date: string;
  variants: Variant[];
  is_active: boolean;
  is_deleted: boolean;
}

export interface ProductCard {
  product_id?: string;
  variant_id: string;
  title: string;
  price: number;
  quantity: number;
  description?: string;
  avg_rating: number;
  rating_count: number;
  attributes: Record<string, string>;
  image_uris: string[];
  is_active?: boolean;
  is_deleted?: boolean;
}

export interface productRequest {
  store_id: string;
  category_id: string;
  title: string;
  brand: string;
  description: string;
}

export interface VariantRequest {
  title: string;
  price: number;
  quantity: number;
  description: string;
  attributes: Record<string, string>;
}

export interface ProductFilters {
  brand: string;
  categories: string[];
  rating: string;
  min_price: string;
  max_price: string;
}

export const flattenProductsAndVariants = (products: Product[]) : ProductCard[] => {
  const out: ProductCard[] = [];
  products.forEach((product: Product) => {
    (product.variants || []).forEach((v: any) => {
      const imageUris: string[] = Array.isArray(v.image_uris)
        ? v.image_uris.map((u: string) =>
            u ? (u.startsWith("http") ? u : `${API_BASE}${u}`) : ""
          )
        : [];
      out.push({
        ...v,
        image_uris: imageUris,
        title: `${product.title || ""} - ${v.title || ""}`,
        avg_rating: product.avg_rating ?? v.avg_rating ?? 0,
        rating_count: product.rating_count ?? v.rating_count ?? 0,
        product_id: product.product_id,
      });
    });
  });
  return out;
};


export function parseProductFiltersFromURL(query: string): ProductFilters {
  const params = new URLSearchParams(query);

  const brand = params.get("brand") ?? "";

  const categoriesParam = params.get("categories") ?? "";
  const categories = categoriesParam
    ? categoriesParam.split(",").map((c) => c.trim())
    : [];

  const rating = params.get("rating") ?? "";
  const min_price = params.get("min_price") ?? "";
  const max_price = params.get("max_price") ?? "";

  return {
    brand,
    categories,
    rating,
    min_price,
    max_price,
  };
}
