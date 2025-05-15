
import { toast as sonnerToast } from "sonner";

// Types for compatibility
export interface ToastProps {
  variant?: "default" | "destructive";
  [key: string]: any;
}

// Create a consistent toast function that works with both string and object formats
export const toast = (message: string, options?: ToastProps) => {
  if (options?.variant === 'destructive') {
    return sonnerToast.error(message, options);
  }
  
  return sonnerToast(message, options);
};

export function useToast() {
  return {
    toast
  };
}
