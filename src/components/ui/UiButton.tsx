import React from 'react';

export function UiButton({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  popoverTarget,
  popoverTargetAction,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
  popoverTarget?: string;
  popoverTargetAction?: "toggle" | "show" | "hide" | undefined;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      type={type}
      popoverTarget={popoverTarget}
      popoverTargetAction={popoverTargetAction}
    >
      {children}
    </button>
  );
}