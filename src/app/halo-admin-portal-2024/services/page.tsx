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
  Scissors,
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

interface Category {
  id: string;
  value: string;
  label: string;
}

export default function AdminServicesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryValue, setNewCategoryValue] = useState("");
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [deleteCategoryData, setDeleteCategoryData] = useState<{
    id: string;
    label: string;
  } | null>(null);

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
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/service-categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories");
      // Set default categories if API fails
      setCategories([
        { id: "1", value: "HAIRCUT", label: "Haircut" },
        { id: "2", value: "COLORING", label: "Coloring" },
        { id: "3", value: "STYLING", label: "Styling" },
        { id: "4", value: "TREATMENT", label: "Treatment" },
      ]);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryValue || !newCategoryLabel) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/service-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: newCategoryValue.toUpperCase().replace(/\s+/g, "_"),
          label: newCategoryLabel,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add category");
      }

      toast.success("Category added successfully!");
      setShowAddCategory(false);
      setNewCategoryValue("");
      setNewCategoryLabel("");
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Failed to add category");
    }
  };

  const handleEdit = (service: Service) => {
    router.push(`/halo-admin-portal-2024/services/${service.id}/edit`);
  };

  const handleDeleteCategory = async (
    categoryId: string,
    categoryLabel: string
  ) => {
    setDeleteCategoryData({ id: categoryId, label: categoryLabel });
    setShowDeleteCategoryModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCategoryData) return;

    try {
      const res = await fetch(
        `/api/service-categories/${deleteCategoryData.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to delete category");
        setShowDeleteCategoryModal(false);
        setDeleteCategoryData(null);
        return;
      }

      toast.success("Category deleted!");
      fetchCategories();
      fetchServices();
      setShowDeleteCategoryModal(false);
      setDeleteCategoryData(null);
    } catch (error) {
      toast.error("Failed to delete category");
      setShowDeleteCategoryModal(false);
      setDeleteCategoryData(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteServiceId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteServiceId) return;

    try {
      const res = await fetch(
        `/api/halo-admin-api/services/${deleteServiceId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Service deleted!");
      fetchServices();
      setShowDeleteModal(false);
      setDeleteServiceId(null);
    } catch (error) {
      toast.error("Failed to delete service");
      setShowDeleteModal(false);
      setDeleteServiceId(null);
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

  // Group services by category
  const servicesByCategory = categories.map((cat) => ({
    ...cat,
    services: filteredServices.filter((s) => s.category === cat.value),
    count: services.filter((s) => s.category === cat.value).length,
  }));

  return (
    <div className="bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      <div className="pt-20 px-3 pb-3 sm:pt-24 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header Card */}
          <Card className="p-3 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-dark-900 dark:text-white mb-0">
              Services Management
            </h1>
            <p className="text-xs text-dark-600 dark:text-dark-400 mb-2">
              Manage all salon services
            </p>
            <div className="flex gap-1.5">
              {!selectedCategory && (
                <Button
                  onClick={() => setShowAddCategory(true)}
                  variant="outline"
                  className="flex items-center gap-1 text-[10px] px-2 py-1 h-7"
                >
                  <Plus size={12} />
                  Add Category
                </Button>
              )}
              <Button
                onClick={() =>
                  router.push("/halo-admin-portal-2024/services/new")
                }
                className="flex items-center gap-1 text-[10px] px-2 py-1 h-7"
              >
                <Plus size={12} />
                Add Service
              </Button>
            </div>
          </Card>

          {/* Categories or Services View */}
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
            </div>
          ) : selectedCategory ? (
            // Show services in selected category
            <div>
              <Card className="p-4 mb-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-base font-bold text-dark-900 dark:text-white">
                    {
                      categories.find((c) => c.value === selectedCategory)
                        ?.label
                    }
                  </h2>
                  <Button
                    onClick={() => {
                      console.log("Back button clicked");
                      setSelectedCategory(null);
                    }}
                    variant="outline"
                    className="text-sm px-4 h-9 font-medium whitespace-nowrap flex items-center justify-center"
                  >
                    Back
                  </Button>
                </div>
              </Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredServices
                  .filter((s) => s.category === selectedCategory)
                  .map((service) => (
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

                {filteredServices.filter((s) => s.category === selectedCategory)
                  .length === 0 && (
                  <div className="col-span-full text-center py-6">
                    <p className="text-dark-600 dark:text-dark-400 text-xs">
                      No services in this category
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Show categories
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {servicesByCategory.map((category) => (
                <motion.div
                  key={category.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="py-0.5 pr-1 pl-0 cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-2 border-transparent hover:border-primary-500 relative group">
                    <div
                      className="flex items-center gap-1.5"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                        <Scissors className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 pr-1">
                        <h3 className="text-[11px] font-bold text-dark-900 dark:text-white truncate leading-tight">
                          {category.label}
                        </h3>
                        <p className="text-[9px] text-dark-600 dark:text-dark-400 leading-tight">
                          {category.count}{" "}
                          {category.count === 1 ? "service" : "services"}
                        </p>
                      </div>
                    </div>
                    {/* Delete button - only show on hover and if no services */}
                    {category.count === 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id, category.label);
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Delete category"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </Card>
                </motion.div>
              ))}

              {servicesByCategory.every((cat) => cat.count === 0) && (
                <div className="col-span-full text-center py-6">
                  <p className="text-dark-600 dark:text-dark-400 mb-4">
                    No services available. Add your first service!
                  </p>
                  <Button
                    onClick={() =>
                      router.push("/halo-admin-portal-2024/services/new")
                    }
                    className="inline-flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Service
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Add Category Modal */}
        {showAddCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full"
            >
              <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">
                Add New Category
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Category Name
                  </label>
                  <Input
                    type="text"
                    value={newCategoryLabel}
                    onChange={(e) => setNewCategoryLabel(e.target.value)}
                    placeholder="e.g., Hair Extensions"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Category Code
                  </label>
                  <Input
                    type="text"
                    value={newCategoryValue}
                    onChange={(e) => setNewCategoryValue(e.target.value)}
                    placeholder="e.g., hair_extensions"
                    className="w-full"
                  />
                  <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
                    Use lowercase with underscores (will be auto-formatted)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategoryValue("");
                      setNewCategoryLabel("");
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory} className="flex-1">
                    Add Category
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Service Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full"
            >
              <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">
                Delete Service
              </h2>
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-6">
                Are you sure you want to delete this service? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteServiceId(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Category Confirmation Modal */}
        {showDeleteCategoryModal && deleteCategoryData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md w-full"
            >
              <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-4">
                Delete Category
              </h2>
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-6">
                Are you sure you want to delete "{deleteCategoryData.label}"
                category? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowDeleteCategoryModal(false);
                    setDeleteCategoryData(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteCategory}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
