"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Loader2, X, Check, Info } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function ServiceFormPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params?.id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [enhanceHD, setEnhanceHD] = useState(true);
  const [categories, setCategories] = useState<
    { id: string; value: string; label: string }[]
  >([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    duration: "",
    categories: [] as string[],
    images: "",
    isActive: true,
  });

  useEffect(() => {
    if (session && session.user.role !== "ADMIN") {
      router.push("/halo-admin-portal-2024/appointments");
      return;
    }

    fetchCategories();

    if (isEdit) {
      fetchService();
    }
  }, [session, router, isEdit]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/service-categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories");
    }
  };

  const fetchService = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/halo-admin-api/services/${params.id}`);

      if (!res.ok) {
        toast.error("Service not found");
        router.push("/halo-admin-portal-2024/services");
        return;
      }

      const service = await res.json();

      if (service) {
        setFormData({
          name: service.name || "",
          description: service.description || "",
          price: service.price?.toString() || "",
          compareAtPrice: service.compareAtPrice?.toString() || "",
          duration: service.duration?.toString() || "",
          categories: Array.isArray(service.categories)
            ? service.categories
            : service.category
            ? [service.category]
            : [],
          images: service.image || "",
          isActive: service.isActive ?? true,
        });
      } else {
        toast.error("Service not found");
        router.push("/halo-admin-portal-2024/services");
      }
    } catch (error) {
      toast.error("Failed to load service");
      router.push("/halo-admin-portal-2024/services");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];
    const failedFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        failedFiles.push(file.name);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        failedFiles.push(file.name);
        continue;
      }

      try {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("type", "service");
        formDataUpload.append("enhanceHD", enhanceHD.toString());

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!res.ok) {
          const error = await res.json();
          toast.error(`${file.name}: ${error.error || "Upload failed"}`);
          failedFiles.push(file.name);
          continue;
        }

        const data = await res.json();
        uploadedUrls.push(data.url);
      } catch (error: any) {
        console.error(`Upload error for ${file.name}:`, error);
        toast.error(`${file.name}: ${error.message || "Failed to upload"}`);
        failedFiles.push(file.name);
      }
    }

    // Update form data with successfully uploaded images
    if (uploadedUrls.length > 0) {
      const currentImages = formData.images
        ? formData.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      currentImages.push(...uploadedUrls);

      setFormData((prev) => ({ ...prev, images: currentImages.join(", ") }));
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    }

    // Show summary if there were failures
    if (failedFiles.length > 0 && uploadedUrls.length === 0) {
      toast.error(`All uploads failed (${failedFiles.length} files)`);
    } else if (failedFiles.length > 0) {
      toast.warning(
        `${uploadedUrls.length} succeeded, ${failedFiles.length} failed`
      );
    }

    setUploading(false);
    // Reset input
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.duration ||
      formData.categories.length === 0
    ) {
      toast.error(
        "Please fill in all required fields and select at least one category"
      );
      return;
    }

    try {
      setLoading(true);

      const url = isEdit
        ? `/api/halo-admin-api/services/${params.id}`
        : "/api/halo-admin-api/services";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice
            ? parseFloat(formData.compareAtPrice)
            : null,
          duration: parseInt(formData.duration),
          image: formData.images.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to save service");

      toast.success(isEdit ? "Service updated!" : "Service created!");

      // Notify other components (like Footer) to update categories
      localStorage.setItem(
        "serviceCategoriesLastUpdate",
        Date.now().toString()
      );
      window.dispatchEvent(new Event("serviceCategoriesUpdated"));

      router.push("/halo-admin-portal-2024/services");
    } catch (error) {
      toast.error("Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((c) => c !== value)
        : [...prev.categories, value],
    }));
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-16 left-0 right-0 bottom-0 z-50 bg-white dark:bg-dark-900 flex flex-col"
      >
        <div className="sticky top-0 bg-white dark:bg-dark-900 z-10 px-4 py-3 border-b border-dark-200 dark:border-dark-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-dark-900 dark:text-white">
            {isEdit ? "Edit Service" : "Add New Service"}
          </h2>
          <button
            onClick={() => router.push("/halo-admin-portal-2024/services")}
            className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-4 pt-6">
            <div className="grid grid-cols-2 gap-4 mb-20">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Service Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Classic Haircut"
                  required
                />
              </div>

              <div className="col-span-2">
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

              <div className="col-span-2 grid grid-cols-12 gap-1.5">
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-dark-700 dark:text-dark-300 mb-2">
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

                <div className="col-span-5">
                  <label className="flex items-center gap-1 text-xs font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Compare at Price ($)
                    <div className="group relative">
                      <Info size={14} className="text-dark-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-dark-900 text-white text-xs rounded-lg shadow-lg z-10">
                        Original price (for showing discounts)
                        <div className="absolute left-2 top-full w-2 h-2 bg-dark-900 transform rotate-45 -mt-1"></div>
                      </div>
                    </div>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compareAtPrice: e.target.value,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="col-span-4">
                  <label className="block text-xs font-medium text-dark-700 dark:text-dark-300 mb-2">
                    Duration (minutes) *
                  </label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="30"
                    required
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Categories * (Select at least one)
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat, index) => {
                    const isSelected = formData.categories.includes(cat.value);
                    return (
                      <button
                        key={cat.id || cat.value || index}
                        type="button"
                        onClick={() => toggleCategory(cat.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border-2 ${
                          isSelected
                            ? "bg-green-500 text-white border-green-500 shadow-md"
                            : "bg-white dark:bg-dark-800 text-dark-700 dark:text-dark-300 border-dark-300 dark:border-dark-600 hover:border-green-400"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-white border-white"
                              : "border-dark-400 dark:border-dark-500"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
                {formData.categories.length === 0 && (
                  <p className="mt-2 text-xs text-red-500">
                    Please select at least one category
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Image URLs (comma-separated)
                </label>
                <textarea
                  value={formData.images}
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.value })
                  }
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows={2}
                  className="w-full px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Or Upload Images from Device
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    id="enhanceHD"
                    checked={enhanceHD}
                    onChange={(e) => setEnhanceHD(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <label
                    htmlFor="enhanceHD"
                    className="text-sm font-medium text-dark-700 dark:text-dark-300"
                  >
                    Enhance image quality (HD)
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="w-full px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-300 dark:border-dark-600 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-600 transition-colors text-center">
                      {uploading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Uploading...</span>
                        </div>
                      ) : (
                        <span className="text-sm text-dark-600 dark:text-dark-400">
                          Choose files...
                        </span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.images && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.images
                      .split(",")
                      .map((img) => img.trim())
                      .filter(Boolean)
                      .map((imgUrl, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={imgUrl}
                            alt={`Service ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border-2 border-dark-200 dark:border-dark-600"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const images = formData.images
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean);
                              images.splice(idx, 1);
                              setFormData({
                                ...formData,
                                images: images.join(", "),
                              });
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="col-span-2 flex gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.checked,
                      })
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
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-dark-900 border-t border-dark-200 dark:border-dark-700 p-4 flex gap-6 justify-center shadow-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/halo-admin-portal-2024/services")}
              className="px-6 py-2 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <Check size={16} />
                  {isEdit ? "Update Service" : "Create Service"}
                </span>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
