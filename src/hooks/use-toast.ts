
import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  [key: string]: any;
}

// Re-export the toast function with our custom type
export const toast = (message: string, options?: Omit<ToastProps, 'title'>) => {
  return sonnerToast(message, options);
};

// Creating a custom hook to use our toast
export function useToast() {
  return {
    toast
  };
}
