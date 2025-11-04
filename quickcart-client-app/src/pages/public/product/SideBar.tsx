import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  parseProductFiltersFromURL,
  type ProductFilters,
} from "../../../types/productTypes";
import BrandFilter from "./BrandFilter";
import CategoryFilter from "./CategoryFilter";

const DUMMY_BRANDS = [
  "Levis",
  "Nike",
  "Adidas",
  "H&M",
  "Zara",
  "Pantaloons",
  "Turtle",
  "Red Taper",
];
/* -------------------------------------------------------- */

export const SideBar: React.FC = () => {
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

  // brand suggestions
  const [brandOpen, setBrandOpen] = useState(false);

  // handler when user picks a brand from list
  const handleBrandPick = (b: string) => {
    setFilters((p) => ({ ...p, brand: b })); // selected canonical brand
    setBrandOpen(false);
  };

  // handler when user types in input
  const handleBrandChange = () => {
    // don't mark as selected until user clicks a list item
    setFilters((p) => ({ ...p, brand: "" }));
    setBrandOpen(true);
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

  return (
    // sidebar becomes a column flex so we can pin the search button to the bottom
    <aside className="w-72 bg-white border-r border-gray-200 p-5 flex flex-col h-screen">
      <h3 className="font-semibold text-gray-900 mb-4 text-lg">
        Apply Filters
      </h3>

      {/* scrollable area that will push the search button to the bottom */}
      <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden pr-1">
        {/* Brand input */}
        <BrandFilter
          brandList={DUMMY_BRANDS}
          isBrandOpen={brandOpen}
          selectedBrand={filters.brand}
          onChange={handleBrandChange} // receives a string
          onSelect={handleBrandPick} // receives the selected brand string
          onToggle={() => setBrandOpen((s) => !s)}
        />

        {/* Category single-column stepper rendered inline */}

        <CategoryFilter
          isOpen={categoryOpen}
          onToggle={() => setCategoryOpen((s) => !s)}
          onConfirm={(names) => {
            setFilters((p) => ({ ...p, categories: names }));
            // setCategoryOpen(false);
          }}
          onClear={() => setFilters((p) => ({ ...p, categories: [] }))}
        />

        {/* Price */}
        <div className="mb-4">
          <label className="block text-gray-700 text-xs mb-2">
            Set Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">Min</div>
              <div className="flex items-center border border-gray-300 rounded-md px-2">
                <span className="text-sm mr-2">₹</span>
                <input
                  type="number"
                  name="min_price"
                  value={filters.min_price}
                  onChange={handleInputChange}
                  className="w-full py-2 text-sm"
                  min={0}
                />
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Max</div>
              <div className="flex items-center border border-gray-300 rounded-md px-2">
                <span className="text-sm mr-2">₹</span>
                <input
                  type="number"
                  name="max_price"
                  value={filters.max_price}
                  onChange={handleInputChange}
                  className="w-full py-2 text-sm"
                  min={0}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="block text-gray-700 text-xs mb-2">
            Select Rating
          </label>
          <div className="flex flex-col gap-2">
            {[5, 4, 3, 2, 1].map((n) => (
              <button
                key={n}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    rating: prev.rating === String(n) ? "" : String(n),
                  }))
                }
                className={`px-2 py-1 rounded border flex items-center gap-2 transition-colors ${
                  filters.rating === String(n)
                    ? "bg-yellow-100 border-yellow-400"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {/* Render stars for the given count */}
                <span>
                  {[...Array(n)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </span>
                <span className="ml-2 text-xs text-gray-700">{n}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add any additional filters below; they will naturally flow */}
      </div>

      {/* Search - fixed at the bottom of the sidebar */}
      <div className="mt-4">
        <button
          onClick={handleSearch}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2 rounded font-semibold flex items-center justify-center gap-2"
        >
          <span>🔍</span>
          <span>Search</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
