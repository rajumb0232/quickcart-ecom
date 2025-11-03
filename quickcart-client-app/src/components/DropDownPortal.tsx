// DropdownPortal.tsx
import React, { useEffect, useRef, useState, type JSX } from "react";
import { createPortal } from "react-dom";

export type MenuItem = {
  name: string;
  icon?: JSX.Element;
  onClick?: () => void;
  onMouseEnter?: () => void; // <-- optional per-item hover handlers
  onMouseLeave?: () => void;
};

const DROPDOWN_MARGIN = 8;

export interface DropdownPortalProps {
  triggerRect: DOMRect;
  items: MenuItem[];
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  width?: number;
}

export default function DropdownPortal({
  triggerRect,
  items,
  onClose,
  onMouseEnter,
  onMouseLeave,
  width = 220,
}: DropdownPortalProps) {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elRef.current) {
      elRef.current = document.createElement("div");
      document.body.appendChild(elRef.current);
    }
    return () => {
      if (elRef.current) {
        document.body.removeChild(elRef.current);
        elRef.current = null;
      }
    };
  }, []);

  const [style, setStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    const dropdownW = width;
    const dropdownH = items.length * 44 + 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = triggerRect.left + triggerRect.width / 2 - dropdownW / 2;
    const minLeft = DROPDOWN_MARGIN;
    const maxLeft = vw - dropdownW - DROPDOWN_MARGIN;
    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    const spaceBelow = vh - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    let top: number;
    let transformOrigin = "top center";

    if (spaceBelow >= dropdownH + 8) {
      top = triggerRect.bottom + 8;
      transformOrigin = "top center";
    } else if (spaceAbove >= dropdownH + 8) {
      top = triggerRect.top - dropdownH - 8;
      transformOrigin = "bottom center";
    } else {
      top = Math.min(
        Math.max(triggerRect.bottom + 8, DROPDOWN_MARGIN),
        vh - dropdownH - DROPDOWN_MARGIN
      );
    }

    setStyle({
      position: "fixed",
      top: Math.round(top),
      left: Math.round(left),
      width: dropdownW,
      zIndex: 9999,
      transformOrigin,
    });
  }, [triggerRect, items.length, width]);

  const content = (
    <div
      style={style}
      onMouseEnter={(e) => {
        e.stopPropagation();
        onMouseEnter?.();
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        onMouseLeave?.();
      }}
    >
      <div
        className="bg-white border border-gray-100 rounded-lg shadow-lg py-2"
        style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.12)" }}
      >
        {items.map((it) => (
          <button
            key={it.name}
            className="w-full text-left px-4 py-3 text-sm hover:bg-[#faf7f2] transition flex flex-row justify-start items-center"
            onClick={() => {
              it.onClick?.();
              onClose();
            }}
            onMouseEnter={(e) => {
              e.stopPropagation();
              it.onMouseEnter?.();
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              it.onMouseLeave?.();
            }}
          >
            <div className="mr-2 text-[20px] font-semibold mt-1">{it.icon}</div>
            <span>{it.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return elRef.current ? createPortal(content, elRef.current) : null;
}
