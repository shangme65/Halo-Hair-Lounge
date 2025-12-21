"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Check,
  X,
  Clock,
  Calendar as CalendarIcon,
  User,
  Phone,
  Mail,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronDown,
  ArrowLeft,
  Scissors,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import toast from "react-hot-toast";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  notes?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  service: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
}

const statusConfig = {
  PENDING: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-400",
    headerBg: "bg-gradient-to-r from-amber-500 to-amber-600",
    icon: Clock,
    dot: "bg-amber-500",
    title: "Pending Appointments",
    description: "Appointments waiting for approval",
  },
  CONFIRMED: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-400",
    headerBg: "bg-gradient-to-r from-blue-500 to-blue-600",
    icon: CheckCircle,
    dot: "bg-blue-500",
    title: "Confirmed Appointments",
    description: "Approved and scheduled appointments",
  },
  COMPLETED: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-400",
    headerBg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    icon: CheckCircle,
    dot: "bg-emerald-500",
    title: "Completed Appointments",
    description: "Successfully finished appointments",
  },
  CANCELLED: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-400",
    headerBg: "bg-gradient-to-r from-red-500 to-red-600",
    icon: XCircle,
    dot: "bg-red-500",
    title: "Cancelled Appointments",
    description: "Declined or cancelled appointments",
  },
};

export default function AppointmentStatusPage({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const resolvedParams = use(params);
  const status = resolvedParams.status.toUpperCase();
  const config = statusConfig[status as keyof typeof statusConfig];

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/halo-admin-api/appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/halo-admin-api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update appointment");

      toast.success(`Appointment ${newStatus.toLowerCase()}!`);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update appointment");
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.service.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = appointment.status === status;

    return matchesSearch && matchesStatus;
  });

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Invalid status</p>
      </div>
    );
  }

  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Back Button */}
          <Link
            href="/halo-admin-portal-2024/appointments"
            className="inline-flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to All Appointments
          </Link>

          {/* Header Card */}
          <div
            className={`${config.headerBg} rounded-2xl p-5 mb-6 text-white shadow-lg`}
          >
            {/* Top Row - Title and Count */}
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl sm:text-2xl font-bold">{config.title}</h1>
              <div className="bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <span className="text-2xl sm:text-3xl font-bold">
                  {filteredAppointments.length}
                </span>
                <span className="text-sm">total</span>
              </div>
            </div>
            {/* Bottom Row - Icon and Description */}
            <div className="flex items-center gap-2 text-white/80">
              <StatusIcon size={18} />
              <p className="text-sm">{config.description}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700 p-4 mb-4 shadow-sm">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"
              />
              <input
                type="text"
                placeholder="Search by customer name, email, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Appointments List */}
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appointment) => {
                const isExpanded = expandedCard === appointment.id;

                return (
                  <motion.div
                    key={appointment.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white dark:bg-dark-800 rounded-xl border ${config.border} overflow-hidden transition-shadow hover:shadow-md`}
                  >
                    {/* Main Row */}
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer"
                      onClick={() =>
                        setExpandedCard(isExpanded ? null : appointment.id)
                      }
                    >
                      {/* Status Indicator */}
                      <div
                        className={`w-1.5 h-12 rounded-full ${config.dot}`}
                      />

                      {/* Service & Customer */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-semibold text-dark-900 dark:text-white">
                            {appointment.service.name}
                          </h3>
                          <span
                            className={`shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-dark-500 dark:text-dark-400">
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {appointment.user.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={12} />
                            {new Date(appointment.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {appointment.startTime}
                          </span>
                        </div>
                      </div>

                      {/* Price & Expand */}
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          ${appointment.service.price}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`text-dark-400 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-dark-100 dark:border-dark-700"
                        >
                          <div className="p-4 space-y-4">
                            {/* Customer Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                              <div className="flex items-center gap-2 p-3 rounded-lg bg-dark-50 dark:bg-dark-700/50">
                                <Mail size={14} className="text-dark-400" />
                                <span className="text-dark-600 dark:text-dark-300 truncate">
                                  {appointment.user.email}
                                </span>
                              </div>
                              {appointment.user.phone && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-dark-50 dark:bg-dark-700/50">
                                  <Phone size={14} className="text-dark-400" />
                                  <span className="text-dark-600 dark:text-dark-300">
                                    {appointment.user.phone}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 p-3 rounded-lg bg-dark-50 dark:bg-dark-700/50">
                                <Scissors size={14} className="text-dark-400" />
                                <span className="text-dark-600 dark:text-dark-300">
                                  {appointment.service.duration} min
                                </span>
                              </div>
                            </div>

                            {/* Time Details */}
                            <div className="flex items-center gap-6 text-sm text-dark-500">
                              <span>
                                Time: {appointment.startTime} -{" "}
                                {appointment.endTime}
                              </span>
                              <span>
                                Booked:{" "}
                                {new Date(
                                  appointment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            {appointment.notes && (
                              <div className="text-sm p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                                <span className="font-medium">Note:</span>{" "}
                                {appointment.notes}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-2">
                              {status === "PENDING" && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(appointment.id, "CONFIRMED");
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                  >
                                    <Check size={14} />
                                    Approve
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(appointment.id, "CANCELLED");
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                  >
                                    <X size={14} />
                                    Decline
                                  </button>
                                </>
                              )}
                              {status === "CONFIRMED" && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(appointment.id, "COMPLETED");
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                  >
                                    <CheckCircle size={14} />
                                    Mark Complete
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(appointment.id, "CANCELLED");
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                  >
                                    <X size={14} />
                                    Cancel
                                  </button>
                                </>
                              )}
                              {(status === "COMPLETED" ||
                                status === "CANCELLED") && (
                                <span className="text-sm text-dark-400 italic">
                                  No actions available
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {filteredAppointments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700"
                >
                  <StatusIcon className="w-12 h-12 mx-auto mb-4 text-dark-300 dark:text-dark-600" />
                  <p className="text-lg text-dark-600 dark:text-dark-400">
                    No {status.toLowerCase()} appointments found
                  </p>
                  {searchQuery && (
                    <p className="text-sm text-dark-400 dark:text-dark-500 mt-2">
                      Try adjusting your search query
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
