import React, { useEffect, useState } from "react";
import {
  parseProductFiltersFromURL,
  type Category,
  type categoryGroup,
} from "../../../types/productTypes";
import { useCategories } from "../../../hooks/useCategories";
import { isApiResponse } from "../../../types/apiResponseType";
import { normalizeCategories } from "../../../services/categoryService";
import { sanitizeCategorySelection } from "../../../services/categoryGroupSanitizer";
import { useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers,
  Loader2,
} from "lucide-react";

export interface CategoryFilterProps {
  isOpen: boolean;
  onToggle: () => void;
  onConfirm: (selectedNames: string[]) => void;
  onClear?: () => void;
  setChildMostId?: (categoryId: string | null) => void;
  priorSelCat?: string[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  isOpen,
  onToggle,
  onConfirm,
  onClear,
  setChildMostId,
  priorSelCat,
}: CategoryFilterProps) => {
  const { data, isLoading, isError } = useCategories();
  const fetched = data && isApiResponse(data) ? data.data ?? [] : [];
  const categories = normalizeCategories(fetched);
  const location = useLocation();

  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [selL1, setSelL1] = useState<Category | null>(null);
  const [selL2, setSelL2] = useState<Category | null>(null);
  const [selL3, setSelL3] = useState<Category | null>(null);
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    setPath(
      [selL1?.name, selL2?.name, selL3?.name].filter(Boolean).join(" / ") ||
        "Select Category"
    );
    confirmNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selL1, selL2, selL3]);

  const confirmNames = () => {
    const names = [selL1?.name, selL2?.name, selL3?.name].filter(
      Boolean
    ) as string[];
    onConfirm(names);
  };

  useEffect(() => {
    if (!priorSelCat || priorSelCat.length < 0) {
      const fp = parseProductFiltersFromURL(location?.search);
      const resolvedCats = fp?.categories;
      if (resolvedCats && resolvedCats.length > 0)
        updateAllCategories(resolvedCats);
    } else {
      updateAllCategories(priorSelCat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const updateAllCategories = (arr: string[]) => {
    const pre: categoryGroup = sanitizeCategorySelection(categories, arr);
    setSelL1(pre.level1);
    setSelL2(pre.level2);
    setSelL3(pre.level3);
  };

  function resetAll() {
    setSelL1(null);
    setSelL2(null);
    setSelL3(null);
    setLevel(1);
    onClear?.();
  }

  function handlePick(item: Category) {
    if (item.category_level === level) {
      if (level === 1) {
        setSelL1(item);
        setSelL2(null);
        setSelL3(null);
        setLevel(2);
      } else if (level === 2 && selL1 != null) {
        setSelL2(item);
        setSelL3(null);
        setLevel(3);
      } else if (selL1 != null && selL2 != null) {
        setSelL3(item);
        setChildMostId?.(item.category_id);
        onToggle();
      }
    }
  }

  function goBack() {
    if (level === 3) setLevel(2);
    else if (level === 2) setLevel(1);
  }

  function goForward() {
    if (level === 1) setLevel(2);
    else if (level === 2) setLevel(3);
  }

  const currentList =
    level === 1
      ? categories
      : level === 2
      ? selL1?.child_category
      : selL2?.child_category;
  const currentTitle =
    level === 1
      ? "Select Categories"
      : level === 2
      ? "Select in " + selL1?.name
      : "Select in " + selL2?.name;

  return (
    <div className="mb-4">
      {/* Select button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (!isOpen) setLevel(1);
            onToggle();
          }}
          className="w-full text-left border-2 border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between bg-white hover:border-teal-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all group"
          disabled={isLoading}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors">
              <Layers size={16} className="text-teal-600" />
            </div>
            <span className={`text-sm font-medium ${path === "Select Category" ? "text-gray-400" : "text-gray-900"}`}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Loading...
                </span>
              ) : (
                path
              )}
            </span>
          </div>
          {isOpen ? (
            <ChevronUp size={20} className="text-gray-600" />
          ) : (
            <ChevronDown size={20} className="text-gray-600" />
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-linear-to-r from-teal-50 to-cyan-50">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-teal-600" />
                <span className="text-sm font-semibold text-gray-900">
                  {currentTitle}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={goBack}
                  disabled={level === 1}
                  className="p-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Go back"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={goForward}
                  disabled={level === 3 || (level === 1 && !selL1) || (level === 2 && !selL2)}
                  className="p-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Go forward"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={resetAll}
                  className="p-2 border-2 border-red-200 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                  title="Clear selection"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-64 overflow-auto p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <Loader2 size={20} className="animate-spin mr-2" />
                  <span className="text-sm">Loading categories...</span>
                </div>
              ) : isError ? (
                <div className="text-center py-8">
                  <div className="text-sm text-red-600 font-medium">
                    Failed to load categories
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Please try again</p>
                </div>
              ) : currentList && currentList.length ? (
                <ul className="space-y-1">
                  {currentList.map((it) => {
                    const isActive =
                      (level === 1 && selL1?.category_id === it.category_id) ||
                      (level === 2 && selL2?.category_id === it.category_id) ||
                      (level === 3 && selL3?.category_id === it.category_id);

                    return (
                      <li
                        key={it.category_id}
                        onClick={() => handlePick(it)}
                        className={`px-4 py-3 rounded-lg cursor-pointer text-sm font-medium transition-all ${
                          isActive
                            ? "bg-linear-to-r from-teal-500 to-teal-600 text-white shadow-md"
                            : "hover:bg-gray-50 text-gray-700 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{it.name}</span>
                          {it.child_category && it.child_category.length > 0 && (
                            <ChevronRight
                              size={16}
                              className={isActive ? "text-white" : "text-gray-400"}
                            />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <div className="text-sm text-gray-400">No items available</div>
                  <button
                    onClick={goBack}
                    className="mt-2 text-xs text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Go back to previous level
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;