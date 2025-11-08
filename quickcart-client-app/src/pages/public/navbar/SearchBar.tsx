import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  isMobile?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    console.log("Search query:", value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  // Mobile version with toggle button
  if (isMobile) {
    return (
      <>
        <button
          className="md:hidden p-2 hover:bg-teal-50 rounded-lg transition-colors"
          onClick={toggleSearch}
          aria-label="Search"
          title="Search"
        >
          <Search size={20} className="text-gray-700" />
        </button>

        {isOpen && (
          <div className="md:hidden px-4 pb-3 absolute top-full left-0 right-0 bg-white shadow-lg border-b border-gray-200">
            <form onSubmit={handleSubmit} className="relative w-full">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-11 pr-10 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 text-gray-700 text-sm transition-all"
                  placeholder="Search products..."
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </>
    );
  }

  // Desktop version
  return (
    <div className="hidden md:flex flex-1 mx-6 lg:mx-12 items-center max-w-3xl">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 pr-10 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 text-gray-700 text-sm transition-all hover:border-gray-300"
            placeholder="Search for products, brands and more..."
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-400" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};