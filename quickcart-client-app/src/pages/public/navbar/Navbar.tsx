import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectShowCategories } from "../../../features/util/screenSelector";
import { setNavHeight } from "../../../features/util/screenSlice";
import { NavLogo } from "./NavLogo";
import { SearchBar } from "./SearchBar";
import { MainMenu } from "./MainMenu";
import { SetLocation } from "./SetLocation";
import NavCategories from "./NavCategories";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navRef = useRef<HTMLElement>(null);
  const showCategories = useSelector(selectShowCategories);

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
      className="w-full flex flex-col bg-white fixed top-0 z-50 border-b border-gray-200"
    >
      {/* Top section: Brand + Search + Account/Icons */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 w-full">
        {/* Brand Logo */}
        <NavLogo />

        {/* Desktop Search Bar */}
        <SearchBar />

        {/* Right side container with search button and icons */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 shrink-0 ml-auto">
          {/* Mobile Search Button */}
          <SearchBar isMobile />

          {/* Main Menu Buttons */}
          <MainMenu />
        </div>
      </div>

      {/* Select and Set Location Option */}
      {/* <SetLocation /> */}

      {/* Render all Top Categories */}
      {showCategories && <NavCategories />}
    </nav>
  );
};

export default Navbar;