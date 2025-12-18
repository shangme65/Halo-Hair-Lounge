"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
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

  useEffect(() => {
    if (session && session.user.role !== "ADMIN") {
      router.push("/halo-admin-portal-2024/appointments");
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

  const handleEdit = (service: Service) => {
    router.push(`/halo-admin-portal-2024/services/${service.id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`/api/halo-admin-api/services/${id}`, {
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
      const res = await fetch(`/api/halo-admin-api/services/${service.id}`, {
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

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      <div className="pt-20 px-3 pb-4 sm:pt-24 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-dark-900 dark:text-white mb-0.5">
                Services Management
              </h1>
              <p className="text-xs text-dark-600 dark:text-dark-400">
                Manage all salon services
              </p>
            </div>
            <Button
              onClick={() =>
                router.push("/halo-admin-portal-2024/services/new")
              }
              className="flex items-center gap-1.5 text-sm px-3 py-2"
            >
              <Plus size={16} />
              Add Service
            </Button>
          </div>

          {/* Search */}
          <Card className="p-3 mb-4">
            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-dark-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </Card>

          {/* Services Grid */}
          {/* Services Grid */}
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredServices.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 relative flex items-center justify-center">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-primary-400" />
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-1 line-clamp-1">
                      {service.name}
                    </h3>
                    <p className="text-xs text-dark-600 dark:text-dark-400 mb-2 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-bold text-dark-900 dark:text-white">
                        ${service.price}
                      </span>
                      <span className="text-xs text-dark-600 dark:text-dark-400">
                        {service.duration} min
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium">
                        {service.category}
                      </span>
                      <button
                        onClick={() => toggleStatus(service)}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          service.isActive
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </button>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleEdit(service)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors font-medium"
                      >
                        <Edit2 size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredServices.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-dark-600 dark:text-dark-400">
                    No services found
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
