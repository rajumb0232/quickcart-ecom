import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { parseProductFiltersFromURL } from "../../../types/productTypes";
import { useGetBrands } from "../../../hooks/useProducts";
import { isApiResponse } from "../../../types/apiResponseType";
import { Tag, Search, ChevronDown, ChevronUp, Plus } from "lucide-react";

export interface BrandFilterProps {
  selectedBrand?: string;
  onSelect: (brand: string) => void;
  placeholder?: string;
}

export const BrandFilter: React.FC<BrandFilterProps> = ({
  selectedBrand,
  onSelect,
  placeholder = "Select Brand",
}) => {
  const { data } = useGetBrands();
  const brands = data && isApiResponse(data) ? data.data : null;
  const [query, setQuery] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const location = useLocation();
  const [filteredBrands, setFilteredBrands] = useState<string[]>([]);

  useEffect(() => {
    selectedBrand && setQuery(selectedBrand);
  }, []);

  useEffect(() => {
    if (brands) setFilteredBrands(brands.filter((b) => b.toLowerCase().includes(query.toLowerCase())));
  }, [query, brands]);

  useEffect(() => {
    const fp = parseProductFiltersFromURL(location?.search);
    if (fp && fp.brand) setQuery(fp.brand);
  }, [location.search]);

  const handleSelect = (brand: string) => {
    setQuery(brand);
    onSelect(brand);
    setDropdownOpen(false);
  };

  return (
    <div className="mb-4">
      <div className="relative">
        {/* Input field */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            name="brand"
            value={query}
            onChange={(e) => setQuery(e.target?.value)}
            className="border-2 border-gray-200 rounded-xl w-full pl-12 pr-12 py-3 text-sm font-medium focus:border-teal-500 focus:ring-4 focus:ring-teal-100 hover:border-teal-300 transition-all outline-none text-slate-700"
            placeholder={placeholder}
            autoComplete="off"
            onClick={() => setDropdownOpen(true)}
          />
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle brand list"
          >
            {dropdownOpen ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-64 overflow-hidden">
          <div className="p-3 border-b border-gray-200 bg-linear-to-r from-amber-50 to-orange-50 hover:border-emerald-300">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-amber-600" />
              <span className="text-sm font-semibold text-gray-900">
                Select Brand
              </span>
              <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full ml-auto">
                {filteredBrands.length} available
              </span>
            </div>
          </div>
          
          <div className="max-h-52 overflow-auto p-2">
            <ul className="space-y-1">
              {filteredBrands.map((b) => (
                <li
                  key={b}
                  onClick={() => handleSelect(b)}
                  className={`px-4 py-3 rounded-lg cursor-pointer text-sm font-medium transition-all ${
                    query === b
                      ? "bg-linear-to-r from-amber-400 to-orange-400 text-white shadow-md"
                      : "hover:bg-gray-50 text-gray-700 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Tag size={14} className={query === b ? "text-white" : "text-gray-400"} />
                    <span>{b}</span>
                  </div>
                </li>
              ))}
              {filteredBrands.length === 0 && query && (
                <li
                  onClick={() => handleSelect(query)}
                  className="px-4 py-3 rounded-lg cursor-pointer hover:bg-teal-50 transition-all border-2 border-dashed border-teal-300"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                      <Plus size={14} className="text-teal-600" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 font-medium">Add new brand:</span>
                      <span className="text-sm font-semibold text-gray-900 ml-2">{query}</span>
                    </div>
                  </div>
                </li>
              )}
              {filteredBrands.length === 0 && !query && (
                <li className="px-4 py-8 text-center text-sm text-gray-400">
                  Start typing to search brands
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandFilter;