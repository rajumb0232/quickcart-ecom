import React, { useState, useRef, useEffect } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export type MenuItem = {
  name: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  child?: MenuItem[];
};

export interface RadixMultiDropdownProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  width?: number;
  sideWidth?: number;
}

export default function RadixMultiDropdown({
  trigger,
  items,
  width = 220,
  sideWidth,
}: RadixMultiDropdownProps) {
  const [rootOpen, setRootOpen] = useState(false);
  const [openSubIndex, setOpenSubIndex] = useState<number | null>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const body = document.body;
    const prevOverflowY = body.style.overflowY || "";
    const prevPaddingRight = body.style.paddingRight || "";

    if (rootOpen) {
      // keep scrollbar present to avoid width shift
      body.style.overflowY = "scroll";
      // don't add paddingRight — leaving unchanged prevents shrinking
      body.style.paddingRight = prevPaddingRight;
    } else {
      body.style.overflowY = prevOverflowY;
      body.style.paddingRight = prevPaddingRight;
    }

    return () => {
      body.style.overflowY = prevOverflowY;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [rootOpen]);

  const clearTimers = () => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    enterTimer.current = null;
    leaveTimer.current = null;
  };

  const handleTriggerMouseEnter = () => {
    clearTimers();
    enterTimer.current = setTimeout(() => setRootOpen(true), 80);
  };

  const handleTriggerMouseLeave = () => {
    clearTimers();
    leaveTimer.current = setTimeout(() => {
      if (openSubIndex === null) setRootOpen(false);
    }, 160);
  };

  const handleContentMouseEnter = () => {
    clearTimers();
    setRootOpen(true);
  };

  const handleContentMouseLeave = () => {
    clearTimers();
    leaveTimer.current = setTimeout(() => {
      setRootOpen(false);
      setOpenSubIndex(null);
    }, 180);
  };

  const handleSubTriggerMouseEnter = (idx: number) => {
    clearTimers();
    enterTimer.current = setTimeout(() => setOpenSubIndex(idx), 80);
    setRootOpen(true);
  };

  const handleSubTriggerMouseLeave = (idx: number) => {
    clearTimers();
    leaveTimer.current = setTimeout(() => {
      setOpenSubIndex((cur) => (cur === idx ? null : cur));
    }, 150);
  };

  const handleSubContentMouseEnter = (idx: number) => {
    clearTimers();
    setRootOpen(true);
    setOpenSubIndex(idx);
  };

  const handleSubContentMouseLeave = () => {
    clearTimers();
    leaveTimer.current = setTimeout(() => {
      setOpenSubIndex(null);
      setRootOpen(false);
    }, 160);
  };

  const closeAll = () => {
    setRootOpen(false);
    setOpenSubIndex(null);
  };

  const renderMenuItem = (item: MenuItem, idx: number) => {
    const hasChildren = Array.isArray(item.child) && item.child.length > 0;

    if (hasChildren) {
      return (
        <div key={`${item.name}-${idx}`}>
          <DropdownMenu.Sub
            open={openSubIndex === idx}
            onOpenChange={(v) => setOpenSubIndex(v ? idx : null)}
          >
            <DropdownMenu.SubTrigger
              asChild
              onMouseEnter={() => handleSubTriggerMouseEnter(idx)}
              onMouseLeave={() => handleSubTriggerMouseLeave(idx)}
            >
              <button
                className="w-full text-left px-4 py-3 text-sm flex items-center hover:bg-[#faf7f2] cursor-pointer outline-none border-none"
                onClick={(e) => {
                  e.preventDefault();
                  item.onClick?.();
                }}
              >
                {item.icon && (
                  <div className="mr-2 text-lg shrink-0">{item.icon}</div>
                )}
                <span className="flex-1 truncate">{item.name}</span>
                <span className="ml-2 text-xs opacity-60 shrink-0">›</span>
              </button>
            </DropdownMenu.SubTrigger>

            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                {...({
                  side: "right",
                  align: "start",
                  sideOffset: 4,
                  alignOffset: -6,
                } as any)}
                className="bg-white rounded-md shadow-lg py-2 border border-slate-200 overflow-hidden"
                style={{
                  width: sideWidth ?? width,
                  maxWidth: "min(90vw, 400px)",
                  zIndex: 9999,
                  boxSizing: "border-box",
                }}
                onMouseEnter={() => handleSubContentMouseEnter(idx)}
                onMouseLeave={handleSubContentMouseLeave}
              >
                {item.child!.map((child, i) => (
                  <DropdownMenu.Item
                    key={`${child.name}-${i}`}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-[#faf7f2] flex items-center cursor-pointer outline-none border-none"
                    onSelect={() => {
                      child.onClick?.();
                      closeAll();
                    }}
                  >
                    {child.icon && (
                      <div className="mr-2 text-base shrink-0">
                        {child.icon}
                      </div>
                    )}
                    <span className="truncate">{child.name}</span>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </div>
      );
    }

    return (
      <DropdownMenu.Item
        key={`${item.name}-${idx}`}
        className="w-full text-left px-4 py-3 text-sm hover:bg-[#faf7f2] flex items-center cursor-pointer outline-none border-none"
        onSelect={() => {
          item.onClick?.();
          closeAll();
        }}
        onMouseEnter={handleContentMouseEnter}
      >
        {item.icon && <div className="mr-2 text-lg shrink-0">{item.icon}</div>}
        <span className="truncate">{item.name}</span>
      </DropdownMenu.Item>
    );
  };

  return (
    <DropdownMenu.Root modal={false} open={rootOpen} onOpenChange={setRootOpen}>
      <DropdownMenu.Trigger
        asChild
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
      >
        <div className="inline-block">{trigger}</div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="bottom"
          align="start"
          sideOffset={4}
          className="bg-white rounded-md shadow-lg py-2 border border-slate-200 overflow-hidden"
          style={{
            width,
            maxWidth: "min(90vw, 400px)",
            zIndex: 9999,
            boxSizing: "border-box",
          }}
          onMouseEnter={handleContentMouseEnter}
          onMouseLeave={handleContentMouseLeave}
        >
          {items.map((item, idx) => renderMenuItem(item, idx))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
