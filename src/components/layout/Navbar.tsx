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
  FileEdit,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/Button";

const publicNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Services", href: "/services", icon: Scissors },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Book Now", href: "/book", icon: Calendar },
  { name: "Contact", href: "/contact", icon: Mail },
  { name: "About", href: "/about", icon: Info },
];

const adminNavigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    roles: ["ADMIN", "STAFF"],
  },
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
  {
    name: "Edit Page",
    href: "/halo-admin-portal-2024/edit-page",
    icon: FileEdit,
    roles: ["ADMIN"],
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, update } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for session updates (e.g., after admin account deletion)
  useEffect(() => {
    const handleSessionUpdate = () => {
      update(); // Force session refresh
    };

    window.addEventListener("sessionUpdated", handleSessionUpdate);
    return () =>
      window.removeEventListener("sessionUpdated", handleSessionUpdate);
  }, [update]);

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
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(255, 255, 255, 1)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                initial={{
                  x: -100,
                  opacity: 0,
                  filter:
                    "drop-shadow(0 0 10px rgba(0, 0, 0, 0.4)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3))",
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  filter:
                    "drop-shadow(0 0 6px rgba(0, 0, 0, 0.4)) drop-shadow(0 2px 1px rgba(0, 0, 0, 0.2))",
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                className="relative h-16 w-44 sm:h-24 sm:w-64 md:h-28 md:w-80"
              >
                <Image
                  src="/Halologo1.png"
                  alt="Halo Hair Lounge"
                  fill
                  className="object-contain"
                  priority
                  unoptimized
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      signOut({ callbackUrl: "/admin-setup", redirect: true })
                    }
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-green-600" />
              ) : (
                <Menu className="w-6 h-6 text-green-600" />
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
                        setMobileMenuOpen(false);
                        signOut({
                          callbackUrl: "/admin-setup",
                          redirect: true,
                        });
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
