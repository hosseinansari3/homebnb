"use client";

import { useEffect, useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";
import Persian from "persianjs";
import localFont from "next/font/local";

const myFont = localFont({
  src: "../../../public/fonts/Vazirmatn-FD-Regular.woff2",
});

interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  setInput?: any;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors,
  setInput,
}) => {
  const [isValue, setIsValue] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [pricePersValue, setpricePersValue] = useState("0");
  const [numericValue, setNumericValue] = useState("");
  const [pressedKey, setpressedKey] = useState("");

  /* const handleInputChange = (e) => {
    const value = e.target.value;
    console.log("GGG", e);
    console.log("Type of inputValue:", inputValue.toString());
    if (pressedKey === "Backspace") {
      // Handle the Backspace key press by removing the last character
      console.log("Type of inputValue:", typeof inputValue.toString());
      const numericValue = inputValue.toString().slice(0, -1);
      const persianNumber = Persian(numericValue).englishNumber();

      setNumericValue(numericValue);
      setInputValue(persianNumber);
    } else {
      // Append the new input value to the existing value
      const numeric = value.replace(/[^0-9]/g, "");
      const numericValue = inputValue + numeric;
      const persianNumber = Persian(numericValue).englishNumber();

      setNumericValue(numericValue);
      setInputValue(persianNumber);
    }
  };
*/

  useEffect(() => {
    setInput && setInput(inputValue);
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="w-full relative mb-10">
      {formatPrice && (
        <BiDollar
          size={24}
          className="
            text-neutral-700
            absolute
            top-5
            left-2
          "
        />
      )}
      <input
        id={id}
        type={"text"}
        disabled={disabled}
        onKeyDown={(e) => {
          setpressedKey(e.key);
        }}
        {...register(id, {
          required,
          onChange: handleInputChange,
        })}
        placeholder=" "
        className={`
        ${myFont.className}
        absolute
          peer
          w-full
          p-4
          pt-6 
          font-light 
          bg-white 
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${formatPrice ? "pl-9" : "pl-4"}
          ${errors[id] ? "border-rose-500" : "border-neutral-300"}
          ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
        `}
      />
      <label
        className={`
          relative
          float-right
          mr-7
          text-md
          duration-150 
          transform 
          -translate-y-3 
          top-5 
          z-10 
          origin-[0] 
          bg-white
       
          ${inputValue != "" && "-translate-y-7"}
          ${errors[id] ? "text-rose-500" : "text-zinc-400"}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
