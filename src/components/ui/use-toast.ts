
import { toast as sonnerToast } from "sonner";

// Types for compatibility
export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

// Wrapper for toast to maintain consistent interface
export const toast = (props: ToastProps | string) => {
  if (typeof props === 'string') {
    return sonnerToast(props);
  }
  
  const { title, description, variant } = props;
  
  if (variant === 'destructive') {
    return sonnerToast.error(title, {
      description
    });
  }
  
  return sonnerToast(title, {
    description
  });
};

export const useToast = () => {
  return {
    toast
  };
};
