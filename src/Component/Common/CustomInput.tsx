import React from "react";

interface CustomInputProps {
  name?: string;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  variant?: "default" | "textarea";
  className?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  type = "text",
  variant = "default",
  className = "",
  error,
  disabled = false,
  required = false,
}) => {
  // 🌟 Base styling
  const baseClass = `
    w-full rounded-xl border bg-white px-4 py-3 text-gray-800 placeholder-gray-400
    shadow-sm transition-all duration-200 outline-none
    focus:ring-2 focus:ring-blue-400 focus:border-blue-400
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70
  `;

  // 🎨 Error style
  const errorClass = error
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300";

  // 🧩 Render textarea
  if (variant === "textarea") {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-1 ml-1 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={4}
          disabled={disabled}
          className={`${baseClass} ${errorClass} ${className}`}
        />
        {error && <p className="text-sm text-red-500 mt-1 ml-1">{error}</p>}
      </div>
    );
  }

  // 🧩 Render input
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 ml-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseClass} ${errorClass} ${className}`}
      />
      {error && <p className="text-sm text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default CustomInput;
