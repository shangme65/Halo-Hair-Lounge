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
      router.push("/admin/appointments");
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
        router.push("/admin/services");
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
        ? `/api/admin/services/${params.id}`
        : "/api/admin/services";

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
      router.push("/admin/services");
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
    <div className="min-h-screen bg-dark-950">
      <AdminSidebar />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => router.push("/admin/services")}
              className="mb-4 flex items-center gap-2 bg-dark-800 hover:bg-dark-700 text-white"
            >
              <ArrowLeft size={20} />
              Back to Services
            </Button>

            <h1 className="text-4xl font-bold text-white mb-2">
              {isEdit ? "Edit Service" : "Add New Service"}
            </h1>
            <p className="text-dark-400">
              {isEdit
                ? "Update service information"
                : "Create a new service for your salon"}
            </p>
          </div>

          {/* Form */}
          <Card className="bg-dark-900 border-dark-800 max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Name */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Classic Haircut"
                  className="bg-dark-800 border-dark-700 text-white"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the service..."
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px]"
                  required
                />
              </div>

              {/* Price and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                    className="bg-dark-800 border-dark-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="60"
                    className="bg-dark-800 border-dark-700 text-white"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="HAIRCUT">Haircut</option>
                  <option value="COLORING">Coloring</option>
                  <option value="STYLING">Styling</option>
                  <option value="TREATMENT">Treatment</option>
                  <option value="BRAIDING">Braiding</option>
                  <option value="EXTENSION">Extension</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Service Image
                </label>

                {/* HD Enhancement Toggle */}
                <div className="flex items-center gap-3 mb-4 p-4 bg-dark-800/50 rounded-lg border border-dark-700">
                  <input
                    type="checkbox"
                    id="enhanceHD"
                    checked={enhanceHD}
                    onChange={(e) => setEnhanceHD(e.target.checked)}
                    className="w-5 h-5 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label
                    htmlFor="enhanceHD"
                    className="text-white cursor-pointer"
                  >
                    <span className="font-medium">Enhance HD Quality</span>
                    <p className="text-sm text-dark-400 mt-1">
                      Upload image in high definition (1920x1080) with enhanced
                      sharpness and quality
                    </p>
                  </label>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative mb-4 rounded-lg overflow-hidden border-2 border-dark-700">
                    <Image
                      src={imagePreview}
                      alt="Service preview"
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-3 px-6 py-4 bg-dark-800 border-2 border-dashed border-dark-600 hover:border-primary-500 rounded-lg transition-colors">
                      {uploading ? (
                        <>
                          <Loader2
                            className="animate-spin text-primary-500"
                            size={24}
                          />
                          <span className="text-white">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="text-primary-500" size={24} />
                          <span className="text-white">
                            {imagePreview ? "Change Image" : "Upload Image"}
                          </span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <p className="text-sm text-dark-400 mt-2">
                  Recommended: JPG, PNG or WebP. Max size: 10MB
                </p>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-5 h-5 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
                />
                <label htmlFor="isActive" className="text-white cursor-pointer">
                  Service is active
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-dark-800">
                <Button
                  type="button"
                  onClick={() => router.push("/admin/services")}
                  className="flex-1 bg-dark-800 hover:bg-dark-700 text-white"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                  disabled={loading || uploading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>{isEdit ? "Update Service" : "Create Service"}</>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
