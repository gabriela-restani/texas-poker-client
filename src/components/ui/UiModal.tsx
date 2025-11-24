'use client';
import React from "react";
import type { UiModalProps } from "@/types/ui";

export function UiModal({ id, children, popover = "auto" }: UiModalProps) {
  return (
    <dialog
      id={id}
      className="relative left-1/2 top-1/2 
        transform -translate-x-1/2 -translate-y-1/2 
        p-4 border border-gray-300 rounded-lg bg-white shadow-lg"
      popover={popover}
    >
      <button
        className="absolute right-1.5 top-0.5 text-lg font-bold cursor-pointer"
        aria-label="Close Modal"
        popoverTarget={id}
        popoverTargetAction="hide"
      >
        ×
      </button>
      { children }
    </dialog>
  );
}