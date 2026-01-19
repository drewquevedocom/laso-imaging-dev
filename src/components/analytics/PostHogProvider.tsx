import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

const POSTHOG_KEY = 'phc_uVFWYa2TC55CNAndoJwtY2aCfFP1htbHd10Igmi3XRP';
const POSTHOG_HOST = 'https://us.i.posthog.com';

// Initialize PostHog
export const initPostHog = () => {
  if (typeof window !== 'undefined' && !posthog.__loaded) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false, // We'll capture manually for SPAs
      capture_pageleave: true,
      persistence: 'localStorage',
      autocapture: true,
      session_recording: {
        maskAllInputs: true,
        maskInputOptions: {
          password: true,
        },
      },
    });
  }
};

// PostHog page view tracker for SPAs
const PostHogPageView = () => {
  const location = useLocation();

  useEffect(() => {
    if (posthog.__loaded) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
      });
    }
  }, [location]);

  return null;
};

interface PostHogProviderProps {
  children: ReactNode;
}

export const PostHogProvider = ({ children }: PostHogProviderProps) => {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
};

export default PostHogProvider;
