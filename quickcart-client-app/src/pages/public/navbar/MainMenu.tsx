import {
  FaHeart,
  FaRegListAlt,
  FaRegUser,
  FaShoppingCart,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectIsAuthenticated } from "../../../features/auth/authSelectors";

export const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleUnAuthorizedClicks = () => {
    if (!isAuthenticated) {
      navigate("/sign", { state: { backgroundLocation: location } });
      return;
    }
    console.log("User is authenticated — continue to feature");
  };

  return (
    <>
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
          <span className="text-lg mx-1.5 md:mx-0 sm:text-lg md:text-xl mb-0 sm:mb-1">
            {icon}
          </span>
          <span className="hidden lg:block text-xs font-medium">{label}</span>
        </button>
      ))}
    </>
  );
};
