
import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

export function Toaster() {
  const { isDarkMode } = useTheme();
  
  return (
    <SonnerToaster
      theme={isDarkMode ? "dark" : "light"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
    />
  );
}
