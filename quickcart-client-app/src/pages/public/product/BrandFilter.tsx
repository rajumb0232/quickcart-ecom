import React from "react";

export interface BrandFilterProps {
  selectedBrand: string;
  onChange: (value: string) => void;
  onSelect: (brand: string) => void;
  isBrandOpen: boolean;
  onToggle?: () => void;
  brandList: string[];
  placeholder?: string;
}

export const BrandFilter: React.FC<BrandFilterProps> = ({
  selectedBrand,
  onChange,
  onSelect,
  isBrandOpen,
  onToggle,
  brandList,
  placeholder = "Select Brand",
}) => {
  // local filter: use the selectedBrand string as the query (controlled component)
  const query = selectedBrand ?? "";

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-xs mb-2">Brand</label>
      <div className="relative">
        <input
          name="brand"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => onToggle?.()}
          className="border border-gray-300 rounded-md w-full px-3 py-2 text-sm"
          placeholder={placeholder}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => onToggle?.()}
          className="absolute right-2 top-2 text-gray-600"
          aria-label="Toggle brand list"
        >
          ▾
        </button>
      </div>

      {/* Inline brand list - in-flow so it pushes other items down */}
      {isBrandOpen && (
        <div className="mt-2 w-full bg-white border border-gray-200 rounded shadow max-h-40 overflow-auto">
          <ul>
            {brandList.map((b) => (
              <li
                key={b}
                onClick={() => onSelect(b)}
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
