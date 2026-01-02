import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Systems15T from "./pages/equipment/Systems15T";
import Systems3T from "./pages/equipment/Systems3T";
import BrandPage from "./pages/equipment/brand/BrandPage";
import EquipmentCategory from "./pages/equipment/EquipmentCategory";
import AdminNotifications from "./pages/admin/Notifications";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminRoute from "./components/auth/AdminRoute";
import ProductListing from "./pages/products/ProductListing";
import ProductDetail from "./pages/products/ProductDetail";
import Quote from "./pages/Quote";
import About from "./pages/About";
import TrackOrder from "./pages/TrackOrder";
import FAQs from "./pages/FAQs";
import SignUp from "./pages/SignUp";
import Services from "./pages/services/Services";
import ServicePage from "./pages/services/ServicePage";
import SupportPage from "./pages/support/SupportPage";
import Parts from "./pages/parts/Parts";
import PartsCategory from "./pages/parts/PartsCategory";
import PartsBrand from "./pages/parts/PartsBrand";
import Blog from "./pages/blog/Blog";
import BlogArticle from "./pages/blog/BlogArticle";
import CaseStudies from "./pages/case-studies/CaseStudies";
import CaseStudyDetail from "./pages/case-studies/CaseStudyDetail";
import ScrollToTop from "./components/layout/ScrollToTop";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <GoogleAnalytics />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/product/:handle" element={<ProductDetail />} />
            <Route path="/quote" element={<Quote />} />
            
            {/* Top Navigation Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Equipment Routes */}
            <Route path="/equipment/1-5t-systems" element={<Systems15T />} />
            <Route path="/equipment/3t-systems" element={<Systems3T />} />
            <Route path="/equipment/brand/:brand" element={<BrandPage />} />
            <Route path="/equipment/:category" element={<EquipmentCategory />} />
            
            {/* Parts Routes */}
            <Route path="/parts" element={<Parts />} />
            <Route path="/parts/brand/:brand" element={<PartsBrand />} />
            <Route path="/parts/:category" element={<PartsCategory />} />
            
            {/* Services Routes */}
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServicePage />} />
            
            {/* Support Routes */}
            <Route path="/support/:slug" element={<SupportPage />} />
            
            {/* Blog Routes */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            
            {/* Case Studies Routes */}
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/notifications" 
              element={
                <AdminRoute>
                  <AdminNotifications />
                </AdminRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
