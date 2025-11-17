type PopOverAttribute = "auto" | "manual" | "hint";

export interface UiModalProps {
  id: string;
  children: React.ReactNode;
  popover?: PopOverAttribute;
}