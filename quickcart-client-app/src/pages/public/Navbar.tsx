import React, { useEffect, useRef, useState } from "react";
import {
  FaRegUser,
  FaHeart,
  FaShoppingCart,
  FaRegListAlt,
  FaSearch,
  FaOpencart,
} from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../features/auth/authSelectors";
import { setNavHeight } from "../../features/util/screenSlice";

const navbarLinks = [
  "MEN",
  "WOMEN",
  "SMART WATCHES",
  "PREMIUM WATCHES",
  "WATCHES",
  "INTERNATIONAL BRANDS",
  "GIFTING",
  "SALE",
  "WATCH SERVICE",
  "MORE",
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);

  // Measure navbar height and save it globally on mount and resize
  useEffect(() => {
    function updateNavHeight() {
      if (navRef.current) {
        dispatch(setNavHeight(navRef.current.offsetHeight));
      }
    }

    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);
    return () => {
      window.removeEventListener("resize", updateNavHeight);
    };
  }, [dispatch]);

  const handleUnAuthorizedClicks = () => {
    if (!isAuthenticated) {
      navigate("/sign", { state: { backgroundLocation: location } });
      return;
    }
    console.log("User is authenticated — continue to feature");
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav
      ref={navRef}
      className="w-full flex flex-col bg-white fixed top-0 z-50 border border-slate-200"
    >
      {/* Top section: Brand + Search + Account/Icons */}
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 w-full">
        {/* Brand */}
        <a href="/" className="flex items-center gap-1 sm:gap-2 text-lg sm:text-2xl shrink-0">
          <FaOpencart />
          <span className="text-sm sm:text-base md:text-xl font-bold tracking-wider ml-1">
            QUICKCART
          </span>
        </a>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 mx-4 lg:mx-8 items-center max-w-2xl">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 text-sm"
              placeholder="Search"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
          </div>
        </div>

        {/* Right side container with search button and icons */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-10 shrink-0 ml-auto">
          {/* Mobile Search Button */}
          <button
            className="md:hidden text-base text-gray-900 hover:text-black hover:scale-105 transition-all"
            onClick={toggleSearch}
            aria-label="Search"
            title="Search"
          >
            <FaSearch />
          </button>

          {/* Icons - Responsive */}
          {[
            { icon: <FaRegUser />, label: "Account" },
            { icon: <FaHeart />, label: "Wishlist" },
            { icon: <FaShoppingCart />, label: "Cart" },
            { icon: <FaRegListAlt />, label: "Track Order" },
          ].map(({ icon, label }, idx) => (
            <button
              key={idx}
              className="flex flex-col items-center text-gray-900 hover:text-black hover:scale-105 transition-all ease-in-out duration-200 cursor-pointer"
              title={label}
              onClick={handleUnAuthorizedClicks}
            >
              <span className="text-lg mx-1.5 md:mx-0 sm:text-lg md:text-xl mb-0 sm:mb-1">{icon}</span>
              <span className="hidden lg:block text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Search Bar (Collapsible) */}
      {isSearchOpen && (
        <div className="md:hidden px-3 pb-2">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full border border-gray-200 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 text-sm"
              placeholder="Search"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
          </div>
        </div>
      )}

      {/* Location check */}
      <div className="flex items-center bg-[#faf7f2] py-1.5 sm:py-2 px-3 sm:px-4 md:px-6 gap-2">
        <MdOutlineLocationOn className="text-amber-600 text-sm sm:text-base" />
        <span className="text-gray-800 text-xs sm:text-sm">
          Check availability by location
        </span>
        <span className="ml-auto text-gray-500 text-xs sm:text-sm cursor-pointer">→</span>
      </div>

      {/* Navigation Links - Horizontally scrollable on all screens */}
      <div className="flex flex-row flex-nowrap text-nowrap flex-1 overflow-x-auto scrollbar-hide gap-4 md:gap-6 xl:gap-8 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2.5 sm:py-3">
        {navbarLinks.map((link, idx) => (
          <button
            key={idx}
            className="text-gray-700 hover:text-black transition px-2 whitespace-nowrap"
          >
            {link}
          </button>
        ))}
      </div>

      {/* Hide scrollbar style */}
      <style>
        {`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </nav>
  );
};

export default Navbar;