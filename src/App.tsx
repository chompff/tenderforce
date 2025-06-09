import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app/routes";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const footer = document.querySelector('footer')
    const scrollHints = document.querySelectorAll('.scroll-hint')

    if (!footer || scrollHints.length === 0) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        scrollHints.forEach((el) => {
          if (entry.isIntersecting) {
            el.classList.add('fade-out')
          } else {
            el.classList.remove('fade-out')
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
