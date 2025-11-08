import { MapPin, ChevronRight } from "lucide-react";

export const SetLocation: React.FC = () => {
  return (
    <div className="flex items-center bg-linear-to-r from-amber-50 to-orange-50 py-2.5 px-4 sm:px-6 md:px-8 gap-2 border-y border-amber-100 hover:from-amber-100 hover:to-orange-100 transition-all cursor-pointer group">
      <div className="">
        <MapPin size={16} className="text-amber-600" />
      </div>
      <span className="text-gray-800 text-sm font-medium">
        Check availability by location
      </span>
      <ChevronRight size={16} className="ml-auto text-gray-500 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
    </div>
  );
};