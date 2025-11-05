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
  attributes: {
    fit: string;
    size: string;
    type: string;
    color: string;
    "Care Instruction": string;
  };
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

export interface CreateProduct {
  store_id: string,
  category_id: string,
  title: string,
  brand: string,
  description: string
}

export interface ProductFilters {
  brand: string;
  categories: string[];
  rating: string;
  min_price: string;
  max_price: string;
}

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