import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNavHeight } from "../../features/util/screenSlice";
import { NavCategories } from "./navbar/NavCategories";
import { SetLocation } from "./navbar/SetLocation";
import { MainMenu } from "./navbar/MainMenu";
import { NavLogo } from "./navbar/NavLogo";
import { SearchBar } from "./navbar/SearchBar";
import { selectShowCategories } from "../../features/util/screenSelector";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navRef = useRef<HTMLElement>(null);
  const showCategories = useSelector(selectShowCategories);

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

  return (
    <nav
      ref={navRef}
      className="w-full flex flex-col bg-white fixed top-0 z-50 border border-slate-200"
    >
      {/* Top section: Brand + Search + Account/Icons */}
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 w-full">
       
        {/* Brand Logo */}
        <NavLogo />

        {/* Desktop Search Bar */}
        <SearchBar />

        {/* Right side container with search button and icons */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-10 shrink-0 ml-auto">
          {/* Mobile Search Button */}
          <SearchBar isMobile />

          {/* Main Menu Buttons */}
          <MainMenu />
        </div>
      </div>

      {/* Select and Set Location Option */}
      <SetLocation />

      {/* Render all Top Categories */}
      {showCategories && (<NavCategories/>)}

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