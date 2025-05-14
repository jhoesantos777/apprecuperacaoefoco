
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  [key: string]: any;
}

// Re-export the toast function with our custom type
export const toast = (props: ToastProps) => {
  // Extract title and description for sonner toast
  const { title, description, variant, ...rest } = props;
  return sonnerToast(title || "", {
    description,
    // Map variant to Sonner's classes if needed
    className: variant === "destructive" ? "bg-red-100" : undefined,
    ...rest
  });
};

// Creating a custom hook to use our toast
export function useToast() {
  return {
    toast
  };
}
