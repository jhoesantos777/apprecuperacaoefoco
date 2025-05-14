
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toast } = useToast()
  // Since we're using sonner's toast, we don't have 'toasts' property
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  )
}
