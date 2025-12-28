"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, ArrowLeft, Search, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-10 w-20 h-20 bg-primary-500/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-500/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10"
        >
          {/* Icon Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 px-6 py-3 mb-6 bg-primary-50 border border-primary-200 rounded-full"
          >
            <Sparkles className="w-6 h-6 text-primary-600" />
            <span className="text-lg font-semibold text-primary-700">
              Oops!
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back on
            track!
          </p>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button
              onClick={() => window.history.back()}
              className="flex items-center gap-0.5 py-1 px-1.5 text-xs h-7 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
            >
              <ArrowLeft size={12} />
              Back
            </Button>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500 mb-4">Quick Links</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/services"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
              >
                Our Services
              </Link>
              <Link
                href="/book"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
              >
                Book Appointment
              </Link>
              <Link
                href="/about"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
