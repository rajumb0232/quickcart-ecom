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

export const NavCategories: React.FC = () => {
  return (
    <>
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
    </>
  );
};
