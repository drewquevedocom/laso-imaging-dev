import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Guides from "./pages/guides/Guides";
import SafetyHub from "./pages/resources/SafetyHub";
import MRIMachineCost from "./pages/guides/MRIMachineCost";
import CTScannerCost from "./pages/guides/CTScannerCost";
import MobileRentalRates from "./pages/guides/MobileRentalRates";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Systems15T from "./pages/equipment/Systems15T";
import Systems3T from "./pages/equipment/Systems3T";
import BrandPage from "./pages/equipment/brand/BrandPage";
import EquipmentCategory from "./pages/equipment/EquipmentCategory";
import AdminNotifications from "./pages/admin/Notifications";
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
import PostHogPageView from "./components/analytics/PostHogPageView";
import ChatbotWidget from "./components/chat/ChatbotWidget";
import CustomerAuth from "./pages/auth/CustomerAuth";
import CustomerPortal from "./pages/portal/CustomerPortal";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalOrders from "./pages/portal/PortalOrders";
import PortalServices from "./pages/portal/PortalServices";
import PortalDocuments from "./pages/portal/PortalDocuments";
import PortalSettings from "./pages/portal/PortalSettings";
import PortalQuotes from "./pages/portal/PortalQuotes";
import PortalSavedEquipment from "./pages/portal/PortalSavedEquipment";
import PortalMessages from "./pages/portal/PortalMessages";
import PortalNotifications from "./pages/portal/PortalNotifications";
import CookieConsent from "./components/layout/CookieConsent";
import ContractorTimecard from "./pages/internal/ContractorTimecard";
import CustomerReview from "./pages/internal/CustomerReview";
import QuoteAcceptance from "./pages/quotes/QuoteAcceptance";
import Communications from "./pages/admin/Communications";
import SalesSearch from "./pages/admin/SalesSearch";
import Settings from "./pages/admin/Settings";
import Customers from "./pages/admin/Customers";
import EmailTemplates from "./pages/admin/EmailTemplates";
import EquipmentHub from "./pages/admin/EquipmentHub";
import PricingRules from "./pages/admin/PricingRules";
import TestingGuide from "./pages/admin/TestingGuide";
import RentalRequest from "./pages/rentals/RentalRequest";
import OfferApprovals from "./pages/admin/OfferApprovals";
import Orders from "./pages/admin/Orders";
import ComingSoon from "./pages/ComingSoon";
// Mobile Rentals
import MobileRentals from "./pages/mobile-rentals/MobileRentals";
import MobileMRI from "./pages/mobile-rentals/MobileMRI";
import MobileCT from "./pages/mobile-rentals/MobileCT";
import MobilePETCT from "./pages/mobile-rentals/MobilePETCT";
// Service Areas
import ServiceAreas from "./pages/service-areas/ServiceAreas";
import California from "./pages/service-areas/California";
import WestCoast from "./pages/service-areas/WestCoast";
import Nationwide from "./pages/service-areas/Nationwide";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <PostHogProvider>
            <TooltipProvider>
              <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <GoogleAnalytics />
            <PostHogPageView />
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
              
              {/* Coming Soon */}
              <Route path="/coming-soon" element={<ComingSoon />} />
              
              {/* Equipment Rental */}
              <Route path="/rentals" element={<RentalRequest />} />
              
              {/* Pricing Guides */}
              <Route path="/guides" element={<Guides />} />
              <Route path="/guides/mri-machine-cost" element={<MRIMachineCost />} />
              <Route path="/guides/ct-scanner-cost" element={<CTScannerCost />} />
              <Route path="/guides/mobile-rental-rates" element={<MobileRentalRates />} />
              
              {/* Resources */}
              <Route path="/resources/safety" element={<SafetyHub />} />
              
              {/* Mobile Rentals */}
              <Route path="/mobile-rentals" element={<MobileRentals />} />
              <Route path="/mobile-rentals/mri" element={<MobileMRI />} />
              <Route path="/mobile-rentals/ct" element={<MobileCT />} />
              <Route path="/mobile-rentals/pet-ct" element={<MobilePETCT />} />
              
              {/* Service Areas */}
              <Route path="/service-areas" element={<ServiceAreas />} />
              <Route path="/service-areas/california" element={<California />} />
              <Route path="/service-areas/west-coast" element={<WestCoast />} />
              <Route path="/service-areas/nationwide" element={<Nationwide />} />
              
              {/* Customer Portal Routes */}
              <Route path="/auth/customer" element={<CustomerAuth />} />
              <Route path="/portal" element={<CustomerPortal />}>
                <Route index element={<PortalDashboard />} />
                <Route path="quotes" element={<PortalQuotes />} />
                <Route path="orders" element={<PortalOrders />} />
                <Route path="saved" element={<PortalSavedEquipment />} />
                <Route path="messages" element={<PortalMessages />} />
                <Route path="notifications" element={<PortalNotifications />} />
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
                <Route path="equipment" element={<EquipmentHub />} />
                <Route path="sell-requests" element={<Navigate to="/admin/equipment" replace />} />
                <Route path="inventory" element={<Navigate to="/admin/equipment?tab=inventory" replace />} />
                <Route path="quotes" element={<AdminQuotes />} />
                <Route path="orders" element={<Orders />} />
                <Route path="quote-builder" element={<QuoteBuilder />} />
                <Route path="email-templates" element={<EmailTemplates />} />
                <Route path="communication" element={<Communications />} />
                <Route path="pricing-rules" element={<PricingRules />} />
                <Route path="testing-guide" element={<TestingGuide />} />
                <Route path="offer-approvals" element={<OfferApprovals />} />
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
          </PostHogProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
