import React, { useEffect, useRef } from "react";
import { useLogout } from "../../hooks/useAuth";
import { toast } from "react-toastify";

export interface LogoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  // Use the logout mutation hook at the top-level of the component
  const { mutate: logout, isPending } = useLogout();

  useEffect(() => {
    if (!open) return;

    // Focus the first interactive element when modal opens
    firstFocusRef.current?.focus();

    // Close on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Trap focus within modal
    const handleFocus = (e: FocusEvent) => {
      const modal = modalRef.current;
      if (!modal || modal.contains(e.target as Node)) return;
      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    };
    document.addEventListener("focusin", handleFocus);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusin", handleFocus);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        onConfirm();
        toast.success("Logged out successfully!");
      },
      onError: (error) => {
        console.error("Logout error:", error);
        onConfirm(); // Optionally close modal anyway
      },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
      ref={modalRef}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Modal card */}
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div>
              <h3
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                Confirm logout
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to log out?
              </p>
            </div>

            {/* Floating close button */}
            <button
              onClick={onClose}
              aria-label="Close logout dialog"
              className="h-10 w-10 rounded-full bg-white/95 shadow-md flex items-center justify-center hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-4 h-4 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              onClick={handleLogout}
              ref={firstFocusRef}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-md bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium shadow-sm disabled:opacity-50"
            >
              {isPending ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
