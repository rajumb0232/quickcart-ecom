
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
