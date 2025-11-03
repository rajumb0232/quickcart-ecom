// NavCategories.tsx (updated)
import React, { useRef, useState } from "react";
import { useCategories } from "../../../hooks/useCategories";
import type { Category } from "../../../types/productTypes";
import { isApiResponse } from "../../../types/apiResponseType";
import DropdownPortal, { type MenuItem } from "../../../components/DropDownPortal"; // adjust path

function normalizeCategories(raw?: Category[] | null): Category[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((c) => ({
    ...c,
    child_category: Array.isArray(c.child_category)
      ? c.child_category.map((cc) => ({
          ...cc,
          child_category: Array.isArray(cc.child_category) ? cc.child_category : [],
        }))
      : [],
  }));
}

function hasChildren(cat?: Category | null): cat is Category & { child_category: Category[] } {
  return Array.isArray(cat?.child_category) && cat!.child_category.length > 0;
}

export const NavCategories: React.FC = () => {
  const { data, isLoading, isError } = useCategories();
  const fetched = data && isApiResponse(data) ? data.data ?? [] : [];
  const categories = normalizeCategories(fetched);

  const [hoveredLevel1, setHoveredLevel1] = useState<Category | null>(null);
  const [hoveredLevel2, setHoveredLevel2] = useState<Category | null>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  // close timer to avoid immediate close while moving between portals
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navRef = useRef<HTMLDivElement | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };
  const scheduleClose = (ms = 1, cb: () => void) => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      cb();
    }, ms);
  };

  const onLevel1Enter = (e: React.MouseEvent, cat: Category) => {
    clearCloseTimer();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTriggerRect(rect);
    setHoveredLevel1(cat);
    setHoveredLevel2(null);
  };
  const onLevelLeave = () => {
    // use schedule close to avoid aggressive flicker
    scheduleClose(1, () => {
      setHoveredLevel1(null);
      setHoveredLevel2(null);
      setTriggerRect(null);
    });
  };

  if (isLoading) {
    return <div className="flex gap-4 text-gray-500 text-xs px-4 py-2">Loading...</div>;
  }
  if (isError) {
    return <div className="flex gap-4 text-red-500 text-xs px-4 py-2">Failed to load categories</div>;
  }

  const level2Width = 240; // keep in sync with DropdownPortal prop
  const level3Width = 220;

  const level2Items: MenuItem[] = hasChildren(hoveredLevel1)
    ? hoveredLevel1.child_category.map((subCat) => ({
        name: subCat.name,
        onMouseEnter: () => {
          clearCloseTimer();
          setHoveredLevel2(subCat);
        },
        onMouseLeave: () => {
          // schedule close of level-2 (and eventually level-3) if pointer leaves
          scheduleClose(150, () => {
            setHoveredLevel2(null);
            setHoveredLevel1(null);
            setTriggerRect(null);
          });
        },
      }))
    : [];

  const level3Items: MenuItem[] = hasChildren(hoveredLevel2)
    ? hoveredLevel2.child_category.map((c3) => ({ name: c3.name }))
    : [];

  // small constant used in DropdownPortal; replicate here
  const DROPDOWN_MARGIN = 8;

  return (
    <div
      ref={navRef}
      className="relative flex flex-row flex-nowrap text-nowrap flex-1 overflow-x-auto scrollbar-hide gap-4 md:gap-6 xl:gap-8 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2.5 sm:py-3"
      onMouseLeave={onLevelLeave}
    >
      {categories.map((cat) => (
        <button
          key={cat.category_id}
          className="text-gray-700 hover:text-black transition px-2 whitespace-nowrap"
          onMouseEnter={(e) => onLevel1Enter(e, cat)}
        >
          {cat.name.toUpperCase()}
        </button>
      ))}

      {/* Level 2 portal */}
      {triggerRect && level2Items.length > 0 && (
        <DropdownPortal
          triggerRect={triggerRect}
          items={level2Items}
          onClose={() => {
            setHoveredLevel1(null);
            setHoveredLevel2(null);
            setTriggerRect(null);
          }}
          onMouseEnter={() => {
            clearCloseTimer();
          }}
          onMouseLeave={() => {
            scheduleClose(150, () => {
              setHoveredLevel1(null);
              setHoveredLevel2(null);
              setTriggerRect(null);
            });
          }}
          width={level2Width}
        />
      )}

      {/* Level 3 portal - compute left aligned to level-2's placement */}
      {triggerRect && level3Items.length > 0 && (() => {
        // compute level2 left then shift by level2Width to place level3 to the right
        const level2Left = triggerRect.left + triggerRect.width / 2 - level2Width / 2;
        const level3Left = Math.round(Math.min(
          Math.max(level2Left + level2Width, DROPDOWN_MARGIN),
          window.innerWidth - level3Width - DROPDOWN_MARGIN
        ));
        // re-use triggerRect.top for vertical positioning; height/space logic is in DropdownPortal
        const fakeRect = new DOMRect(level3Left, triggerRect.top, 0, 0);

        return (
          <DropdownPortal
            triggerRect={fakeRect}
            items={level3Items}
            onClose={() => setHoveredLevel2(null)}
            onMouseEnter={() => {
              clearCloseTimer();
              // keep hovered level2 alive while inside level3
              // (optional: ensure hoveredLevel1 remains set; we won't clear it elsewhere)
            }}
            onMouseLeave={() => {
              scheduleClose(150, () => {
                setHoveredLevel2(null);
              });
            }}
            width={level3Width}
          />
        );
      })()}
    </div>
  );
};

export default NavCategories;
