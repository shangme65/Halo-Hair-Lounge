"use client";

import Link from "next/link";
import Image from "next/image";
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
    { name: "Haircut", href: "/services#haircut" },
    { name: "Color", href: "/services#color" },
    { name: "Styling", href: "/services#styling" },
    { name: "Scalp treatments", href: "/services#scalp_treatments" },
    {
      name: "Chemical straightening",
      href: "/services#chemical_straightening",
    },
    { name: "Keratin treatments", href: "/services#keratin_treatments" },
    { name: "Hair loss treatments", href: "/services#hair_loss_treatments" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-dark-900 via-green-950 to-dark-950 text-white overflow-hidden">
      {/* Animated background with green gradient overlays */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-green-500 to-primary-600 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-primary-500 to-green-600 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-green-400 to-primary-500 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative h-24 w-64 mb-4">
                <Image
                  src="/Halologo2.png"
                  alt="Halo Hair Lounge"
                  fill
                  className="object-contain"
                  style={{
                    filter:
                      "drop-shadow(0 0 12px rgba(34, 197, 94, 0.5)) drop-shadow(0 0 20px rgba(134, 239, 172, 0.3)) brightness(1.15)",
                  }}
                />
              </div>
              <p className="text-dark-300 mb-6 leading-relaxed">
                Premium hair care and styling services. Experience luxury,
                creativity, and personalized attention at our modern salon.
              </p>
            </motion.div>
          </div>

          {/* Links Sections - Services and Company in same row */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8">
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
                        className="text-dark-300 hover:text-green-400 transition-colors inline-block"
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
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-16 pt-8 border-t border-dark-800/50 bg-gradient-to-r from-transparent via-green-950/30 to-transparent">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="p-3 bg-gradient-to-br from-dark-800 to-green-950/50 rounded-xl hover:from-green-600 hover:to-primary-600 border border-green-900/30 hover:border-green-500/50 transition-all shadow-lg shadow-green-900/20"
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
