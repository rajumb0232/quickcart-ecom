import React from "react";
import RadixMultiDropdown, { type MenuItem as RadixMenuItem } from "../../../components/RadixMultiDropdown";
import { useCategories } from "../../../hooks/useCategories";
import { normalizeCategories } from "../../../services/categoryService";
import type { Category } from "../../../types/productTypes";
import { isApiResponse } from "../../../types/apiResponseType";
import { Loader2, AlertCircle } from "lucide-react";

function toMenuItems(
  level1: Category,
  level2: Category[] | undefined | null
): RadixMenuItem[] {
  if (!Array.isArray(level2)) return [];
  return level2.map((l2) => ({
    name: l2.name,
    onClick: () => {
      const query = `/search?categories=${encodeURIComponent(level1.name)},${encodeURIComponent(l2.name)}`;
      window.location.href = query;
    },
    child:
      Array.isArray(l2.child_category) && l2.child_category.length > 0
        ? l2.child_category.map((l3) => ({
            name: l3.name,
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-3 bg-gray-50 border-t border-gray-200">
        <Loader2 size={16} className="animate-spin text-teal-600" />
        <span className="text-sm text-gray-600">Loading categories…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-3 bg-red-50 border-t border-red-200">
        <AlertCircle size={16} className="text-red-600" />
        <span className="text-sm text-red-600">Failed to load categories</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-1 px-4 sm:px-6 md:px-8 py-1 border-t border-gray-200 overflow-x-auto scrollbar-hide">
      {categories.map((lvl1) => {
        const items = toMenuItems(lvl1, lvl1.child_category);
        if (!items.length) {
          return (
            <button
              key={lvl1.category_id}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg whitespace-nowrap transition-all"
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
              <div className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg whitespace-nowrap cursor-pointer transition-all">
                {lvl1.name?.toUpperCase()}
              </div>
            }
            items={items}
            width={240}
            sideWidth={260}
          />
        );
      })}
      
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </nav>
  );
};

export default NavCategories;
