import React from "react";

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  label: string; // To specify button text directly
}

const BlackButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  return (
    <button
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {props.label}
    </button>
  );
};

export default BlackButton;
