import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useStealthMode } from "@/lib/utils";
import AppRoutes from "./app/routes";

const queryClient = new QueryClient();

const App = () => {
  const { enableStealthMode, disableStealthMode } = useStealthMode();

  // Check for URL parameters to activate stealth mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('stealth') === 'on') {
      enableStealthMode();
      // Clean up URL without refreshing
      window.history.replaceState({}, '', window.location.pathname);
    } else if (urlParams.get('stealth') === 'off') {
      disableStealthMode();
      // Clean up URL without refreshing
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [enableStealthMode, disableStealthMode]);

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

  // Add chat command listener for stealth mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Listen for Enter key
      if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
        const value = event.target.value.toLowerCase().trim();
        
        if (value === 'stealth mode on') {
          enableStealthMode();
          event.target.value = '';
          console.log('🥷 STEALTH MODE ACTIVATED');
        } else if (value === 'stealth mode off') {
          disableStealthMode();
          event.target.value = '';
          console.log('👥 STEALTH MODE DEACTIVATED');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableStealthMode, disableStealthMode])

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
