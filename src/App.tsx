import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Systems15T from "./pages/equipment/Systems15T";
import Systems3T from "./pages/equipment/Systems3T";
import BrandPage from "./pages/equipment/brand/BrandPage";
import AdminNotifications from "./pages/admin/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/equipment/1-5t-systems" element={<Systems15T />} />
            <Route path="/equipment/3t-systems" element={<Systems3T />} />
            <Route path="/equipment/brand/:brand" element={<BrandPage />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
