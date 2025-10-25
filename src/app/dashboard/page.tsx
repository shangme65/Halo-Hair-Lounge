"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  service: {
    name: string;
    price: number;
    duration: number;
  };
}

const statusConfig = {
  PENDING: {
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-100 dark:bg-yellow-900/20",
    label: "Pending",
  },
  CONFIRMED: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/20",
    label: "Confirmed",
  },
  COMPLETED: {
    icon: CheckCircle,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/20",
    label: "Completed",
  },
  CANCELLED: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100 dark:bg-red-900/20",
    label: "Cancelled",
  },
  NO_SHOW: {
    icon: AlertCircle,
    color: "text-gray-600",
    bg: "bg-gray-100 dark:bg-gray-900/20",
    label: "No Show",
  },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAppointments();
    }
  }, [status]);

  if (status === "unauthenticated") {
    redirect("/auth/signin");
  }

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Welcome back, {session?.user.name}!
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400">
            Manage your appointments and account
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-primary-600" />
                  Your Appointments
                </h2>
                <Button
                  size="sm"
                  onClick={() => (window.location.href = "/book")}
                >
                  Book New
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-dark-100 dark:bg-dark-800 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto text-dark-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No appointments yet
                  </h3>
                  <p className="text-dark-600 dark:text-dark-400 mb-6">
                    Book your first appointment to get started
                  </p>
                  <Button onClick={() => (window.location.href = "/book")}>
                    Book Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => {
                    const config =
                      statusConfig[
                        appointment.status as keyof typeof statusConfig
                      ];
                    const Icon = config.icon;

                    return (
                      <Card
                        key={appointment.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">
                                {appointment.service.name}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
                              >
                                <Icon className="w-3 h-3 inline mr-1" />
                                {config.label}
                              </span>
                            </div>
                            <div className="text-sm text-dark-600 dark:text-dark-400 space-y-1">
                              <p className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(appointment.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                              <p className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {appointment.startTime} - {appointment.endTime}{" "}
                                ({appointment.service.duration} min)
                              </p>
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-dark-500 mt-2 italic">
                                Note: {appointment.notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary-600">
                              ${appointment.service.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => (window.location.href = "/book")}
                >
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/store")}
                >
                  Shop Products
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/services")}
                >
                  View Services
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-semibold mb-4">Account Info</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-dark-600 dark:text-dark-400">
                    Name:
                  </span>
                  <p className="font-medium">{session?.user.name}</p>
                </div>
                <div>
                  <span className="text-dark-600 dark:text-dark-400">
                    Email:
                  </span>
                  <p className="font-medium">{session?.user.email}</p>
                </div>
                <div>
                  <span className="text-dark-600 dark:text-dark-400">
                    Member since:
                  </span>
                  <p className="font-medium">{new Date().getFullYear()}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
