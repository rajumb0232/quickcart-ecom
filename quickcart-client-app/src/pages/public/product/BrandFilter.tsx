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
  const [filteredBrands, setFilteredBrands] = useState<string[]>([]);

  // set the pre selected brand as query while mounting
  useEffect(() => {
    selectedBrand && setQuery(selectedBrand);
  }, [])

  useEffect(() => {
    setFilteredBrands(DUMMY_BRANDS.filter(b => b.match(query)))
  }, [query])

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
          className="border-[1.5px] border-gray-300 rounded-md w-full px-3 py-[0.6rem] text-sm"
          placeholder={placeholder}
          autoComplete="off"
          onClick={() => setDropdownOpen(!dropdownOpen)}
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
      {dropdownOpen && filteredBrands.length > 0 && (
        <div className="mt-2 w-full bg-white border border-gray-200 rounded shadow-sm max-h-40 overflow-auto">
          <ul>
            {filteredBrands.map((b) => (
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
