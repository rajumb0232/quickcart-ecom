import React from "react";
import { FaHeart, FaRegUser, FaShoppingCart } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectRoles,
} from "../../../features/auth/authSelectors";
import RadixMultiDropdown, {
  type MenuItem,
} from "../../../components/RadixMultiDropdown";
import {
  CiHashtag,
  CiLogin,
  CiLogout,
  CiSettings,
  CiShop,
  CiUser,
} from "react-icons/ci";
import {
  PiChatsLight,
  PiCreditCardLight,
  PiPackageLight,
  PiTagLight,
  PiUserCircleGearLight,
} from "react-icons/pi";
import {
  CircleUser,
  EllipsisVertical,
  Heart,
  ShoppingCart,
} from "lucide-react";

export const MainMenu: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRoles = useSelector(selectRoles);
  const navigate = useNavigate();
  const location = useLocation();

  const accountMenu: MenuItem[] = [
    {
      name: "My Profile",
      icon: <CiUser />,
      onClick: () => secureNavigate("/profile"),
    },
    {
      name: "Orders",
      icon: <PiPackageLight />,
      onClick: () => secureNavigate("/orders"),
    },
    {
      name: "Coupons",
      icon: <PiTagLight />,
      onClick: () => secureNavigate("/coupons"),
    },
    {
      name: "Gift Cards",
      icon: <PiCreditCardLight />,
      onClick: () => secureNavigate("/gift-cards"),
    },
  ];

  if (!isAuthenticated) {
    accountMenu.splice(0, 0, {
      name: "Login",
      icon: <CiLogin />,
      onClick: () => {
        navigate("/sign", { state: { backgroundLocation: location } });
      },
    });
  }
  if (isAuthenticated) {
    accountMenu.push({
      name: "Logout",
      icon: <CiLogout />,
      onClick: () => {
        navigate("/logout", { state: { backgroundLocation: location } });
      },
    });

    if (userRoles.includes("seller")) {
      accountMenu.splice(accountMenu.length - 1, 0, {
        name: "Switch to Seller Profile",
        icon: <CiShop />,
        onClick: () => navigate("/seller/dashboard"),
      });
    }
    if (userRoles.includes("admin")) {
      accountMenu.splice(accountMenu.length - 1, 0, {
        name: "Switch to Admin Profile",
        icon: <PiUserCircleGearLight />,
        onClick: () => navigate("/admin-dashboard"),
      });
    }
  }

  const optionsMenu: MenuItem[] = [
    {
      name: "Settings",
      icon: <CiSettings />,
      onClick: () => navigate("/settings"),
    },
    {
      name: "Help Center",
      icon: <PiChatsLight />,
      onClick: () => navigate("/help-center"),
    },
    {
      name: "About Us",
      icon: <CiHashtag />,
      onClick: () => navigate("/about"),
    },
  ];

  const buttonClass =
    "relative flex flex-col items-center text-gray-900 hover:text-black hover:scale-105 transition-all ease-in-out duration-200 cursor-pointer mx-1 md:mx-4";

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
    <div className="flex items-center gap-2 overflow-visible text-gray-700">
      {" "}
      {/* Account dropdown menu */}
      <RadixMultiDropdown
        trigger={
          <button
            className={buttonClass}
            title="Account"
            onClick={() => secureNavigate("/profile")}
            type="button"
          >
            <div className="flex gap-2 hover:text-orange-500 font-normal text-gray-700">
              <span className="text-lg mx-1.5 md:mx-0 sm:text-lg md:text-xl mb-0 sm:mb-1">
                <CircleUser />
              </span>
              <span className="hidden lg:block text-gray-700">
                Account
              </span>
            </div>
          </button>
        }
        items={accountMenu}
        width={240}
        sideWidth={260}
      />
      {/* Wishlist Button */}
      <button
        className={buttonClass}
        title="Wishlist"
        onClick={() => {
          if (!handleUnAuthorizedClicks()) {
            /* wishlist logic here */
          }
        }}
        type="button"
      >
        <div className="flex gap-2 hover:text-orange-500 font-normal text-gray-700">
          <span className="text-lg mx-1.5 md:mx-0 sm:text-lg md:text-xl mb-0 sm:mb-1">
            <Heart />
          </span>
          <span className="hidden lg:block text-gray-700">Wishlist</span>
        </div>
      </button>
      {/* Cart Button */}
      <button
        className={buttonClass}
        title="Cart"
        onClick={() => {
          if (!handleUnAuthorizedClicks()) {
            /* cart logic here */
          }
        }}
        type="button"
      >
        <div className="flex gap-2 hover:text-orange-500 font-normal text-gray-700">
          <span className="text-lg mx-1.5 md:mx-0 mb-0 sm:mb-1">
            <ShoppingCart />
          </span>
          <span className="hidden lg:block text-gray-700">Cart</span>
        </div>
      </button>
      {/* Options dropdown menu */}
      <RadixMultiDropdown
        trigger={
          <button
            className={buttonClass}
            title="Options"
            onClick={() => {
              if (!handleUnAuthorizedClicks()) {
                /* dropdown open handled by Radix */
              }
            }}
            type="button"
          >
            <span className="flex gap-2 hover:text-orange-500 font-normal text-gray-700">
              <EllipsisVertical />
            </span>
          </button>
        }
        items={optionsMenu}
        width={220}
        sideWidth={220}
        // portal={true}  // Enable portal rendering here as well
      />
    </div>
  );
};
