"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  ShoppingBag,
  Scissors,
  Calendar,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Card from "@/components/ui/Card";

const stats = [
  {
    name: "Total Services",
    value: "12",
    icon: Scissors,
    change: "+2",
    changeType: "positive",
  },
  {
    name: "Total Products",
    value: "48",
    icon: ShoppingBag,
    change: "+5",
    changeType: "positive",
  },
];

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user.role !== "ADMIN") {
      router.push("/halo-admin-portal-2024/appointments");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      {/* Main Content */}
      <div className="pt-24 px-4 pb-8 sm:p-8 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 dark:text-white mb-1">
              Admin Dashboard
            </h1>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              Welcome back, {session?.user?.name}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2.5 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-lg">
                          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl font-bold text-dark-900 dark:text-white mb-0.5">
                            {stat.value}
                          </h3>
                          <p className="text-xs text-dark-600 dark:text-dark-400 truncate">
                            {stat.name}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          stat.changeType === "positive"
                            ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                            : stat.changeType === "negative"
                            ? "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                            : "text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-dark-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <a
                  href="/halo-admin-portal-2024/services"
                  className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white hover:shadow-xl hover:scale-105 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Scissors className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-base font-bold">Manage Services</h3>
                  </div>
                  <p className="text-xs text-primary-100 pl-9">
                    Add, edit, or remove services
                  </p>
                </a>

                <a
                  href="/halo-admin-portal-2024/products"
                  className="p-4 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl text-white hover:shadow-xl hover:scale-105 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-base font-bold">Manage Products</h3>
                  </div>
                  <p className="text-xs text-secondary-100 pl-9">
                    Update inventory and pricing
                  </p>
                </a>

                <a
                  href="/halo-admin-portal-2024/appointments"
                  className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white hover:shadow-xl hover:scale-105 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-base font-bold">View Appointments</h3>
                  </div>
                  <p className="text-xs text-purple-100 pl-9">
                    Approve or decline bookings
                  </p>
                </a>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
