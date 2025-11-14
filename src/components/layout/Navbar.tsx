"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Calendar,
  Home,
  Info,
  Scissors,
  Mail,
  Store,
  LayoutDashboard,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cart";

const publicNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: Info },
  { name: "Services", href: "/services", icon: Scissors },
  { name: "Store", href: "/store", icon: Store },
  { name: "Book Now", href: "/book", icon: Calendar },
  { name: "Contact", href: "/contact", icon: Mail },
];

const adminNavigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard, roles: ["ADMIN"] },
  { name: "Services", href: "/admin/services", icon: Scissors, roles: ["ADMIN"] },
  { name: "Products", href: "/admin/products", icon: ShoppingBag, roles: ["ADMIN"] },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar, roles: ["ADMIN", "STAFF"] },
  { name: "Users", href: "/admin/users", icon: Users, roles: ["ADMIN"] },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Determine which navigation to show based on user role
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "STAFF";
  const navigation = isAdmin 
    ? adminNavigation.filter(item => item.roles.includes(session?.user?.role || ""))
    : publicNavigation;

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md bg-gradient-to-b from-dark-900 to-dark-950 border-b border-dark-800/50"
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
                  filter: "drop-shadow(0 0 20px rgba(14, 165, 233, 0.8))",
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                  filter: "drop-shadow(0 0 12px rgba(14, 165, 233, 0.6))",
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                className="relative h-16 w-48"
              >
                <Image
                  src="/HaloLogo5.png"
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
              {/* Show cart only for non-admin users */}
              {!isAdmin && (
                <Link href="/cart">
                  <motion.div
                    className="p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </motion.div>
                </Link>
              )}

              {session ? (
                <div className="flex items-center space-x-3">
                  <Link href={isAdmin ? "/admin" : "/dashboard"}>
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
              ) : (
                <Link href="/auth/signin">
                  <Button size="sm">Sign In</Button>
                </Link>
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

                {/* Cart - Only show for non-admin users */}
                {!isAdmin && (
                  <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                    <div className="px-4 py-3 rounded-xl flex items-center justify-between hover:bg-primary-50 dark:hover:bg-primary-950 mb-4">
                      <div className="flex items-center space-x-3">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="font-medium">Cart</span>
                      </div>
                      {totalItems > 0 && (
                        <span className="bg-primary-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </div>
                  </Link>
                )}

                {/* User Actions */}
                <div className="pt-4 border-t border-dark-200 dark:border-dark-800 space-y-2">
                  {session ? (
                    <>
                      <Link
                        href={isAdmin ? "/admin" : "/dashboard"}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="px-4 py-3 rounded-xl flex items-center space-x-3 hover:bg-primary-50 dark:hover:bg-primary-950">
                          <User className="w-5 h-5" />
                          <span className="font-medium">
                            {session.user.name}
                          </span>
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
                    </>
                  ) : (
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full">Sign In</Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
