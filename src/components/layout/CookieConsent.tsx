import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "laso-cookie-consent";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  We Value Your Privacy
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies.{" "}
                  <Link to="/cookie-policy" className="text-primary hover:underline">
                    Learn more
                  </Link>
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleAccept}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Accept All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDecline}
                    className="border-border hover:bg-muted"
                  >
                    Decline
                  </Button>
                  <Link to="/cookie-policy">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                      Cookie Settings
                    </Button>
                  </Link>
                </div>
              </div>
              <button
                onClick={handleDecline}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cookie consent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
