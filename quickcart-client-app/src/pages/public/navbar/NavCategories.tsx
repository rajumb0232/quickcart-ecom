// NavCategories.tsx
import React from "react";
import RadixMultiDropdown, { type MenuItem as RadixMenuItem } from "../../../components/RadixMultiDropdown";
import { useCategories } from "../../../hooks/useCategories";
import { normalizeCategories } from "../../../services/categoryService";
import type { Category } from "../../../types/productTypes";
import { isApiResponse } from "../../../types/apiResponseType";

function toMenuItems(
  level1: Category,
  level2: Category[] | undefined | null
): RadixMenuItem[] {
  if (!Array.isArray(level2)) return [];
  return level2.map((l2) => ({
    name: l2.name,
    // Navigate to /search with level 1 and level 2 category names as query parameter
    onClick: () => {
      const query = `/search?categories=${encodeURIComponent(level1.name)},${encodeURIComponent(l2.name)}`;
      window.location.href = query;
    },
    child:
      Array.isArray(l2.child_category) && l2.child_category.length > 0
        ? l2.child_category.map((l3) => ({
            name: l3.name,
            // Navigate to /search with level 1, level 2, and level 3 category names as query parameter
            onClick: () => {
              const query = `/search?categories=${encodeURIComponent(level1.name)},${encodeURIComponent(l2.name)},${encodeURIComponent(l3.name)}`;
              window.location.href = query;
            },
          }))
        : undefined,
  }));
}

export const NavCategories: React.FC = () => {
  const { data, isLoading, isError } = useCategories();
  const fetched = data && isApiResponse(data) ? data.data ?? [] : [];
  const categories = normalizeCategories(fetched);

  if (isLoading) return <div className="px-4 py-2">Loading categories…</div>;
  if (isError) return <div className="px-4 py-2 text-red-500">Failed to load categories</div>;

  return (
    <nav className="flex items-center gap-4">
      {categories.map((lvl1) => {
        const items = toMenuItems(lvl1, lvl1.child_category);
        if (!items.length) {
          return (
            <button
              key={lvl1.category_id}
              className="px-3 py-2 text-sm font-medium hover:underline"
              onClick={() => (window.location.href = `/category/${lvl1.category_id}`)}
            >
              {lvl1.name}
            </button>
          );
        }

        return (
          <RadixMultiDropdown
            key={lvl1.category_id}
            trigger={
              <div className="px-3 py-2 text-sm font-medium hover:underline">
                {lvl1.name?.toUpperCase()}
              </div>
            }
            items={items}
            width={240}
            sideWidth={260}
          />
        );
      })}
    </nav>
  );
};

export default NavCategories;
