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
  ChevronLeft,
  AlertTriangle,
  Clock,
  DollarSign,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import toast from "react-hot-toast";
import Image from "next/image";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
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
  const [visibleDeleteButton, setVisibleDeleteButton] = useState<string | null>(
    null
  );
  const [serviceImageIndex, setServiceImageIndex] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showDeleteServiceModal, setShowDeleteServiceModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<{
    id: string;
    value: string;
    label: string;
    count: number;
  } | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    if (session && session.user.role !== "ADMIN") {
      router.push("/halo-admin-portal-2024/appointments");
      return;
    }
    fetchServices();
    fetchCategories();
  }, [session, router]);

  // Close delete button when clicking anywhere else
  useEffect(() => {
    const handleClickOutside = () => {
      if (visibleDeleteButton) {
        setVisibleDeleteButton(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [visibleDeleteButton]);

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
      setCategories(Array.isArray(data) ? data : []);
      setExpandedCategories([]);
    } catch (error) {
      toast.error("Failed to load categories");
      setCategories([]);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? [] : [category]
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
      localStorage.setItem(
        "serviceCategoriesLastUpdate",
        Date.now().toString()
      );
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
      localStorage.setItem(
        "serviceCategoriesLastUpdate",
        Date.now().toString()
      );
      window.dispatchEvent(new Event("serviceCategoriesUpdated"));
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    }
  };

  const handleEdit = (service: Service) => {
    router.push(`/halo-admin-portal-2024/services/${service.id}/edit`);
  };

  const handleDelete = (service: Service) => {
    setDeletingService(service);
    setShowDeleteServiceModal(true);
  };

  const confirmDeleteService = async () => {
    if (!deletingService) return;

    try {
      const res = await fetch(
        `/api/halo-admin-api/services/${deletingService.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Service deleted!");
      fetchServices();
      setShowDeleteServiceModal(false);
      setDeletingService(null);
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
    setVisibleDeleteButton((prev) =>
      prev === categoryValue ? null : categoryValue
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      <div className="pt-20 px-3 pb-2 sm:pt-24 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 leading-tight">
                Services
              </h1>
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
            <p className="text-[13px] text-primary-700 dark:text-primary-300 mt-1">
              Manage services by category
            </p>
          </div>

          {/* Search */}
          <Card className="p-2 mb-6">
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
            <div className="space-y-4 pb-4">
              {categories.map((category) => {
                const categoryServices =
                  servicesByCategory[category.value] || [];
                const isExpanded = expandedCategories.includes(category.value);

                return (
                  <Card key={category.value} className="overflow-hidden !p-0">
                    {/* Category Header */}
                    <div
                      className="flex items-center justify-between py-2 pl-1 pr-3 bg-primary-50 dark:bg-primary-900/20 border-b border-dark-200 dark:border-dark-700 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                      onClick={() => toggleCategory(category.value)}
                    >
                      <div className="flex items-center">
                        <button className="p-0 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
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
                        <h2 className="text-lg font-bold text-primary-900 dark:text-primary-100 ml-1">
                          {category.label}
                        </h2>
                        <span
                          className="ml-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-b from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 text-primary-900 dark:text-primary-100 rounded-full shadow-md"
                          style={{
                            boxShadow:
                              "0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(0, 0, 0, 0.15)",
                          }}
                        >
                          {categoryServices.length}{" "}
                          {categoryServices.length === 1
                            ? "service"
                            : "services"}
                        </span>
                      </div>

                      {visibleDeleteButton !== category.value ? (
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
                              {categoryServices.map((service) => {
                                const images = service.image
                                  ? service.image
                                      .split(",")
                                      .map((img) => img.trim())
                                      .filter(Boolean)
                                  : [];
                                const currentImageIndex =
                                  serviceImageIndex[service.id] || 0;
                                const hasMultipleImages = images.length > 1;

                                return (
                                  <div
                                    key={service.id}
                                    className="overflow-hidden border border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 hover:shadow-lg transition-shadow duration-300"
                                  >
                                    <div className="aspect-[4/3] bg-dark-100 dark:bg-dark-800 relative group">
                                      {images.length > 0 ? (
                                        <>
                                          <Image
                                            src={
                                              images[currentImageIndex] ||
                                              images[0]
                                            }
                                            alt={service.name}
                                            fill
                                            className="object-cover"
                                          />
                                          {/* Discount Badge */}
                                          {service.compareAtPrice &&
                                            service.compareAtPrice >
                                              service.price && (
                                              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg z-10">
                                                -
                                                {Math.round(
                                                  ((service.compareAtPrice -
                                                    service.price) /
                                                    service.compareAtPrice) *
                                                    100
                                                )}
                                                %
                                              </div>
                                            )}
                                          {hasMultipleImages && (
                                            <>
                                              {/* Previous button */}
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setServiceImageIndex(
                                                    (prev) => ({
                                                      ...prev,
                                                      [service.id]:
                                                        currentImageIndex === 0
                                                          ? images.length - 1
                                                          : currentImageIndex -
                                                            1,
                                                    })
                                                  );
                                                }}
                                                className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                              >
                                                <ChevronLeft size={16} />
                                              </button>
                                              {/* Next button */}
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setServiceImageIndex(
                                                    (prev) => ({
                                                      ...prev,
                                                      [service.id]:
                                                        currentImageIndex ===
                                                        images.length - 1
                                                          ? 0
                                                          : currentImageIndex +
                                                            1,
                                                    })
                                                  );
                                                }}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                              >
                                                <ChevronRight size={16} />
                                              </button>
                                              {/* Image counter */}
                                              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                                                {currentImageIndex + 1} /{" "}
                                                {images.length}
                                              </div>
                                            </>
                                          )}
                                        </>
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
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-base font-bold text-dark-900 dark:text-white">
                                              ${service.price}
                                            </span>
                                            {service.compareAtPrice &&
                                              service.compareAtPrice >
                                                service.price && (
                                                <span className="text-xs text-dark-500 dark:text-dark-400 line-through">
                                                  ${service.compareAtPrice}
                                                </span>
                                              )}
                                          </div>
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
                                          onClick={() => handleDelete(service)}
                                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                        >
                                          <Trash2 size={12} />
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
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
            <div className="flex gap-2 justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategoryName("");
                }}
                className="py-1 px-8 text-xs h-8 flex items-center justify-center"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddCategory}
                className="py-1 px-8 text-xs h-8 flex items-center justify-center"
              >
                Add
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {showDeleteCategoryModal && deletingCategory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowDeleteCategoryModal(false);
            setDeletingCategory(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">
                  Delete Category
                </h3>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  Are you sure you want to delete the{" "}
                  <span className="font-semibold text-dark-900 dark:text-white">
                    {deletingCategory.label}
                  </span>{" "}
                  category? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteCategoryModal(false);
                  setDeletingCategory(null);
                }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-dark-700 dark:text-dark-300 bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCategory}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
                style={{
                  boxShadow:
                    "0 4px 6px rgba(239, 68, 68, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                Delete Category
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Service Confirmation Modal */}
      <AnimatePresence>
        {showDeleteServiceModal && deletingService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowDeleteServiceModal(false);
              setDeletingService(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">
                    Delete Service
                  </h3>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-dark-900 dark:text-white">
                      {deletingService.name}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteServiceModal(false);
                    setDeletingService(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-dark-700 dark:text-dark-300 bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteService}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
                  style={{
                    boxShadow:
                      "0 4px 6px rgba(239, 68, 68, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Delete Service
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
