// MainMenu.tsx
import React, { useState, useRef, useEffect, type JSX } from "react";
import { FaHeart, FaRegUser, FaShoppingCart } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated } from "../../../features/auth/authSelectors";
import DropdownPortal, { type MenuItem } from "../../../components/DropDownPortal";

const HOVER_CLOSE_DELAY = 150; // ms

export const MainMenu: React.FC = () => {
  const [open, setOpen] = useState<{
    key: string;
    rect: DOMRect;
    items: MenuItem[];
  } | null>(null);

  // refs for buttons
  const refs = {
    account: useRef<HTMLButtonElement | null>(null),
    wishlist: useRef<HTMLButtonElement | null>(null),
    cart: useRef<HTMLButtonElement | null>(null),
    options: useRef<HTMLButtonElement | null>(null),
  };

  // hover close timer
  const hoverTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };
  const scheduleClose = (delay = HOVER_CLOSE_DELAY) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      setOpen(null);
      hoverTimer.current = null;
    }, delay) as unknown as number;
  };

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onScrollOrResize = () => {
      if (!open) return;
      const triggerRef = refs[open.key as keyof typeof refs];
      if (triggerRef?.current) {
        setOpen((prev) =>
          prev && { ...prev, rect: triggerRef.current!.getBoundingClientRect() }
        );
      }
    };

    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    document.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
      document.removeEventListener("keydown", onEsc);
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    };
  }, [open]);

  const openFor = (key: keyof typeof refs, items: MenuItem[]) => {
    const el = refs[key].current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setOpen({ key, rect, items });
  };

  const accountMenu: MenuItem[] = [
    { name: "My Profile" },
    { name: "Orders" },
    { name: "Wishlist" },
    { name: "Coupons" },
    { name: "Gift Cards" },
    { name: "Logout" },
  ];
  const optionsMenu: MenuItem[] = [
    { name: "Settings" },
    { name: "Help Center" },
    { name: "About Us" },
  ];

  return (
    <>
      <div className="flex items-center gap-2">
        <ItemButton
          ref={refs.account}
          icon={<FaRegUser />}
          label="Account"
          onMouseEnter={() => {
            cancelClose();
            openFor("account", accountMenu);
          }}
          onMouseLeave={() => {
            scheduleClose();
          }}
        />

        <ItemButton
          ref={refs.wishlist}
          icon={<FaHeart />}
          label="Wishlist"
          onClick={() => setOpen(null)}
        />

        <ItemButton
          ref={refs.cart}
          icon={<FaShoppingCart />}
          label="Cart"
          onClick={() => setOpen(null)}
        />

        <ItemButton
          ref={refs.options}
          icon={<SlOptionsVertical />}
          onMouseEnter={() => {
            cancelClose();
            openFor("options", optionsMenu);
          }}
          onMouseLeave={() => scheduleClose()}
        />
      </div>

      {open && (
        <DropdownPortal
          triggerRect={open.rect}
          items={open.items}
          onMouseEnter={cancelClose}
          onMouseLeave={() => scheduleClose(0)}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
};

/* --------------------- ItemButton (forwardRef) --------------------- */
type ItemButtonProps = {
  label?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  icon: JSX.Element;
};

const ItemButton = React.forwardRef<HTMLButtonElement, ItemButtonProps>(
  ({ label, onClick, icon, onMouseEnter, onMouseLeave }, ref) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const handleUnAuthorizedClicks = () => {
      if (!isAuthenticated) {
        navigate("/sign", { state: { backgroundLocation: location } });
        return;
      }
    };

    return (
      <button
        ref={ref}
        className="relative flex flex-col items-center text-gray-900 hover:text-black hover:scale-105 transition-all ease-in-out duration-200 cursor-pointer mx-2"
        title={label}
        onClick={(e) => {
          handleUnAuthorizedClicks();
          onClick?.(e);
        }}
        onMouseEnter={(e) => onMouseEnter?.(e)}
        onMouseLeave={(e) => onMouseLeave?.(e)}
      >
        <span className="text-lg mx-1.5 md:mx-0 sm:text-lg md:text-xl mb-0 sm:mb-1">
          {icon}
        </span>
        <span className="hidden lg:block text-xs font-medium">{label}</span>
      </button>
    );
  }
);
ItemButton.displayName = "ItemButton";
