"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image: string;
  isActive: boolean;
}

export default function AdminServicesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "HAIRCUT",
    image: "",
    isActive: true,
  });

  useEffect(() => {
    if (session && session.user.role !== "ADMIN") {
      router.push("/admin/appointments");
      return;
    }
    fetchServices();
  }, [session, router]);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : "/api/admin/services";

      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
        }),
      });

      if (!res.ok) throw new Error("Failed to save service");

      toast.success(editingService ? "Service updated!" : "Service created!");
      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (error) {
      toast.error("Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
      image: service.image,
      isActive: service.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete service");

      toast.success("Service deleted!");
      fetchServices();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const toggleStatus = async (service: Service) => {
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...service, isActive: !service.isActive }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success("Status updated!");
      fetchServices();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      category: "HAIRCUT",
      image: "",
      isActive: true,
    });
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      <div className="lg:ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2">
                Services Management
              </h1>
              <p className="text-dark-600 dark:text-dark-400">
                Manage all salon services
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Add Service
            </Button>
          </div>

          {/* Search */}
          <Card className="p-4 mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </Card>

          {/* Services Table */}
          <Card className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-50 dark:bg-dark-800 border-b border-dark-200 dark:border-dark-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900 dark:text-white">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900 dark:text-white">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900 dark:text-white">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900 dark:text-white">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark-900 dark:text-white">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-dark-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-200 dark:divide-dark-700">
                    {filteredServices.map((service) => (
                      <tr
                        key={service.id}
                        className="hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-dark-100 dark:bg-dark-700 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-dark-400" />
                            </div>
                            <div>
                              <p className="font-medium text-dark-900 dark:text-white">
                                {service.name}
                              </p>
                              <p className="text-sm text-dark-600 dark:text-dark-400 line-clamp-1">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-dark-700 dark:text-dark-300">
                          {service.category}
                        </td>
                        <td className="px-6 py-4 text-dark-900 dark:text-white font-medium">
                          ${service.price}
                        </td>
                        <td className="px-6 py-4 text-dark-700 dark:text-dark-300">
                          {service.duration} min
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleStatus(service)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              service.isActive
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            }`}
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(service)}
                              className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                            >
                              <Edit2 size={18} className="text-primary-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredServices.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-dark-600 dark:text-dark-400">
                      No services found
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-dark-200 dark:border-dark-700 flex justify-between items-center sticky top-0 bg-white dark:bg-dark-800 z-10">
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Service Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Women's Haircut"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the service..."
                    rows={3}
                    required
                    className="w-full px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Price ($) *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Duration (minutes) *
                    </label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="60"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="HAIRCUT">Haircut</option>
                    <option value="COLORING">Coloring</option>
                    <option value="TREATMENT">Treatment</option>
                    <option value="STYLING">Styling</option>
                    <option value="EXTENSION">Extension</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Image URL
                  </label>
                  <Input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-dark-700 dark:text-dark-300"
                  >
                    Service is active
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        <Check size={20} />
                        {editingService ? "Update Service" : "Create Service"}
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
