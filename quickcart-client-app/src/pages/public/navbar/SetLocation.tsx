import { MdOutlineLocationOn } from "react-icons/md";

export const SetLocation: React.FC = () => {
  return (
    <>
      {/* Location check */}
      <div className="flex items-center bg-gray-100 py-1.5 sm:py-2 px-3 sm:px-4 md:px-6 gap-2">
        <MdOutlineLocationOn className="text-amber-600 text-sm sm:text-base" />
        <span className="text-gray-800 text-xs sm:text-sm">
          Check availability by location
        </span>
        <span className="ml-auto text-gray-500 text-xs sm:text-sm cursor-pointer">
          →
        </span>
      </div>
    </>
  );
};
