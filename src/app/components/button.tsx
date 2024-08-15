import React from "react";

type Props = {
  color: string;
  text: string;
  disabled?: boolean;
  onClick?: () => void;
};

function Button({ color, text, disabled = false, onClick }: Props) {
  return (
    <button
      disabled={disabled}
      className={`bg-${color}-600 text-white font-bold py-2 px-4 rounded hover:bg-${color}-700 ${
        disabled && `hover:bg-${color}-600`
      }`}
      onClick={onClick ? onClick : undefined}
    >
      {text}
    </button>
  );
}

export default Button;
