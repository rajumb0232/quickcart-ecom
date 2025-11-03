import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  isMobile?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // TODO: Add your API integration here
    console.log("Search query:", value);
    // Example: debounced API call
    // debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle search submission
    console.log("Search submitted:", searchQuery);
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  // Mobile version with toggle button
  if (isMobile) {
    return (
      <>
        <button
          className="md:hidden text-base text-gray-900 hover:text-black hover:scale-105 transition-all"
          onClick={toggleSearch}
          aria-label="Search"
          title="Search"
        >
          <FaSearch />
        </button>

        {isOpen && (
          <div className="md:hidden px-3 pb-2 absolute top-full left-0 right-0 bg-white">
            <form onSubmit={handleSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 text-sm"
                placeholder="Search"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
            </form>
          </div>
        )}
      </>
    );
  }

  // Desktop version
  return (
    <div className="hidden md:flex flex-1 mx-4 lg:mx-8 items-center max-w-2xl">
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 text-sm"
          placeholder="Search"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
      </form>
    </div>
  );
};