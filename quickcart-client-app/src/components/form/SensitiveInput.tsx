import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export interface InputProps {
  label: string;
  type: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const SensitiveInput: React.FC<InputProps> = (props: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-gray-700 mb-1" htmlFor={props.name}>
        {props.label}
      </label>
      <div className="flex flex-row justify-center items-center border border-gray-300 rounded-md focus-within:border-black focus-within:border-2">
        <input
          id={props.name}
          type={showPassword ? "text" : "password"}
          name={props.name}
          className="w-full p-2 pr-10 focus:outline-none"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          required={props.required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="p-2 right-3 top-9 text-gray-500 hover:text-gray-700"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

export default SensitiveInput;
