"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, UserCheck, AlertCircle } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Shield,
      title: "Information We Collect",
      content: [
        "Personal identification information (Name, email address, phone number)",
        "Appointment booking details and preferences",
        "Payment and billing information",
        "Service history and product purchases",
        "Website usage data and analytics",
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "Process and manage your appointments",
        "Send booking confirmations and reminders",
        "Process payments and maintain transaction records",
        "Provide customer support and respond to inquiries",
        "Send promotional offers and updates (with your consent)",
        "Improve our services and website experience",
      ],
    },
    {
      icon: Eye,
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "We may share information with trusted service providers who assist in operating our website",
        "Information may be disclosed when required by law or to protect our rights",
        "Payment processing is handled by secure third-party payment processors",
      ],
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access, update, or delete your personal information",
        "Opt-out of marketing communications at any time",
        "Request a copy of your data",
        "Object to certain processing of your information",
        "Withdraw consent where we rely on it",
      ],
    },
    {
      icon: AlertCircle,
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your data",
        "SSL encryption for all data transmission",
        "Regular security audits and updates",
        "Secure payment processing through certified providers",
        "Limited access to personal information by authorized personnel only",
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-dark-600 dark:text-dark-400">
              Last Updated: October 25, 2025
            </p>
            <p className="mt-4 text-dark-700 dark:text-dark-300">
              At Halo Hair Lounge, we are committed to protecting your privacy
              and ensuring the security of your personal information. This
              Privacy Policy explains how we collect, use, and safeguard your
              data.
            </p>
          </motion.div>
        </div>

        {/* Privacy Sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-display font-bold mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start space-x-3 text-dark-700 dark:text-dark-300"
                        >
                          <span className="text-primary-600 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cookies Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-dark-800 rounded-2xl p-8 shadow-lg"
          >
            <h2 className="text-2xl font-display font-bold mb-4">
              Cookies and Tracking
            </h2>
            <p className="text-dark-700 dark:text-dark-300 mb-4">
              We use cookies and similar tracking technologies to enhance your
              browsing experience, analyze website traffic, and understand user
              preferences. You can control cookie settings through your browser
              preferences.
            </p>
            <div className="space-y-2 text-dark-700 dark:text-dark-300">
              <p>
                <strong>Essential Cookies:</strong> Required for website
                functionality
              </p>
              <p>
                <strong>Analytics Cookies:</strong> Help us understand how
                visitors use our site
              </p>
              <p>
                <strong>Marketing Cookies:</strong> Used to deliver relevant
                advertisements
              </p>
            </div>
          </motion.div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center"
          >
            <Mail className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold mb-4">
              Questions About Your Privacy?
            </h2>
            <p className="mb-6 text-white/90">
              If you have any questions about this Privacy Policy or how we
              handle your data, please contact us.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-dark-50 transition-colors"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>

        {/* Updates Section */}
        <div className="max-w-4xl mx-auto mt-8 text-center text-dark-600 dark:text-dark-400">
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date.
          </p>
        </div>
      </div>
    </div>
  );
}
