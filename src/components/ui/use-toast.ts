
import { toast as sonnerToast } from "sonner";

// Types for compatibility
export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  [key: string]: any;
};

// Wrapper for toast to maintain consistent interface
export const toast = (props: ToastProps | string) => {
  if (typeof props === 'string') {
    return sonnerToast(props);
  }
  
  const { title, description, variant, ...rest } = props;
  
  if (variant === 'destructive') {
    return sonnerToast.error(title || "", {
      description,
      ...rest
    });
  }
  
  return sonnerToast(title || "", {
    description,
    ...rest
  });
};

export const useToast = () => {
  return {
    toast
  };
};
