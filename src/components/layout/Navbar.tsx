"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Calendar,
  Home,
  Info,
  Scissors,
  Mail,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/Button";

const publicNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Services", href: "/services", icon: Scissors },
  { name: "Book Now", href: "/book", icon: Calendar },
  { name: "Contact", href: "/contact", icon: Mail },
];

const adminNavigation = [
  {
    name: "Overview",
    href: "/halo-admin-portal-2024",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  {
    name: "Services",
    href: "/halo-admin-portal-2024/services",
    icon: Scissors,
    roles: ["ADMIN"],
  },
  {
    name: "Products",
    href: "/halo-admin-portal-2024/products",
    icon: ShoppingBag,
    roles: ["ADMIN"],
  },
  {
    name: "Appointments",
    href: "/halo-admin-portal-2024/appointments",
    icon: Calendar,
    roles: ["ADMIN", "STAFF"],
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which navigation to show based on user role
  const isAdmin =
    mounted &&
    (session?.user?.role === "ADMIN" || session?.user?.role === "STAFF");
  const navigation = isAdmin
    ? adminNavigation.filter((item) =>
        item.roles.includes(session?.user?.role || "")
      )
    : publicNavigation;

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md bg-gradient-to-b from-gray-50 to-white dark:from-dark-900 dark:to-dark-950 border-b border-gray-200 dark:border-dark-800/50 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                initial={{
                  x: -100,
                  opacity: 0,
                  filter: "drop-shadow(0 0 20px rgba(34, 197, 94, 0.8))",
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  filter: "drop-shadow(0 0 12px rgba(34, 197, 94, 0.6))",
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                className="relative h-12 w-36 sm:h-16 sm:w-48 md:h-20 md:w-60"
              >
                <Image
                  src="/Halologo1.png"
                  alt="Halo Hair Lounge"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>{" "}
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors ${
                        isActive
                          ? "bg-primary-600 text-white"
                          : "text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-950"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
            {/* Right Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Admin user actions - only show if logged in as admin */}
              {mounted && session && isAdmin && (
                <div className="flex items-center space-x-3">
                  <Link href="/halo-admin-portal-2024">
                    <motion.div
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">{session.user.name}</span>
                    </motion.div>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Sidebar - Outside nav for proper z-index */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-[110] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-dark-900 shadow-2xl z-[120] lg:hidden overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="p-6">
                {/* Close button */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                    aria-label="Close mobile menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 mb-8">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link key={item.name} href={item.href}>
                        <motion.div
                          className={`px-4 py-3 rounded-xl flex items-center space-x-3 ${
                            isActive
                              ? "bg-primary-600 text-white"
                              : "text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-950"
                          }`}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.name}</span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                {/* Admin User Actions - only show if logged in as admin */}
                {mounted && session && isAdmin && (
                  <div className="pt-4 border-t border-dark-200 dark:border-dark-800 space-y-2">
                    <Link
                      href="/halo-admin-portal-2024"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="px-4 py-3 rounded-xl flex items-center space-x-3 hover:bg-primary-50 dark:hover:bg-primary-950">
                        <User className="w-5 h-5" />
                        <span className="font-medium">{session.user.name}</span>
                      </div>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
