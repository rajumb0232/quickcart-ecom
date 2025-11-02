import React from "react";

export interface InputProps {
  label: string;
  type: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Input: React.FC<InputProps> = (props: InputProps) => {
  return (
    <div>
      <label className="block text-gray-700 mb-1" htmlFor={props.name}>
        {props.label}
      </label>
      <input
        id={props.name}
        type={props.type}
        name={props.name}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
      />
    </div>
  );
};

export default Input;
