
import { useToast as useSonnerToast, toast as sonnerToast } from "sonner";

// Tipos para compatibilidade
export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

// Wrapper do toast para manter a interface consistente
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
  const sonnerToastHook = useSonnerToast();
  
  return {
    ...sonnerToastHook,
    toast
  };
};
