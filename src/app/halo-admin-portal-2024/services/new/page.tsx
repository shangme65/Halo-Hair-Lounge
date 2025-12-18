"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ServiceFormPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const isEdit = !!params?.id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "HAIRCUT",
    image: "",
    isActive: true,
  });
  const [enhanceHD, setEnhanceHD] = useState(false);

  useEffect(() => {
    if (session && session.user.role !== "ADMIN") {
      router.push("/halo-admin-portal-2024/appointments");
      return;
    }

    if (isEdit) {
      fetchService();
    }
  }, [session, router, isEdit]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/services`);
      const services = await res.json();
      const service = services.find((s: any) => s.id === params.id);

      if (service) {
        setFormData({
          name: service.name,
          description: service.description,
          price: service.price.toString(),
          duration: service.duration.toString(),
          category: service.category,
          image: service.image,
          isActive: service.isActive,
        });
        setImagePreview(service.image);
      } else {
        toast.error("Service not found");
        router.push("/halo-admin-portal-2024/services");
      }
    } catch (error) {
      toast.error("Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "service");
      formData.append("enhanceHD", enhanceHD.toString());

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await res.json();
      setFormData((prev) => ({ ...prev, image: data.url }));
      setImagePreview(data.url);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.duration
    ) {
      toast.error("Please fill in all required fields");
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
          duration: parseInt(formData.duration),
        }),
      });

      if (!res.ok) throw new Error("Failed to save service");

      toast.success(isEdit ? "Service updated!" : "Service created!");
      router.push("/halo-admin-portal-2024/services");
    } catch (error) {
      toast.error("Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImagePreview("");
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 bg-white">
      <AdminSidebar />

      <div className="p-3 sm:p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }}>
              <Button
                onClick={() => router.push("/halo-admin-portal-2024/services")}
                className="mb-6 flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg shadow-primary-900/50 border-none"
              >
                <ArrowLeft size={20} />
                Back to Services
              </Button>
            </motion.div>

            <div className="flex items-center gap-3 mb-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg"
              >
                <ImageIcon className="text-white" size={24} />
              </motion.div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 dark:text-white">
                  {isEdit ? "Edit Service" : "Add New Service"}
                </h1>
                <p className="text-dark-600 dark:text-dark-400 mt-0.5 text-sm">
                  {isEdit
                    ? "Update service information"
                    : "Create a new service for your salon"}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card className="bg-white dark:bg-gradient-to-br dark:from-dark-900/95 dark:to-dark-800/95 backdrop-blur-xl border border-dark-200 dark:border-dark-700/50 shadow-lg max-w-4xl">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-6 p-3 sm:p-6"
            >
              {/* Service Name */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-dark-900 dark:text-white font-semibold mb-2 text-xs uppercase tracking-wide">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Classic Haircut"
                    className="bg-white dark:bg-dark-800/80 border-dark-300 dark:border-dark-600 text-dark-900 dark:text-white placeholder:text-dark-400 dark:placeholder:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-all duration-300 text-base py-2"
                    required
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/10 group-hover:to-primary-600/10 pointer-events-none transition-all duration-300" />
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-dark-900 dark:text-white font-semibold mb-2 text-xs uppercase tracking-wide">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the service in detail..."
                    className="w-full px-3 py-2 bg-white dark:bg-dark-800/80 border-2 border-dark-300 dark:border-dark-600 text-dark-900 dark:text-white placeholder:text-dark-400 dark:placeholder:text-dark-500 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 min-h-[100px] sm:min-h-[120px] transition-all duration-300 resize-none text-sm"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/10 group-hover:to-primary-600/10 pointer-events-none transition-all duration-300" />
                </div>
              </motion.div>

              {/* Price and Duration */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <label className="block text-dark-900 dark:text-white font-semibold mb-2 text-xs uppercase tracking-wide">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 font-bold text-xl">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0.00"
                      className="bg-white dark:bg-dark-800/80 border-dark-300 dark:border-dark-600 text-dark-900 dark:text-white placeholder:text-dark-400 dark:placeholder:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 pl-8 text-base py-2 transition-all duration-300"
                      required
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/10 group-hover:to-primary-600/10 pointer-events-none transition-all duration-300" />
                  </div>
                </div>

                <div>
                  <label className="block text-dark-900 dark:text-white font-semibold mb-2 text-xs uppercase tracking-wide">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="60"
                      className="bg-white dark:bg-dark-800/80 border-dark-300 dark:border-dark-600 text-dark-900 dark:text-white placeholder:text-dark-400 dark:placeholder:text-dark-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 text-base py-2 transition-all duration-300"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 dark:text-dark-400 text-xs">
                      min
                    </span>
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/10 group-hover:to-primary-600/10 pointer-events-none transition-all duration-300" />
                  </div>
                </div>
              </motion.div>

              {/* Category */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-dark-900 dark:text-white font-semibold mb-2 text-xs uppercase tracking-wide">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white dark:bg-dark-800/80 border-2 border-dark-300 dark:border-dark-600 text-dark-900 dark:text-white rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 appearance-none cursor-pointer text-sm transition-all duration-300"
                    required
                  >
                    <option value="HAIRCUT">Haircut</option>
                    <option value="COLORING">Coloring</option>
                    <option value="STYLING">Styling</option>
                    <option value="TREATMENT">Treatment</option>
                    <option value="BRAIDING">Braiding</option>
                    <option value="EXTENSION">Extension</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/10 group-hover:to-primary-600/10 pointer-events-none transition-all duration-300" />
                </div>
              </motion.div>

              {/* Image Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-dark-900 dark:text-white font-semibold mb-2 text-xs uppercase tracking-wide">
                  Service Image
                </label>

                {/* HD Enhancement Toggle */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex items-start gap-3 mb-4 p-3 sm:p-4 bg-dark-50 dark:bg-gradient-to-r dark:from-dark-800/60 dark:to-dark-700/60 rounded-lg border border-dark-200 dark:border-dark-600/50 backdrop-blur-sm"
                >
                  <input
                    type="checkbox"
                    id="enhanceHD"
                    checked={enhanceHD}
                    onChange={(e) => setEnhanceHD(e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-primary-600 bg-white dark:bg-dark-700 border-dark-300 dark:border-dark-600 rounded cursor-pointer"
                  />
                  <label htmlFor="enhanceHD" className="flex-1 cursor-pointer">
                    <span className="font-semibold text-dark-900 dark:text-white text-sm block mb-1">
                      Enhance HD Quality
                    </span>
                    <p className="text-xs text-dark-600 dark:text-dark-400 leading-relaxed">
                      Upload image in high definition (1920x1080) with enhanced
                      sharpness and quality for professional presentation
                    </p>
                  </label>
                </motion.div>

                {/* Image Preview */}
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative mb-4 rounded-xl overflow-hidden border-2 border-primary-500/30 shadow-lg"
                  >
                    <Image
                      src={imagePreview}
                      alt="Service preview"
                      width={800}
                      height={400}
                      className="w-full h-48 sm:h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <motion.button
                      type="button"
                      onClick={removeImage}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-4 right-4 p-3 bg-red-600 hover:bg-red-700 rounded-full text-white shadow-xl transition-colors"
                    >
                      <X size={20} />
                    </motion.button>
                  </motion.div>
                )}

                {/* Upload Button */}
                <label className="cursor-pointer block">
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      borderColor: "rgb(34, 197, 94)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-4 px-8 py-6 bg-gradient-to-r from-dark-800/80 to-dark-700/80 border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-2xl transition-all duration-300 backdrop-blur-sm"
                  >
                    {uploading ? (
                      <>
                        <Loader2
                          className="animate-spin text-primary-500"
                          size={28}
                        />
                        <span className="text-white font-medium text-lg">
                          Uploading...
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                          <Upload className="text-white" size={24} />
                        </div>
                        <div className="text-left">
                          <span className="text-white font-semibold text-lg block">
                            {imagePreview ? "Change Image" : "Upload Image"}
                          </span>
                          <span className="text-dark-600 dark:text-dark-400 text-xs">
                            JPG, PNG or WebP • Max 10MB
                          </span>
                        </div>
                      </>
                    )}
                  </motion.div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </motion.div>

              {/* Status Toggle */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.01 }}
                className="flex items-center gap-4 p-5 bg-gradient-to-r from-dark-800/60 to-dark-700/60 rounded-xl border border-dark-600/50"
              >
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-6 h-6 text-primary-600 bg-dark-700 border-dark-600 rounded-md focus:ring-primary-500 focus:ring-2 cursor-pointer"
                />
                <label
                  htmlFor="isActive"
                  className="text-white font-medium cursor-pointer flex-1 text-base"
                >
                  Service is active and visible to customers
                </label>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    formData.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {formData.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-dark-200 dark:border-dark-700/50"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    type="button"
                    onClick={() =>
                      router.push("/halo-admin-portal-2024/services")
                    }
                    className="w-full bg-dark-800 hover:bg-dark-700 text-white border border-dark-600 py-4 text-base font-semibold"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg shadow-primary-900/50 border-none py-4 text-base font-semibold"
                    disabled={loading || uploading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={22} />
                        Saving...
                      </>
                    ) : (
                      <>{isEdit ? "Update Service" : "Create Service"}</>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
