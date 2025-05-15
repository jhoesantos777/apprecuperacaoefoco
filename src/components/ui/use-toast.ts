
import { toast as sonnerToast } from "sonner";

// Types to align with how we're using toast throughout the app
export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  [key: string]: any;
}

// Create a consistent toast function that works with both string and object formats
export const toast = (props: string | ToastProps) => {
  if (typeof props === 'string') {
    return sonnerToast(props);
  }
  
  const { title, description, variant, ...rest } = props as ToastProps;
  
  if (variant === 'destructive') {
    return sonnerToast.error(title || description || '', {
      description: title ? description : undefined,
      ...rest
    });
  }
  
  return sonnerToast(title || description || '', {
    description: title ? description : undefined,
    ...rest
  });
};

export function useToast() {
  return {
    toast
  };
}
