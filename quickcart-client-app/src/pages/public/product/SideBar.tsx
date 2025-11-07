import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  parseProductFiltersFromURL,
  type ProductFilters,
} from "../../../types/productTypes";
import BrandFilter from "./BrandFilter";
import CategoryFilter from "./CategoryFilter";
import {
  Sliders,
  Search,
  DollarSign,
  Star,
  RotateCcw,
  TrendingUp,
  Filter,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  selectNavHeight,
  selectScreenHeight,
} from "../../../features/util/screenSelector";

export const SideBar: React.FC = () => {
  const navHeight = useSelector(selectNavHeight) ?? 0;
  const screenHeight = useSelector(selectScreenHeight);

  const [viewHeight, setViewHeight] = useState<number>(600);
  useEffect(() => {
    const base =
      typeof screenHeight === "number"
        ? screenHeight
        : window?.innerHeight ?? 800;
    setViewHeight(Math.max(600, base - (navHeight || 0)));
  }, [screenHeight, navHeight]);

  const navigate = useNavigate();
  const location = useLocation();
  

  const [filters, setFilters] = useState<ProductFilters>({
    brand: "",
    categories: [],
    rating: "",
    min_price: "",
    max_price: "",
  });

  // category picker state
  const [categoryOpen, setCategoryOpen] = useState(false);

  // handler when user picks a brand from list
  const handleBrandPick = (b: string) => {
    setFilters((p) => ({ ...p, brand: b }));
  };

  useEffect(() => {
    const fp = parseProductFiltersFromURL(location?.search);
    if (fp) {
      setFilters(fp);
    }
  }, [location.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };

  const handleSearch = () => {
    const q = new URLSearchParams();
    if (filters.brand) q.append("brand", filters.brand);
    if (filters.rating) q.append("rating", filters.rating);
    if (filters.min_price) q.append("min_price", filters.min_price);
    if (filters.max_price) q.append("max_price", filters.max_price);
    if (filters.categories?.length)
      q.append("categories", (filters.categories as string[]).join(","));

    navigate(`/search?${q.toString()}`);
  };

  const handleClearFilters = () => {
    setFilters({
      brand: "",
      categories: [],
      rating: "",
      min_price: "",
      max_price: "",
    });
  };

  const hasActiveFilters =
    filters.brand ||
    filters.categories?.length > 0 ||
    filters.rating ||
    filters.min_price ||
    filters.max_price;

  return (
    <aside className="w-80 bg-linear-to-b from-white to-gray-50 border-r-2 border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b-2 border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sliders size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
              <p className="text-xs text-gray-500">Refine your search</p>
            </div>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="w-full mt-3 flex items-center justify-center gap-2 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-all font-medium"
          >
            <RotateCcw size={14} />
            Clear All Filters
          </button>
        )}
      </div>

      {/* Scrollable Filter Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Brand Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
              <Filter size={14} className="text-amber-600" />
            </div>
            <h5 className="font-semibold text-gray-900 text-sm">Brand</h5>
          </div>
          <BrandFilter
            selectedBrand={filters.brand}
            onSelect={handleBrandPick}
          />
        </div>

        {/* Category Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-teal-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={14} className="text-teal-600" />
            </div>
            <h5 className="font-semibold text-gray-900 text-sm">Category</h5>
          </div>
          <CategoryFilter
            isOpen={categoryOpen}
            onToggle={() => setCategoryOpen((s) => !s)}
            onConfirm={(names) => {
              setFilters((p) => ({ ...p, categories: names }));
            }}
            onClear={() => setFilters((p) => ({ ...p, categories: [] }))}
          />
        </div>

        {/* Price Range */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign size={14} className="text-green-600" />
            </div>
            <h5 className="font-semibold text-gray-900 text-sm">Price Range</h5>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">
                  Minimum
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm font-medium">₹</span>
                  </div>
                  <input
                    type="number"
                    name="min_price"
                    value={filters.min_price}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                    placeholder="0"
                    min={0}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">
                  Maximum
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm font-medium">₹</span>
                  </div>
                  <input
                    type="number"
                    name="max_price"
                    value={filters.max_price}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                    placeholder="∞"
                    min={0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star size={14} className="text-yellow-600" />
            </div>
            <h5 className="font-semibold text-gray-900 text-sm">Rating</h5>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((n) => (
              <button
                key={n}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    rating: prev.rating === String(n) ? "" : String(n),
                  }))
                }
                className={`w-full px-4 py-3 rounded-xl border-2 flex items-center justify-between transition-all ${
                  filters.rating === String(n)
                    ? "bg-linear-to-r from-yellow-400 to-amber-400 border-yellow-500 shadow-md"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex ${
                      filters.rating === String(n)
                        ? "text-white"
                        : "text-yellow-500"
                    }`}
                  >
                    {[...Array(n)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={
                          filters.rating === String(n) ? "white" : "#EAB308"
                        }
                        className={
                          filters.rating === String(n)
                            ? "text-white"
                            : "text-yellow-500"
                        }
                      />
                    ))}
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      filters.rating === String(n)
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {n} Star{n > 1 ? "s" : ""}
                  </span>
                </div>
                {filters.rating === String(n) && (
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Button - Fixed at Bottom */}
      <div className="px-6 py-4 border-t-2 border-gray-200 bg-white">
        <button
          onClick={handleSearch}
          className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg group"
        >
          <Search
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="text-base">Apply Filters</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
