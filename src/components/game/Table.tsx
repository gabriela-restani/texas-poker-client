import React from "react";

export function Table({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`w-2/3 aspect-video bg-green-900 flex items-center justify-center rounded-full ${className}`}>
      {children}
    </div>
  );
}