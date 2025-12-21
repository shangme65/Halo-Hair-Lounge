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
  Loader2,
  Star,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Clock,
  DollarSign,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Card from "@/components/ui/Card";
import toast from "react-hot-toast";
import Image from "next/image";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  categories: string[];
  image: string | null;
  isActive: boolean;
}

interface CategoryInfo {
  id: string;
  value: string;
  label: string;
  serviceCount: number;
}

export default function AdminServicesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [visibleDeleteButtons, setVisibleDeleteButtons] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<{
    id: string;
    value: string;
    label: string;
    count: number;
  } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    if (session && session.user.role !== "ADMIN") {
      router.push("/halo-admin-portal-2024/appointments");
      return;
    }
    fetchServices();
    fetchCategories();
  }, [session, router]);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/halo-admin-api/services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/halo-admin-api/service-categories");
      const data = await res.json();
      setCategories(data);
      setExpandedCategories([]);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleDeleteCategory = async (
    id: string,
    category: string,
    label: string,
    serviceCount: number
  ) => {
    setDeletingCategory({ id, value: category, label, count: serviceCount });
    setShowDeleteCategoryModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (!deletingCategory) return;

    try {
      const res = await fetch(
        `/api/service-categories/${deletingCategory.id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete category");

      const data = await res.json();
      toast.success(data.message || "Category deleted successfully");
      setShowDeleteCategoryModal(false);
      setDeletingCategory(null);
      fetchServices();
      fetchCategories();

      // Notify other components (like Footer) to update
      window.dispatchEvent(new Event("serviceCategoriesUpdated"));
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const res = await fetch("/api/service-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: newCategoryName.toUpperCase().replace(/\s+/g, "_"),
          label: newCategoryName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      toast.success("Category created successfully!");
      setShowAddCategoryModal(false);
      setNewCategoryName("");
      fetchCategories();

      // Notify other components (like Footer) to update
      window.dispatchEvent(new Event("serviceCategoriesUpdated"));
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
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

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Service deleted!");
      fetchServices();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const toggleStatus = async (service: Service, field: "isActive") => {
    try {
      const res = await fetch(`/api/halo-admin-api/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...service,
          [field]: !service[field],
        }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Status updated!");
      fetchServices();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group services by category
  const servicesByCategory: Record<string, Service[]> = Array.isArray(
    categories
  )
    ? categories.reduce((acc, category) => {
        acc[category.value] = filteredServices.filter(
          (service) =>
            service.categories && service.categories.includes(category.value)
        );
        return acc;
      }, {} as Record<string, Service[]>)
    : {};

  const toggleDeleteButton = (categoryValue: string) => {
    setVisibleDeleteButtons((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      <div className="pt-20 px-3 pb-4 sm:pt-24 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-lg font-bold text-dark-900 dark:text-white leading-tight">
                Services
              </h1>
              <p className="text-[10px] text-dark-600 dark:text-dark-400">
                Manage services by category
              </p>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="flex items-center gap-0.5 px-2 py-1 text-[10px] font-medium bg-gradient-to-b from-white to-primary-50 dark:from-dark-700 dark:to-dark-800 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400 rounded-lg hover:from-primary-50 hover:to-primary-100 dark:hover:from-dark-600 dark:hover:to-dark-700 transition-all active:scale-95 shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_2px_rgba(0,0,0,0.1)]"
                style={{
                  textShadow: "0 1px 1px rgba(255,255,255,0.5)",
                }}
              >
                <FolderPlus size={12} />
                Add Category
              </button>
              <button
                onClick={() =>
                  router.push("/halo-admin-portal-2024/services/new")
                }
                className="flex items-center gap-0.5 px-2 py-1 text-[10px] font-medium bg-gradient-to-b from-primary-400 to-primary-600 dark:from-primary-600 dark:to-primary-800 text-white rounded-lg hover:from-primary-500 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-700 transition-all active:scale-95 shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2)]"
                style={{
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                <Plus size={12} />
                Add Service
              </button>
            </div>
          </div>

          {/* Search */}
          <Card className="p-2 mb-2">
            <div className="relative">
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-dark-400"
                size={12}
              />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 text-xs bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </Card>

          {/* Services by Category */}
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => {
                const categoryServices =
                  servicesByCategory[category.value] || [];
                const isExpanded = expandedCategories.includes(category.value);

                return (
                  <Card key={category.value} className="overflow-hidden !p-0">
                    {/* Category Header */}
                    <div
                      className="flex items-center justify-between py-2 px-3 bg-primary-50 dark:bg-primary-900/20 border-b border-dark-200 dark:border-dark-700 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                      onClick={() => toggleCategory(category.value)}
                    >
                      <div className="flex items-center gap-2">
                        <button className="p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                          {isExpanded ? (
                            <ChevronDown
                              size={20}
                              className="text-primary-700 dark:text-primary-300"
                            />
                          ) : (
                            <ChevronRight
                              size={20}
                              className="text-primary-700 dark:text-primary-300"
                            />
                          )}
                        </button>
                        <h2 className="text-lg font-bold text-primary-900 dark:text-primary-100">
                          {category.label}
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200 rounded-full">
                          {categoryServices.length}{" "}
                          {categoryServices.length === 1
                            ? "service"
                            : "services"}
                        </span>
                      </div>

                      {!visibleDeleteButtons.includes(category.value) ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDeleteButton(category.value);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-b from-dark-200 to-dark-300 hover:from-dark-300 hover:to-dark-400 text-dark-700 font-medium rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
                          style={{
                            boxShadow:
                              "0 4px 6px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <Trash2 size={14} />?
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(
                              category.id,
                              category.value,
                              category.label,
                              categoryServices.length
                            );
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-b from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
                          style={{
                            boxShadow:
                              "0 4px 6px rgba(239, 68, 68, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      )}
                    </div>

                    {/* Category Services */}
                    {isExpanded && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-2"
                        >
                          {categoryServices.length === 0 ? (
                            <div className="text-center py-8 text-dark-600 dark:text-dark-400">
                              <p className="text-sm">
                                No services in this category
                              </p>
                              <button
                                onClick={() => {
                                  router.push(
                                    "/halo-admin-portal-2024/services/new"
                                  );
                                }}
                                className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                              >
                                Add a service
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {categoryServices.map((service) => (
                                <div
                                  key={service.id}
                                  className="overflow-hidden border border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 hover:shadow-lg transition-shadow duration-300"
                                >
                                  <div className="aspect-[4/3] bg-dark-100 dark:bg-dark-800 relative">
                                    {service.image ? (
                                      <Image
                                        src={service.image}
                                        alt={service.name}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center h-full text-dark-400">
                                        No image
                                      </div>
                                    )}
                                  </div>

                                  <div className="p-2">
                                    <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-1 line-clamp-1">
                                      {service.name}
                                    </h3>
                                    <p className="text-xs text-dark-600 dark:text-dark-400 mb-1.5 line-clamp-2">
                                      {service.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-1.5">
                                      <div className="flex items-center gap-1">
                                        <DollarSign
                                          size={12}
                                          className="text-dark-500"
                                        />
                                        <span className="text-base font-bold text-dark-900 dark:text-white">
                                          ${service.price}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock
                                          size={12}
                                          className="text-dark-500"
                                        />
                                        <span className="text-xs text-dark-600 dark:text-dark-400 font-bold">
                                          {service.duration} min
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 mb-1.5">
                                      <button
                                        onClick={() =>
                                          toggleStatus(service, "isActive")
                                        }
                                        className={`flex-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                                          service.isActive
                                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                        }`}
                                      >
                                        {service.isActive
                                          ? "Active"
                                          : "Inactive"}
                                      </button>
                                    </div>

                                    <div className="flex gap-1.5">
                                      <button
                                        onClick={() => handleEdit(service)}
                                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                                      >
                                        <Edit2 size={12} />
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDelete(service.id)}
                                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                      >
                                        <Trash2 size={12} />
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </Card>
                );
              })}

              {filteredServices.length === 0 && categories.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-dark-600 dark:text-dark-400">
                    No services found matching your search
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">
              Add Category
            </h2>
            <input
              type="text"
              placeholder="Category name (e.g., Haircut)"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategoryName("");
                }}
                className="flex-1 px-4 py-2 text-sm bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="flex-1 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {showDeleteCategoryModal && deletingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-dark-900 dark:text-white">
                Delete Category
              </h2>
            </div>
            <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
              Are you sure you want to delete "{deletingCategory.label}"
              category?
              {deletingCategory.count > 0 && (
                <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                  Warning: This category has {deletingCategory.count} service
                  {deletingCategory.count !== 1 ? "s" : ""}.
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteCategoryModal(false);
                  setDeletingCategory(null);
                }}
                className="flex-1 px-4 py-2 text-sm bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCategory}
                className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
