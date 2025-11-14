"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
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

const statusColors = {
  PENDING:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  CONFIRMED:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  COMPLETED: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  CANCELLED: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/admin/appointments");
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
      const res = await fetch(`/api/admin/appointments/${id}`, {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      <div className="lg:ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2">
              Appointments Management
            </h1>
            <p className="text-dark-600 dark:text-dark-400">
              Review and manage customer appointments
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pending}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    Confirmed
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.confirmed}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.completed}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    Cancelled
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.cancelled}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by customer or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-dark-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Appointments List */}
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Appointment Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
                            {appointment.service.name}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-dark-600 dark:text-dark-400">
                            <div className="flex items-center gap-2">
                              <CalendarIcon size={16} />
                              {new Date(appointment.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} />
                              {appointment.startTime} - {appointment.endTime}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                ${appointment.service.price}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[
                              appointment.status as keyof typeof statusColors
                            ]
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="bg-dark-50 dark:bg-dark-700/50 rounded-lg p-4">
                        <h4 className="font-semibold text-dark-900 dark:text-white mb-3">
                          Customer Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                            <User size={16} />
                            <span>{appointment.user.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                            <Mail size={16} />
                            <span>{appointment.user.email}</span>
                          </div>
                          {appointment.user.phone && (
                            <div className="flex items-center gap-2 text-dark-600 dark:text-dark-400">
                              <Phone size={16} />
                              <span>{appointment.user.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="text-sm text-dark-600 dark:text-dark-400">
                          <span className="font-medium">Notes:</span>{" "}
                          {appointment.notes}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {appointment.status === "PENDING" && (
                      <div className="flex flex-col gap-3 lg:w-48">
                        <Button
                          onClick={() =>
                            updateStatus(appointment.id, "CONFIRMED")
                          }
                          className="flex items-center justify-center gap-2"
                        >
                          <Check size={18} />
                          Approve
                        </Button>
                        <Button
                          onClick={() =>
                            updateStatus(appointment.id, "CANCELLED")
                          }
                          variant="outline"
                          className="flex items-center justify-center gap-2 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <X size={18} />
                          Decline
                        </Button>
                      </div>
                    )}

                    {appointment.status === "CONFIRMED" && (
                      <div className="flex flex-col gap-3 lg:w-48">
                        <Button
                          onClick={() =>
                            updateStatus(appointment.id, "COMPLETED")
                          }
                          className="flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} />
                          Mark Complete
                        </Button>
                        <Button
                          onClick={() =>
                            updateStatus(appointment.id, "CANCELLED")
                          }
                          variant="outline"
                          className="flex items-center justify-center gap-2 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <X size={18} />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {filteredAppointments.length === 0 && (
                <Card className="p-12">
                  <div className="text-center text-dark-600 dark:text-dark-400">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments found</p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
