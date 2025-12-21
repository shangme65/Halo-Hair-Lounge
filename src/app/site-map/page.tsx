"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Home,
  Scissors,
  ShoppingBag,
  Calendar,
  Phone,
  Info,
  Shield,
  FileText,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const siteLinks = [
  {
    category: "Main Pages",
    icon: Home,
    color: "from-primary-500 to-primary-600",
    links: [
      { name: "Home", href: "/", description: "Welcome to Halo Hair Lounge" },
      {
        name: "About Us",
        href: "/about",
        description: "Learn about our story and team",
      },
      {
        name: "Contact",
        href: "/contact",
        description: "Get in touch with us",
      },
    ],
  },
  {
    category: "Services",
    icon: Scissors,
    color: "from-blue-500 to-blue-600",
    links: [
      {
        name: "All Services",
        href: "/services",
        description: "Browse our complete service menu",
      },
      {
        name: "Book Appointment",
        href: "/book",
        description: "Schedule your next visit",
      },
    ],
  },
  {
    category: "Shop",
    icon: ShoppingBag,
    color: "from-purple-500 to-purple-600",
    links: [
      {
        name: "Products",
        href: "/products",
        description: "Premium hair care products",
      },
    ],
  },
  {
    category: "Legal",
    icon: Shield,
    color: "from-slate-500 to-slate-600",
    links: [
      {
        name: "Privacy Policy",
        href: "/privacy",
        description: "How we protect your data",
      },
      {
        name: "Terms of Service",
        href: "/terms",
        description: "Our terms and conditions",
      },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
              <MapPin size={16} />
              Site Navigation
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-dark-900 dark:text-white mb-4">
              Sitemap
            </h1>
            <p className="text-lg text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Find everything you need at Halo Hair Lounge. Navigate our website
              easily with this comprehensive sitemap.
            </p>
          </motion.div>

          {/* Site Links Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {siteLinks.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg overflow-hidden border border-dark-100 dark:border-dark-700"
                >
                  {/* Category Header */}
                  <div
                    className={`bg-gradient-to-r ${category.color} p-5 text-white`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Icon size={24} />
                      </div>
                      <h2 className="text-xl font-bold">{category.category}</h2>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="p-4">
                    <ul className="space-y-2">
                      {category.links.map((link, linkIndex) => (
                        <motion.li
                          key={link.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: categoryIndex * 0.1 + linkIndex * 0.05,
                          }}
                        >
                          <Link
                            href={link.href}
                            className="group flex items-center justify-between p-4 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-all duration-200"
                          >
                            <div>
                              <h3 className="font-semibold text-dark-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {link.name}
                              </h3>
                              <p className="text-sm text-dark-500 dark:text-dark-400">
                                {link.description}
                              </p>
                            </div>
                            <ChevronRight
                              size={20}
                              className="text-dark-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all"
                            />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-8">
              Quick Actions
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
              >
                <Calendar size={20} />
                Book Appointment
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                <Scissors size={20} />
                View Services
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"
              >
                <ShoppingBag size={20} />
                Shop Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-dark-600 hover:bg-dark-700 text-white rounded-xl font-medium transition-colors"
              >
                <Phone size={20} />
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
