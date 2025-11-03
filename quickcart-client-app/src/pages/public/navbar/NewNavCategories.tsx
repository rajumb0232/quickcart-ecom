// NavCategories.tsx
import React from "react";
import RadixMultiDropdown, { type MenuItem as RadixMenuItem } from "../../../components/RadixMultiDropdown";
import { useCategories } from "../../../hooks/useCategories";
import type { Category } from "../../../types/productTypes";
import { isApiResponse } from "../../../types/apiResponseType";

function normalizeCategories(raw?: Category[] | null): Category[] {
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

function toMenuItems(level2: Category[] | undefined | null): RadixMenuItem[] {
  if (!Array.isArray(level2)) return [];
  return level2.map((l2) => ({
    name: l2.name,
    // navigate to a category page when clicked
    onClick: () => {
      window.location.href = `/category/${l2.category_id}`;
    },
    // map children (level 3) to submenu items if present
    child:
      Array.isArray(l2.child_category) && l2.child_category.length > 0
        ? l2.child_category.map((l3) => ({
            name: l3.name,
            onClick: () => {
              window.location.href = `/category/${l3.category_id}`;
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
        const items = toMenuItems(lvl1.child_category);
        // If no children, render a simple link button
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

        // Otherwise render a dropdown trigger + items
        return (
          <RadixMultiDropdown
            key={lvl1.category_id}
            trigger={
              <button className="px-3 py-2 text-sm font-medium hover:underline">
                {lvl1.name}
              </button>
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
