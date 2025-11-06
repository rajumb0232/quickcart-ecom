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
import { IoCaretBackOutline, IoCaretForward } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

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
      [selL1?.name, selL2?.name, selL3?.name].filter(Boolean).join("/") ||
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
    console.log("prior cats: ", priorSelCat);
    if (!priorSelCat || priorSelCat.length < 0) {
      const fp = parseProductFiltersFromURL(location?.search);
      const resolvedCats = fp?.categories;
      if (resolvedCats && resolvedCats.length > 0)
        updateAllCategories(resolvedCats);
    } else {
      updateAllCategories(priorSelCat)
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

      {/* Select button: always full width of its parent */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (!isOpen) setLevel(1);
            onToggle();
          }}
          className="w-full text-left border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between bg-white"
          disabled={isLoading}
          style={{ zIndex: 10 }}
        >
          <span className="text-sm">{isLoading ? "Loading..." : path}</span>
          <span className="text-gray-600">{isOpen ? "▴" : "▾"}</span>
        </button>

        {/* Dropdown aligned to the same width as the parent (left:0 right:0) */}
        {isOpen && (
          <div className="mt-2 w-full bg-white border border-gray-200 rounded shadow-sm max-h-40 overflow-auto">
            <div className="flex items-center justify-between mb-2 p-2">
              <div className="text-sm font-medium">{currentTitle}</div>
              <div className="flex gap-2">
                <button
                  onClick={goBack}
                  className="text-sm px-2 py-1 border rounded text-gray-700"
                >
                  <IoCaretBackOutline />
                </button>
                <button
                  onClick={goForward}
                  className="text-sm px-2 py-1 border rounded text-gray-700"
                >
                  <IoCaretForward />
                </button>
                <button
                  onClick={resetAll}
                  className="text-sm px-2 py-1 border rounded text-gray-500"
                >
                  <MdDelete />
                </button>
              </div>
            </div>

            <div className="max-h-48 overflow-auto">
              {isLoading ? (
                <div className="text-xs text-gray-500">
                  Loading categories...
                </div>
              ) : isError ? (
                <div className="text-xs text-red-500">
                  Failed to load categories.
                </div>
              ) : currentList && currentList.length ? (
                <ul>
                  {currentList.map((it) => {
                    const isActive =
                      (level === 1 && selL1?.category_id === it.category_id) ||
                      (level === 2 && selL2?.category_id === it.category_id) ||
                      (level === 3 && selL3?.category_id === it.category_id);

                    return (
                      <li
                        key={it.category_id}
                        onClick={() => handlePick(it)}
                        className={`px-3 py-3 rounded cursor-pointer text-sm mb-1 ${
                          isActive ? "bg-green-100" : "hover:bg-gray-50"
                        }`}
                      >
                        {it.name}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-xs text-gray-400">No items — go back.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
