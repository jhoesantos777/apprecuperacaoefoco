
import { toast as sonnerToast, type Toast as SonnerToast } from "sonner";

export type ToastProps = SonnerToast & {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

// Re-export the toast function with our custom type
export const toast = (props: ToastProps) => {
  return sonnerToast(props.title || "", {
    description: props.description,
    // Map variant to Sonner's classes if needed
    className: props.variant === "destructive" ? "bg-red-100" : undefined,
    ...props
  });
};

// Creating a custom hook to use our toast
export function useToast() {
  return {
    toast
  };
}
