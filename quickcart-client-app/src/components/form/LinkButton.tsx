import React from "react";

export interface LinkButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  label: string;
  disabled?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  onClick,
  label,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-black font-semibold hover:underline focus:outline-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {label}
    </button>
  );
};

export default LinkButton;
