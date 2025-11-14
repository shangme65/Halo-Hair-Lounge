"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import Button from "./Button";
import Link from "next/link";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

  const handleRejectAll = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString(),
      })
    );
    setShowBanner(false);
  };

  const handleSaveSettings = (settings: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
  }) => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        ...settings,
        necessary: true, // Always true
        timestamp: new Date().toISOString(),
      })
    );
    setShowBanner(false);
    setShowSettings(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-dark-200 dark:border-dark-700 p-6 md:p-8">
              {!showSettings ? (
                // Main Banner
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0">
                      <Cookie className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">
                        We Value Your Privacy
                      </h3>
                      <p className="text-sm text-dark-600 dark:text-dark-400 leading-relaxed">
                        By clicking "Accept All Cookies", you agree to the
                        storing of cookies on your device to enhance site
                        navigation, analyze site usage, and assist in our
                        marketing efforts. View our{" "}
                        <Link
                          href="/privacy"
                          className="text-primary-600 hover:text-primary-700 underline"
                        >
                          Privacy Policy
                        </Link>{" "}
                        for more information.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-6 py-2.5 text-sm font-medium text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white transition-colors whitespace-nowrap border border-dark-300 dark:border-dark-600 rounded-lg hover:bg-dark-50 dark:hover:bg-dark-700"
                    >
                      Cookie Settings
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="px-6 py-2.5 text-sm font-medium text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white transition-colors whitespace-nowrap rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700"
                    >
                      Reject All
                    </button>
                    <Button
                      onClick={handleAcceptAll}
                      className="whitespace-nowrap"
                    >
                      Accept All Cookies
                    </Button>
                  </div>
                </div>
              ) : (
                // Settings Panel
                <CookieSettings
                  onSave={handleSaveSettings}
                  onClose={() => setShowSettings(false)}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CookieSettings({
  onSave,
  onClose,
}: {
  onSave: (settings: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
  }) => void;
  onClose: () => void;
}) {
  const [settings, setSettings] = useState({
    necessary: true,
    analytics: true,
    marketing: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    if (key === "necessary") return; // Can't disable necessary cookies
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-dark-900 dark:text-white">
          Cookie Settings
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Necessary Cookies */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-dark-200 dark:border-dark-700">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-dark-900 dark:text-white">
                Necessary Cookies
              </h4>
              <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded">
                Always Active
              </span>
            </div>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              These cookies are essential for the website to function properly.
              They enable core functionality such as security, authentication,
              and shopping cart management.
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-6 bg-primary-600 rounded-full flex items-center px-1">
              <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Analytics Cookies */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-dark-200 dark:border-dark-700">
          <div className="flex-1">
            <h4 className="font-semibold text-dark-900 dark:text-white mb-2">
              Analytics Cookies
            </h4>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              These cookies help us understand how visitors interact with our
              website by collecting and reporting information anonymously.
            </p>
          </div>
          <button
            onClick={() => toggleSetting("analytics")}
            className="flex-shrink-0"
            aria-label="Toggle analytics cookies"
          >
            <div
              className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                settings.analytics
                  ? "bg-primary-600"
                  : "bg-dark-300 dark:bg-dark-600"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.analytics ? "ml-auto" : ""
                }`}
              ></div>
            </div>
          </button>
        </div>

        {/* Marketing Cookies */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold text-dark-900 dark:text-white mb-2">
              Marketing Cookies
            </h4>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              These cookies are used to track visitors across websites to
              display relevant advertisements and measure marketing campaign
              effectiveness.
            </p>
          </div>
          <button
            onClick={() => toggleSetting("marketing")}
            className="flex-shrink-0"
            aria-label="Toggle marketing cookies"
          >
            <div
              className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                settings.marketing
                  ? "bg-primary-600"
                  : "bg-dark-300 dark:bg-dark-600"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.marketing ? "ml-auto" : ""
                }`}
              ></div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex gap-3 mt-8 pt-6 border-t border-dark-200 dark:border-dark-700">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-2.5 text-sm font-medium text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white transition-colors border border-dark-300 dark:border-dark-600 rounded-lg hover:bg-dark-50 dark:hover:bg-dark-700"
        >
          Cancel
        </button>
        <Button onClick={() => onSave(settings)} className="flex-1">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
