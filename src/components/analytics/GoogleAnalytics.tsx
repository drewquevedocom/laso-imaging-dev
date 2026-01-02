import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-EL3T622HQP';

// Declare gtag on window
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Pre-defined event helpers for common actions
export const trackQuoteRequest = (productName: string, sourcePage: string) => {
  trackEvent('quote_request', 'lead_generation', `${productName} - ${sourcePage}`);
};

export const trackAddToCart = (productId: string, productName: string, price: number) => {
  trackEvent('add_to_cart', 'ecommerce', productName, price);
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: price,
      items: [{ item_id: productId, item_name: productName, price: price }],
    });
  }
};

export const trackViewItem = (productId: string, productName: string, price: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'view_item', {
      currency: 'USD',
      value: price,
      items: [{ item_id: productId, item_name: productName, price: price }],
    });
  }
};

export const trackPhoneCall = () => {
  trackEvent('phone_call', 'contact', 'Header Phone Click');
};

export const trackSearch = (searchTerm: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
  }
};

// Component that tracks page views on route changes
const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

export default GoogleAnalytics;
