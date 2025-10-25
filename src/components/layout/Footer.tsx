"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const footerLinks = {
  Services: [
    { name: "Haircuts", href: "/services#haircuts" },
    { name: "Coloring", href: "/services#coloring" },
    { name: "Treatments", href: "/services#treatments" },
    { name: "Extensions", href: "/services#extensions" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
  ],
  Support: [
    { name: "FAQ", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Returns", href: "/returns" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-dark-900 to-dark-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-4">
                Halo Hair Lounge
              </h3>
              <p className="text-dark-300 mb-6 leading-relaxed">
                Premium hair care and styling services. Experience luxury,
                creativity, and personalized attention at our modern salon.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-dark-300 hover:text-white transition-colors">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <span>123 Beauty Street, Style City, SC 12345</span>
                </div>
                <div className="flex items-center space-x-3 text-dark-300 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-primary-500" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-dark-300 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 text-primary-500" />
                  <span>hello@halohairlounge.com</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-dark-300 hover:text-primary-400 transition-colors inline-block"
                    >
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="inline-block"
                      >
                        {link.name}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-16 pt-8 border-t border-dark-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="p-3 bg-dark-800 rounded-xl hover:bg-primary-600 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>

            <p className="text-dark-400 text-sm">
              © {new Date().getFullYear()} Halo Hair Lounge. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
