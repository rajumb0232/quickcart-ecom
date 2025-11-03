import React, { useState, useRef } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export type MenuItem = {
  name: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  child?: MenuItem[]; // nested
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

  React.useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (rootOpen) {
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.overflowY = "scroll";
    } else {
      document.documentElement.style.paddingRight = "";
      document.documentElement.style.overflowY = "";
    }
    return () => {
      document.documentElement.style.paddingRight = "";
      document.documentElement.style.overflowY = "";
    };
  }, [rootOpen]);

  const clearTimers = () => {
    if (enterTimer.current) window.clearTimeout(enterTimer.current);
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    enterTimer.current = null;
    leaveTimer.current = null;
  };

  return (
    <>
      <style>
        {`
          /* Ensure all dropdown content containers have light borders */
          .dropdown-content, .dropdown-subcontent {
            border: 1px solid #e2e8f0 !important; /* slate-100 */
          }

          /* Remove focus outlines for buttons and dropdown items */
          .dropdown-content *:focus,
          .dropdown-subcontent *:focus,
          button:focus {
            outline: none !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Cursor pointer for all dropdown items and sub triggers */
          .dropdown-item,
          .dropdown-subtrigger-button {
            cursor: pointer;
          }
        `}
      </style>

      <DropdownMenu.Root
        modal={false}
        open={rootOpen}
        onOpenChange={setRootOpen}
      >
        <DropdownMenu.Trigger
          onMouseEnter={() => {
            clearTimers();
            enterTimer.current = window.setTimeout(() => setRootOpen(true), 80);
          }}
          onMouseLeave={() => {
            clearTimers();
            leaveTimer.current = window.setTimeout(() => {
              if (openSubIndex == null) setRootOpen(false);
            }, 160);
          }}
        >
          {trigger}
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="bottom"
            align="start"
            sideOffset={4}
            className="bg-white rounded-md shadow-lg py-2 dropdown-content z-9999"
            style={{ width }}
            onMouseEnter={() => {
              clearTimers();
              setRootOpen(true);
            }}
            onMouseLeave={() => {
              clearTimers();
              leaveTimer.current = window.setTimeout(() => {
                setRootOpen(false);
                setOpenSubIndex(null);
              }, 180);
            }}
          >
            {items.map((it, idx) => {
              const hasChildren =
                Array.isArray(it.child) && it.child.length > 0;
              return (
                <div key={it.name + idx} className="relative">
                  {hasChildren ? (
                    <DropdownMenu.Sub
                      open={openSubIndex === idx}
                      onOpenChange={(v) => setOpenSubIndex(v ? idx : null)}
                    >
                      <DropdownMenu.SubTrigger
                        asChild
                        onMouseEnter={() => {
                          clearTimers();
                          enterTimer.current = window.setTimeout(
                            () => setOpenSubIndex(idx),
                            80
                          );
                          setRootOpen(true);
                        }}
                        onMouseLeave={() => {
                          clearTimers();
                          leaveTimer.current = window.setTimeout(() => {
                            setOpenSubIndex((cur) =>
                              cur === idx ? null : cur
                            );
                          }, 150);
                        }}
                      >
                        <button
                          className="w-full text-left px-4 py-3 text-sm flex items-center hover:bg-[#faf7f2] dropdown-subtrigger-button"
                          onClick={(e) => {
                            e.preventDefault();
                            it.onClick?.();
                          }}
                        >
                          <div className="mr-2 text-[18px]">{it.icon}</div>
                          <span className="flex-1">{it.name}</span>
                          <span className="ml-2 text-xs opacity-60">›</span>
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
                          className="bg-white rounded-md shadow-lg py-2 dropdown-subcontent"
                          style={{ width: sideWidth ?? width }}
                          onMouseEnter={() => {
                            clearTimers();
                            setRootOpen(true);
                            setOpenSubIndex(idx);
                          }}
                          onMouseLeave={() => {
                            clearTimers();
                            leaveTimer.current = window.setTimeout(() => {
                              setOpenSubIndex(null);
                              setRootOpen(false);
                            }, 160);
                          }}
                        >
                          {it.child!.map((c, i) => (
                            <DropdownMenu.Item
                              key={c.name + i}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-[#faf7f2] flex items-center dropdown-item"
                              onSelect={() => {
                                c.onClick?.();
                                setRootOpen(false);
                                setOpenSubIndex(null);
                              }}
                            >
                              <div className="mr-2 text-[16px]">{c.icon}</div>
                              <span>{c.name}</span>
                            </DropdownMenu.Item>
                          ))}
                        </DropdownMenu.SubContent>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Sub>
                  ) : (
                    <DropdownMenu.Item
                      className="w-full text-left px-4 py-3 text-sm hover:bg-[#faf7f2] flex items-center dropdown-item"
                      onSelect={() => {
                        it.onClick?.();
                        setRootOpen(false);
                        setOpenSubIndex(null);
                      }}
                      onMouseEnter={() => {
                        clearTimers();
                        setRootOpen(true);
                      }}
                    >
                      <div className="mr-2 text-[18px]">{it.icon}</div>
                      <span>{it.name}</span>
                    </DropdownMenu.Item>
                  )}
                </div>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
}
