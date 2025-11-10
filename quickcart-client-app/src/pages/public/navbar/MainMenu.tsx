import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectRoles,
} from "../../../features/auth/authSelectors";
import RadixMultiDropdown, {
  type MenuItem,
} from "../../../components/RadixMultiDropdown";
import {
  User,
  Heart,
  ShoppingCart,
  Settings,
  Package,
  Tag,
  CreditCard,
  LogIn,
  LogOut,
  Store,
  ShieldCheck,
  HelpCircle,
  Info,
  MoreVertical,
} from "lucide-react";
import { useCreateSellerProfile } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { logout } from "../../../features/auth/authSlice";
import { clearTokens } from "../../../services/tokenStorage";

export const MainMenu: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRoles = useSelector(selectRoles);
  const navigate = useNavigate();
  const location = useLocation();

  const createSellerProfileMutation = useCreateSellerProfile();
  const dispatch = useDispatch();

  const accountMenu: MenuItem[] = [
    {
      name: "My Profile",
      icon: <User size={18} />,
      onClick: () => secureNavigate("/profile"),
    },
    {
      name: "Orders",
      icon: <Package size={18} />,
      onClick: () => secureNavigate("/orders"),
    },
    {
      name: "Coupons",
      icon: <Tag size={18} />,
      onClick: () => secureNavigate("/coupons"),
    },
    {
      name: "Gift Cards",
      icon: <CreditCard size={18} />,
      onClick: () => secureNavigate("/gift-cards"),
    },
  ];

  if (!isAuthenticated) {
    accountMenu.splice(0, 0, {
      name: "Login",
      icon: <LogIn size={18} />,
      onClick: () => {
        navigate("/sign", { state: { backgroundLocation: location } });
      },
    });
  }
  if (isAuthenticated) {
    accountMenu.push({
      name: "Logout",
      icon: <LogOut size={18} />,
      onClick: () => {
        navigate("/logout", { state: { backgroundLocation: location } });
      },
    });

    if (userRoles.includes("seller")) {
      accountMenu.splice(accountMenu.length - 1, 0, {
        name: "Switch to Seller Profile",
        icon: <Store size={18} />,
        onClick: () => navigate("/seller/dashboard"),
      });
    }

    if (!userRoles.includes("seller")) {
      accountMenu.splice(accountMenu.length - 1, 0, {
        name: "Become a Seller",
        icon: <Store size={18} />,
        onClick: async () => {
          console.log("Creating seller profile...");
          try {
            await createSellerProfileMutation.mutateAsync();
            console.log("Making API Call....");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success("Seller Profile Created.");

            dispatch(logout());
            clearTokens();

            toast.info("You are now logged out! Please login again.")

            navigate("/sign")
          } catch (error) {
            toast.error("There was an error creating seller profile!");
            console.error("Error creating seller profile, ", error);
          }
        },
      });
    }

    if (userRoles.includes("admin")) {
      accountMenu.splice(accountMenu.length - 1, 0, {
        name: "Switch to Admin Profile",
        icon: <ShieldCheck size={18} />,
        onClick: () => navigate("/admin-dashboard"),
      });
    }
  }

  const optionsMenu: MenuItem[] = [
    {
      name: "Settings",
      icon: <Settings size={18} />,
      onClick: () => navigate("/settings"),
    },
    {
      name: "Help Center",
      icon: <HelpCircle size={18} />,
      onClick: () => navigate("/help-center"),
    },
    {
      name: "About Us",
      icon: <Info size={18} />,
      onClick: () => navigate("/about"),
    },
  ];

  const secureNavigate = (link: string) => {
    if (!isAuthenticated)
      navigate("/sign", { state: { backgroundLocation: location } });
    else navigate(link);
  };

  const handleUnAuthorizedClicks = () => {
    if (!isAuthenticated) {
      navigate("/sign", { state: { backgroundLocation: location } });
      return true;
    }
    return false;
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Account dropdown menu */}
      <RadixMultiDropdown
        trigger={
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-teal-50 transition-colors group"
            title="Account"
            type="button"
          >
            <User
              size={20}
              className="text-gray-700 group-hover:text-teal-600 transition-colors"
            />
            <span className="hidden lg:block text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors">
              Account
            </span>
          </button>
        }
        items={accountMenu}
        width={240}
        sideWidth={260}
      />

      {/* Wishlist Button */}
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50 transition-colors group"
        title="Wishlist"
        onClick={() => {
          if (!handleUnAuthorizedClicks()) {
            /* wishlist logic here */
          }
        }}
        type="button"
      >
        <Heart
          size={20}
          className="text-gray-700 group-hover:text-amber-600 transition-colors"
        />
        <span className="hidden lg:block text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
          Wishlist
        </span>
      </button>

      {/* Cart Button */}
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors group relative"
        title="Cart"
        onClick={() => {
          if (!handleUnAuthorizedClicks()) {
            /* cart logic here */
          }
        }}
        type="button"
      >
        <ShoppingCart
          size={20}
          className="text-gray-700 group-hover:text-orange-600 transition-colors"
        />
        <span className="hidden lg:block text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
          Cart
        </span>
        {/* Cart badge - you can make this dynamic */}
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          0
        </span>
      </button>

      {/* Options dropdown menu */}
      <RadixMultiDropdown
        trigger={
          <button
            className="p-2 rounded-lg hover:bg-cyan-50 transition-colors group"
            title="Options"
            type="button"
          >
            <MoreVertical
              size={20}
              className="text-gray-700 group-hover:text-cyan-600 transition-colors"
            />
          </button>
        }
        items={optionsMenu}
        width={220}
        sideWidth={220}
      />
    </div>
  );
};
