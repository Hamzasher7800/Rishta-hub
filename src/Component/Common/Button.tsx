import React from "react";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  value: React.ReactNode; // string | icon | JSX allowed
  disabled?: boolean;
  variant?: "mobileview" | "PriceBoxButton" | "default";
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  type = "button",
  onClick,
  value,
  disabled = false,
  variant = "default",
  className = "",
}) => {
  // 🎨 Base styling (consistent rounded, smooth transitions)
  const baseClass =
    "inline-flex items-center justify-center rounded-3xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  // 🧩 Variant-specific styles
  const variantClasses = {
    default:
      "bg-primary text-white border border-primary hover:bg-primary/90 focus:ring-primary px-6 py-2",
    mobileview:
      "text-sm rounded-full bg-yellow-400 font-semibold uppercase tracking-wide text-stone-800 hover:bg-yellow-300 focus:bg-yellow-300 focus:ring-yellow-300 focus:ring-offset-2 px-4 py-2 md:px-5 md:py-2.5 text-xs",
    PriceBoxButton:
      "bg-white text-black px-6 py-2 rounded-2xl hover:bg-yellow-500 focus:ring-yellow-500 border border-transparent",
  };

  const finalClass = `${baseClass} ${variantClasses[variant]} ${className}`;

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={finalClass}
    >
      {value}
    </button>
  );
};

export default Button;
