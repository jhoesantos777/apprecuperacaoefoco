
import { toast as sonnerToast } from "sonner";

// Re-export the toast function from sonner
export const toast = sonnerToast;

// Creating a custom hook to use sonner toast
export function useToast() {
  return {
    toast: sonnerToast
  };
}
