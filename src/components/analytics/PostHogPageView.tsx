import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import posthog from 'posthog-js';

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

export default PostHogPageView;
