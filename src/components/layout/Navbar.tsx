"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  Bell,
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
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, update } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    // Set initial state immediately
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const notificationDropdown = target.closest(".notification-dropdown");
      if (showNotifications && !notificationDropdown) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  // Listen for session updates (e.g., after admin account deletion)
  useEffect(() => {
    const handleSessionUpdate = () => {
      update(); // Force session refresh
    };

    window.addEventListener("sessionUpdated", handleSessionUpdate);
    return () =>
      window.removeEventListener("sessionUpdated", handleSessionUpdate);
  }, [update]);

  // Fetch notification count for admin users
  const fetchNotificationCount = async () => {
    if (!session?.user || session.user.role !== "ADMIN") return;

    try {
      const res = await fetch("/api/halo-admin-api/notifications/unread-count");
      if (res.ok) {
        const data = await res.json();
        setNotificationCount(data.count);
      }
    } catch (error) {
      console.error("Failed to fetch notification count:", error);
    }
  };

  // Fetch notifications for dropdown
  const fetchNotifications = async () => {
    if (!session?.user || session.user.role !== "ADMIN") return;

    try {
      const res = await fetch("/api/halo-admin-api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.slice(0, 5)); // Show only 5 recent notifications
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (mounted && session?.user?.role === "ADMIN") {
      fetchNotificationCount();

      // Refresh count every 30 seconds
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [mounted, session]);

  // Mark notifications as read
  const markAsRead = async (notificationIds: string[]) => {
    try {
      await fetch("/api/halo-admin-api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds }),
      });
      fetchNotificationCount();
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

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
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          backgroundColor: scrolled ? "rgba(255, 255, 255, 1)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          transition: "none",
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
              {/* Notification Icon for Admin */}
              {mounted && session && isAdmin && (
                <div className="relative notification-dropdown">
                  <button
                    onClick={() => {
                      if (showNotifications) {
                        setShowNotifications(false);
                      } else {
                        setShowNotifications(true);
                        fetchNotifications();
                      }
                    }}
                    className="p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors relative cursor-pointer"
                  >
                    <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                        {notificationCount > 99 ? "99+" : notificationCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowNotifications(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 top-12 w-80 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-dark-200 dark:border-dark-700 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-4 border-b border-dark-200 dark:border-dark-700">
                            <h3 className="font-semibold text-dark-900 dark:text-white">
                              Notifications
                            </h3>
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.length > 0 ? (
                              notifications.map((notification: any) => (
                                <div
                                  key={notification.id}
                                  className={`p-3 border-b border-dark-100 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-700 cursor-pointer ${
                                    !notification.isRead
                                      ? "bg-blue-50 dark:bg-blue-900/10"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    if (notification.link) {
                                      router.push(notification.link);
                                    }
                                    if (!notification.isRead) {
                                      markAsRead([notification.id]);
                                    }
                                    setShowNotifications(false);
                                  }}
                                >
                                  <div className="flex items-start space-x-2">
                                    {!notification.isRead && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    )}
                                    <div className="flex-1">
                                      <p className="font-medium text-sm text-dark-900 dark:text-white">
                                        {notification.title}
                                      </p>
                                      <p className="text-xs text-dark-600 dark:text-dark-400 mt-1">
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">
                                        {new Date(
                                          notification.createdAt
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center text-dark-500 dark:text-dark-400">
                                No notifications
                              </div>
                            )}
                          </div>
                          {notifications.length > 0 && (
                            <div className="p-3 border-t border-dark-200 dark:border-dark-700">
                              <button
                                onClick={() => {
                                  const unreadIds = notifications
                                    .filter((n: any) => !n.isRead)
                                    .map((n: any) => n.id);
                                  if (unreadIds.length > 0) {
                                    markAsRead(unreadIds);
                                  }
                                  setShowNotifications(false);
                                }}
                                className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:ring-0 border-0 active:outline-none hover:border-0 active:border-0 focus:border-0"
                                style={{
                                  outline: "none",
                                  border: "none",
                                  boxShadow: "none",
                                }}
                              >
                                Mark all as read
                              </button>
                            </div>
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

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
                    className="flex items-center gap-0.5 py-1 px-1.5 text-xs h-7 transition-shadow duration-500 ease-in-out hover:!shadow-[inset_0_-3px_2px_0_rgba(0,0,0,0.25),inset_2px_0_2px_0_rgba(255,255,255,0.15),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_4px_0_0_rgba(34,197,94,0.8),0_5px_0_0_rgba(34,197,94,0.6),0_6px_0_0_rgba(34,197,94,0.4),0_10px_12px_-3px_rgba(0,0,0,0.5),0_15px_25px_-5px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(34,197,94,0.7)]"
                    onClick={() => setShowSignOutDialog(true)}
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Notification Icon for Admin */}
              {mounted && session && isAdmin && (
                <button
                  onClick={() => {
                    fetchNotifications();
                    router.push("/halo-admin-portal-2024/notifications");
                  }}
                  className="p-2 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="p-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
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
              className="fixed top-0 right-0 bottom-0 w-56 bg-white dark:bg-dark-900 shadow-2xl z-[120] lg:hidden overflow-y-auto"
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
                      className="flex items-center gap-0.5 py-1 px-1.5 text-xs h-7 mx-auto transition-shadow duration-500 ease-in-out hover:!shadow-[inset_0_-3px_2px_0_rgba(0,0,0,0.25),inset_2px_0_2px_0_rgba(255,255,255,0.15),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_4px_0_0_rgba(34,197,94,0.8),0_5px_0_0_rgba(34,197,94,0.6),0_6px_0_0_rgba(34,197,94,0.4),0_10px_12px_-3px_rgba(0,0,0,0.5),0_15px_25px_-5px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(34,197,94,0.7)]"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowSignOutDialog(true);
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

      {/* Sign Out Confirmation Dialog */}
      <AnimatePresence>
        {showSignOutDialog && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSignOutDialog(false)}
            >
              <motion.div
                className="bg-white dark:bg-dark-800 rounded-lg shadow-2xl p-6 max-w-sm mx-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">
                  Confirm Sign Out
                </h3>
                <p className="text-dark-600 dark:text-dark-300 mb-6">
                  Are you sure you want to sign out?
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => setShowSignOutDialog(false)}
                    className="flex items-center justify-center px-4 py-1 text-xs h-7 transition-shadow duration-500 ease-in-out hover:!shadow-[inset_0_-3px_2px_0_rgba(0,0,0,0.25),inset_2px_0_2px_0_rgba(255,255,255,0.15),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_4px_0_0_rgba(34,197,94,0.8),0_5px_0_0_rgba(34,197,94,0.6),0_6px_0_0_rgba(34,197,94,0.4),0_10px_12px_-3px_rgba(0,0,0,0.5),0_15px_25px_-5px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(34,197,94,0.7)]"
                    variant="outline"
                  >
                    No
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSignOutDialog(false);
                      signOut({ callbackUrl: "/admin-setup", redirect: true });
                    }}
                    className="flex items-center justify-center px-4 py-1 text-xs h-7 bg-red-600 hover:bg-red-700 hover:shadow-2xl hover:shadow-red-500/50 transition-shadow duration-500 ease-in-out"
                  >
                    Yes
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
