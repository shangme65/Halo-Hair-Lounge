"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, HelpCircle } from "lucide-react";
import Button from "./Button";
import Link from "next/link";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString(),
      })
    );
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 mb-4"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-dark-200 dark:border-dark-700 p-6 md:p-8 relative">
              {/* Main Banner */}
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-4">
                  <Cookie className="w-8 h-8 text-primary-600" />
                  <h3 className="text-lg font-bold text-dark-900 dark:text-white">
                    We Value Your Privacy
                  </h3>
                </div>

                <p className="text-sm text-dark-600 dark:text-dark-400 leading-relaxed">
                  By clicking "Ok", you agree to the storing of cookies on your
                  device to enhance site navigation, analyze site usage, and
                  assist in our marketing efforts. View our{" "}
                  <Link
                    href="/privacy"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  for more information.{" "}
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="inline-flex items-center text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
                    title="Cookie Settings"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </p>

                <Button
                  onClick={handleAcceptAll}
                  className="!px-3 !py-2 !text-sm w-full"
                >
                  OK
                </Button>
              </div>

              {/* Hint/Tooltip Panel */}
              <AnimatePresence>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700"
                  >
                    <div className="space-y-3 text-xs">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-4 bg-primary-600 rounded-full flex items-center px-0.5">
                            <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-semibold text-dark-900 dark:text-white">
                              Necessary Cookies
                            </h4>
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded">
                              Always Active
                            </span>
                          </div>
                          <p className="text-dark-600 dark:text-dark-400 leading-snug">
                            Essential for website functionality, security, and
                            authentication.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-4 bg-primary-600 rounded-full flex items-center px-0.5">
                            <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark-900 dark:text-white mb-0.5">
                            Analytics Cookies
                          </h4>
                          <p className="text-dark-600 dark:text-dark-400 leading-snug">
                            Help us understand visitor interactions and improve
                            our website.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-4 bg-primary-600 rounded-full flex items-center px-0.5">
                            <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-dark-900 dark:text-white mb-0.5">
                            Marketing Cookies
                          </h4>
                          <p className="text-dark-600 dark:text-dark-400 leading-snug">
                            Track visitors to display relevant ads and measure
                            campaigns.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
