"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Scissors,
  ShoppingBag,
  Calendar,
  Users,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const allNavigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard, roles: ["ADMIN"] },
  {
    name: "Services",
    href: "/admin/services",
    icon: Scissors,
    roles: ["ADMIN"],
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
    roles: ["ADMIN"],
  },
  {
    name: "Appointments",
    href: "/admin/appointments",
    icon: Calendar,
    roles: ["ADMIN", "STAFF"],
  },
  { name: "Users", href: "/admin/users", icon: Users, roles: ["ADMIN"] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter navigation based on user role
  const navigation = allNavigation.filter((item) =>
    item.roles.includes(session?.user?.role || "")
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-24 left-4 z-50 p-2 bg-dark-800 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={`
          fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-dark-900 border-r border-dark-800
          z-40 lg:translate-x-0 transition-transform duration-300
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-600/50"
                        : "text-dark-400 hover:text-white hover:bg-dark-800"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-dark-800">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 top-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
