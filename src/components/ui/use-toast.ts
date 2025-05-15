
import { toast as sonnerToast } from "sonner";

// Types for compatibility
export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  [key: string]: any;
};

// Wrapper for toast to maintain consistent interface
export const toast = (message: string, options?: Omit<ToastProps, 'title'>) => {
  if (options?.variant === 'destructive') {
    return sonnerToast.error(message, options);
  }
  
  return sonnerToast(message, options);
};

export const useToast = () => {
  return {
    toast
  };
};
