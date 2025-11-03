import type React from "react";
import { FaOpencart } from "react-icons/fa";

export const NavLogo: React.FC = () => {
  return (
    <>
      <a
        href="/"
        className="flex items-center gap-1 sm:gap-2 text-lg sm:text-2xl shrink-0"
      >
        <FaOpencart />
        <span className="text-sm sm:text-base md:text-xl font-bold tracking-wider ml-1">
          QUICKCART
        </span>
      </a>
    </>
  );
};
