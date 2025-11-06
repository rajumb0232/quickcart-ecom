import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parseProductFiltersFromURL } from "../../../types/productTypes";

export interface BrandFilterProps {
  selectedBrand?: string;
  onSelect: (brand: string) => void;
  placeholder?: string;
}

// gonna replace these with real time brand list
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

export const BrandFilter: React.FC<BrandFilterProps> = ({
  selectedBrand,
  onSelect,
  placeholder = "Select Brand",
}) => {
  const [query, setQuery] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const location = useLocation();

  // set the pre selected brand as query while mounting
  useEffect(() => {
    selectedBrand && setQuery(selectedBrand);
  }, [])

  useEffect(() => {
    const fp = parseProductFiltersFromURL(location?.search);
    if(fp && fp.brand) setQuery(fp.brand);
  }, [location.search])

  const handleSelect = (brand: string) => {
    setQuery(brand);
    onSelect(brand);
    setDropdownOpen(false);
  }

  return (
    <div className="mb-4">
      <div className="relative">
        <input
          name="brand"
          value={query}
          onChange={(e) => setQuery(e.target?.value)}
          onFocus={() => setDropdownOpen(!dropdownOpen)}
          className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm"
          placeholder={placeholder}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="absolute right-2 top-2 text-gray-600"
          aria-label="Toggle brand list"
        >
          <span className="text-gray-600">{dropdownOpen ? "▴" : "▾"}</span>
        </button>
      </div>

      {/* Inline brand list - in-flow so it pushes other items down */}
      {dropdownOpen && (
        <div className="mt-2 w-full bg-white border border-gray-200 rounded shadow max-h-40 overflow-auto">
          <ul>
            {DUMMY_BRANDS.map((b) => (
              <li
                key={b}
                onClick={() => handleSelect(b)}
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BrandFilter;
