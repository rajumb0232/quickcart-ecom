import React from "react";
import {
  PieChart,
  ShoppingBag,
  Users,
  Grid3x3,
  Store,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectNavHeight, selectScreenHeight } from "../../features/util/screenSelector";
import { selectViewStore } from "../../features/product/sellerStoreSelectors";

// A mapping from nav label to route param path
const labelToPathMap: Record<string, string> = {
  Dashboard: "/seller/dashboard",
  Store: "/seller/store",
  "List Product": "/list-product",
  "Manage Products": "/seller/manage-products",
  Reports: "/seller/reports",
  Profile: "/seller/profile",
  Settings: "/seller/settings",
};

const DashboardSideBar: React.FC = () => {
  const navHeight = useSelector(selectNavHeight);
  const screenHeight = useSelector(selectScreenHeight);
  const sidebarHeight = screenHeight - navHeight;
  const viewingStore = useSelector(selectViewStore);

  return (
    <div
      className="bg-white w-64 border-r border-gray-200 flex flex-col"
      style={{ height: sidebarHeight }}
    >
      <div className="p-6 border-b border-gray-100 shrink-0">
        <h1 className="text-xl font-bold text-gray-900">{viewingStore ? viewingStore.name : "Store"}</h1>
      </div>

      <nav
        className="flex-1 py-4 overflow-y-auto"
        style={{ scrollbarWidth: "none" /* Firefox */ }}
      >
        <div
          className="px-3"
          style={{
            height: sidebarHeight - 6 * 24, // approx padding and header height in px
          }}
        >
          <NavItem icon={<PieChart size={20} />} label="Dashboard" />
          <NavItem icon={<Store size={20} />} label="Store" />
          <NavItem icon={<ShoppingBag size={20} />} label="List Product" />
          <NavItem icon={<Grid3x3 size={20} />} label="Manage Products" />
          <NavItem icon={<TrendingUp size={20} />} label="Reports" />
          <NavItem icon={<Users size={20} />} label="Profile" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </div>

        {/* Hide scrollbar for Webkit browsers */}
        <style>{`
          nav::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
        `}</style>
      </nav>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasArrow?: boolean;
  hasBadge?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  active,
  hasArrow,
  hasBadge,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const path = labelToPathMap[label];
    if (path) {
      navigate(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full flex items-center justify-between px-3 py-3 mb-1 rounded-lg
        transition-colors duration-150
        ${
          active
            ? "bg-amber-400 text-gray-900"
            : "text-gray-600 hover:bg-[#faf7f2]"
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={active ? "text-gray-900" : "text-gray-600"}>{icon}</div>
        <span className="text-sm font-medium">{label}</span>
      </div>

      <div className="flex items-center gap-2">
        {hasBadge && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
        {hasArrow && <span className="text-gray-400">›</span>}
      </div>
    </button>
  );
};

export default DashboardSideBar;
