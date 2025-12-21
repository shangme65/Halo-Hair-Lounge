"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
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
  TrendingUp,
  Scissors,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
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
    icon: Clock,
    dot: "bg-amber-500",
  },
  CONFIRMED: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-400",
    icon: CheckCircle,
    dot: "bg-blue-500",
  },
  COMPLETED: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle,
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-400",
    icon: XCircle,
    dot: "bg-red-500",
  },
};

const filterOptions = [
  { value: "ALL", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

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

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/halo-admin-api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update appointment");

      toast.success(`Appointment ${status.toLowerCase()}!`);
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
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: appointments.filter((a) => a.status === "PENDING").length,
    confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
    total: appointments.length,
    revenue: appointments
      .filter((a) => a.status === "COMPLETED")
      .reduce((sum, a) => sum + a.service.price, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Compact Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-dark-900 dark:text-white flex items-center gap-2">
                <CalendarIcon size={24} className="text-primary-600" />
                Appointments
              </h1>
              <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">
                Manage and track bookings
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-dark-500">
              <TrendingUp size={14} className="text-emerald-500" />
              <span className="font-medium text-emerald-600">
                ${stats.revenue}
              </span>
              <span>revenue</span>
            </div>
          </div>

          {/* Stats Cards - Link to Status Pages */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[
              {
                label: "Pending",
                value: stats.pending,
                color: "amber",
                icon: Clock,
                href: "/halo-admin-portal-2024/appointments/pending",
              },
              {
                label: "Confirmed",
                value: stats.confirmed,
                color: "blue",
                icon: CheckCircle,
                href: "/halo-admin-portal-2024/appointments/confirmed",
              },
              {
                label: "Completed",
                value: stats.completed,
                color: "emerald",
                icon: CheckCircle,
                href: "/halo-admin-portal-2024/appointments/completed",
              },
              {
                label: "Cancelled",
                value: stats.cancelled,
                color: "red",
                icon: XCircle,
                href: "/halo-admin-portal-2024/appointments/cancelled",
              },
            ].map((stat) => (
              <motion.a
                key={stat.label}
                href={stat.href}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 p-4 rounded-xl border bg-white dark:bg-dark-800 cursor-pointer transition-all hover:shadow-lg ${
                  stat.color === "amber"
                    ? "border-amber-200 dark:border-amber-800 hover:border-amber-400"
                    : stat.color === "blue"
                    ? "border-blue-200 dark:border-blue-800 hover:border-blue-400"
                    : stat.color === "emerald"
                    ? "border-emerald-200 dark:border-emerald-800 hover:border-emerald-400"
                    : "border-red-200 dark:border-red-800 hover:border-red-400"
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    stat.color === "amber"
                      ? "bg-amber-100 dark:bg-amber-900/30"
                      : stat.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : stat.color === "emerald"
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : "bg-red-100 dark:bg-red-900/30"
                  }`}
                >
                  <stat.icon
                    size={18}
                    className={`${
                      stat.color === "amber"
                        ? "text-amber-600 dark:text-amber-400"
                        : stat.color === "blue"
                        ? "text-blue-600 dark:text-blue-400"
                        : stat.color === "emerald"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-2xl sm:text-3xl font-bold leading-none ${
                      stat.color === "amber"
                        ? "text-amber-600 dark:text-amber-400"
                        : stat.color === "blue"
                        ? "text-blue-600 dark:text-blue-400"
                        : stat.color === "emerald"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-base font-semibold text-dark-700 dark:text-dark-300 mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400"
              />
              <input
                type="text"
                placeholder="Search by customer or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {/* Custom Dropdown Filter */}
            <div className="relative">
              <button
                onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg hover:border-primary-400 focus:ring-2 focus:ring-primary-500 transition-colors min-w-[140px]"
              >
                <Filter size={14} className="text-dark-400" />
                <span className="flex-1 text-left text-dark-700 dark:text-dark-200">
                  {filterOptions.find((o) => o.value === statusFilter)?.label}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-dark-400 transition-transform ${
                    filterDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {filterDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setFilterDropdownOpen(false)}
                    />
                    {/* Dropdown Menu */}
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 z-20 w-48 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl shadow-lg overflow-hidden"
                    >
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setStatusFilter(option.value);
                            setFilterDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                            statusFilter === option.value
                              ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                              : "text-dark-700 dark:text-dark-200 hover:bg-dark-50 dark:hover:bg-dark-700"
                          }`}
                        >
                          <span>{option.label}</span>
                          {statusFilter === option.value && (
                            <div className="w-4 h-4 rounded-full border-2 border-primary-600 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-primary-600" />
                            </div>
                          )}
                          {statusFilter !== option.value && (
                            <div className="w-4 h-4 rounded-full border-2 border-dark-300 dark:border-dark-600" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Appointments List */}
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAppointments.map((appointment) => {
                const config =
                  statusConfig[appointment.status as keyof typeof statusConfig];
                const isExpanded = expandedCard === appointment.id;

                return (
                  <motion.div
                    key={appointment.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white dark:bg-dark-800 rounded-xl border ${config.border} overflow-hidden transition-shadow hover:shadow-md`}
                  >
                    {/* Main Row - Compact */}
                    <div
                      className="flex items-center gap-3 p-3 cursor-pointer"
                      onClick={() =>
                        setExpandedCard(isExpanded ? null : appointment.id)
                      }
                    >
                      {/* Status Indicator */}
                      <div className={`w-1 h-10 rounded-full ${config.dot}`} />

                      {/* Service & Customer */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-dark-900 dark:text-white truncate">
                            {appointment.service.name}
                          </h3>
                          <span
                            className={`shrink-0 px-1.5 py-0.5 text-[10px] font-medium rounded ${config.bg} ${config.text}`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-dark-500 dark:text-dark-400">
                          <span className="flex items-center gap-1">
                            <User size={10} />
                            {appointment.user.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={10} />
                            {new Date(appointment.date).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {appointment.startTime}
                          </span>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                          ${appointment.service.price}
                        </span>
                        <ChevronDown
                          size={16}
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
                          <div className="p-3 space-y-3">
                            {/* Customer Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-dark-50 dark:bg-dark-700/50">
                                <Mail size={12} className="text-dark-400" />
                                <span className="text-dark-600 dark:text-dark-300 truncate">
                                  {appointment.user.email}
                                </span>
                              </div>
                              {appointment.user.phone && (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-dark-50 dark:bg-dark-700/50">
                                  <Phone size={12} className="text-dark-400" />
                                  <span className="text-dark-600 dark:text-dark-300">
                                    {appointment.user.phone}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-dark-50 dark:bg-dark-700/50">
                                <Scissors size={12} className="text-dark-400" />
                                <span className="text-dark-600 dark:text-dark-300">
                                  {appointment.service.duration} min
                                </span>
                              </div>
                            </div>

                            {/* Time Details */}
                            <div className="flex items-center gap-4 text-xs text-dark-500">
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
                              <div className="text-xs p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                                <span className="font-medium">Note:</span>{" "}
                                {appointment.notes}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 pt-1">
                              {appointment.status === "PENDING" && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(appointment.id, "CONFIRMED");
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                  >
                                    <Check size={12} />
                                    Approve
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(appointment.id, "CANCELLED");
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                  >
                                    <X size={12} />
                                    Decline
                                  </button>
                                </>
                              )}
                              {appointment.status === "CONFIRMED" && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(appointment.id, "COMPLETED");
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                  >
                                    <CheckCircle size={12} />
                                    Complete
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateStatus(appointment.id, "CANCELLED");
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                  >
                                    <X size={12} />
                                    Cancel
                                  </button>
                                </>
                              )}
                              {(appointment.status === "COMPLETED" ||
                                appointment.status === "CANCELLED") && (
                                <span className="text-xs text-dark-400 italic">
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
                  className="text-center py-12 bg-white dark:bg-dark-800 rounded-xl border border-dark-200 dark:border-dark-700"
                >
                  <CalendarIcon className="w-10 h-10 mx-auto mb-3 text-dark-300 dark:text-dark-600" />
                  <p className="text-sm text-dark-500 dark:text-dark-400">
                    No appointments found
                  </p>
                  <p className="text-xs text-dark-400 dark:text-dark-500 mt-1">
                    {statusFilter !== "ALL"
                      ? "Try changing the filter"
                      : "Appointments will appear here"}
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* Summary Footer */}
          {appointments.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-xs text-dark-500 dark:text-dark-400 px-1">
              <span>
                Showing {filteredAppointments.length} of {appointments.length}{" "}
                appointments
              </span>
              <span>
                Total Revenue:{" "}
                <span className="font-medium text-emerald-600">
                  ${stats.revenue}
                </span>
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
