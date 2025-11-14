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
  {
    name: "Pending Appointments",
    value: "8",
    icon: Calendar,
    change: "+3",
    changeType: "neutral",
  },
  {
    name: "Monthly Revenue",
    value: "$12,450",
    icon: DollarSign,
    change: "+12%",
    changeType: "positive",
  },
];

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.user.role !== "ADMIN") {
      router.push("/admin/appointments");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      {/* Main Content */}
      <div className="lg:ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-dark-600 dark:text-dark-400">
              Welcome back, {session?.user?.name}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === "positive"
                            ? "text-green-600"
                            : stat.changeType === "negative"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-dark-900 dark:text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-dark-600 dark:text-dark-400">
                      {stat.name}
                    </p>
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
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/admin/services"
                  className="p-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white hover:shadow-lg transition-all group"
                >
                  <Scissors className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold mb-1">Manage Services</h3>
                  <p className="text-sm text-primary-100">
                    Add, edit, or remove services
                  </p>
                </a>

                <a
                  href="/admin/products"
                  className="p-6 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl text-white hover:shadow-lg transition-all group"
                >
                  <ShoppingBag className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold mb-1">Manage Products</h3>
                  <p className="text-sm text-secondary-100">
                    Update inventory and pricing
                  </p>
                </a>

                <a
                  href="/admin/appointments"
                  className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white hover:shadow-lg transition-all group"
                >
                  <Calendar className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-bold mb-1">View Appointments</h3>
                  <p className="text-sm text-purple-100">
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
