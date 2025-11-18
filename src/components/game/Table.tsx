import React from "react";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-2/3 aspect-video bg-green-900 flex items-center justify-center rounded-full">
      {children}
    </div>
  );
}