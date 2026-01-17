import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Systems15T from "./pages/equipment/Systems15T";
import Systems3T from "./pages/equipment/Systems3T";
import BrandPage from "./pages/equipment/brand/BrandPage";
import EquipmentCategory from "./pages/equipment/EquipmentCategory";
import AdminNotifications from "./pages/admin/Notifications";
import AdminInventory from "./pages/admin/Inventory";
import AdminQuotes from "./pages/admin/Quotes";
import QuoteBuilder from "./pages/admin/QuoteBuilder";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminDashboardLayout from "./components/admin/AdminDashboardLayout";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminRoute from "./components/auth/AdminRoute";
import ProductListing from "./pages/products/ProductListing";
import ProductDetail from "./pages/products/ProductDetail";
import Quote from "./pages/Quote";
import About from "./pages/About";
import TrackOrder from "./pages/TrackOrder";
import FAQs from "./pages/FAQs";
import SignUp from "./pages/SignUp";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import BuySell from "./pages/BuySell";
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
import PartsSearch from "./pages/search/PartsSearch";
import Sitemap from "./pages/Sitemap";
import ScrollToTop from "./components/layout/ScrollToTop";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import ChatbotWidget from "./components/chat/ChatbotWidget";
import CustomerAuth from "./pages/auth/CustomerAuth";
import CustomerPortal from "./pages/portal/CustomerPortal";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalOrders from "./pages/portal/PortalOrders";
import PortalServices from "./pages/portal/PortalServices";
import PortalDocuments from "./pages/portal/PortalDocuments";
import PortalSettings from "./pages/portal/PortalSettings";
import CookieConsent from "./components/layout/CookieConsent";
import ContractorTimecard from "./pages/internal/ContractorTimecard";
import CustomerReview from "./pages/internal/CustomerReview";
import QuoteAcceptance from "./pages/quotes/QuoteAcceptance";
import Communications from "./pages/admin/Communications";
import SalesSearch from "./pages/admin/SalesSearch";
import Settings from "./pages/admin/Settings";
import Customers from "./pages/admin/Customers";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
              <Route path="/buy-sell" element={<BuySell />} />
              {/* Equipment Routes */}
              <Route path="/equipment/1-5t-systems" element={<Systems15T />} />
              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              
              <Route path="/equipment/3t-systems" element={<Systems3T />} />
              <Route path="/equipment/brand/:brand" element={<BrandPage />} />
              <Route path="/equipment/:category" element={<EquipmentCategory />} />
              
              {/* Parts Routes */}
              <Route path="/parts" element={<Parts />} />
              <Route path="/parts/brand/:brand" element={<PartsBrand />} />
              <Route path="/parts/:category" element={<PartsCategory />} />
              
              {/* Parts Search */}
              <Route path="/search/parts" element={<PartsSearch />} />
              
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
              
              {/* Sitemap */}
              <Route path="/sitemap" element={<Sitemap />} />
              
              {/* Customer Portal Routes */}
              <Route path="/auth/customer" element={<CustomerAuth />} />
              <Route path="/portal" element={<CustomerPortal />}>
                <Route index element={<PortalDashboard />} />
                <Route path="orders" element={<PortalOrders />} />
                <Route path="services" element={<PortalServices />} />
                <Route path="documents" element={<PortalDocuments />} />
                <Route path="settings" element={<PortalSettings />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardLayout />
                  </AdminRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="search" element={<SalesSearch />} />
                <Route path="customers" element={<Customers />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="quotes" element={<AdminQuotes />} />
                <Route path="quote-builder" element={<QuoteBuilder />} />
                <Route path="communication" element={<Communications />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              {/* Internal Tools (hidden, no navigation links) */}
              <Route path="/internal/timecard" element={<ContractorTimecard />} />
              <Route path="/review" element={<CustomerReview />} />
              
              {/* Quote Acceptance Portal (public) */}
              <Route path="/quote/:token" element={<QuoteAcceptance />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatbotWidget />
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

// Placeholder component for admin pages not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-[50vh]">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">This section is coming soon.</p>
    </div>
  </div>
);

export default App;
