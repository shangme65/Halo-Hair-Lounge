"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Plus,
  Trash2,
  Save,
  Upload,
  Link as LinkIcon,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-hot-toast";
import Image from "next/image";

const ringColorOptions = [
  { name: "Purple", value: "from-purple-500 to-pink-500" },
  { name: "Blue", value: "from-blue-500 to-cyan-500" },
  { name: "Green", value: "from-green-500 to-emerald-500" },
  { name: "Orange", value: "from-orange-500 to-red-500" },
];

interface Testimonial {
  name: string;
  role: string;
  rating: number;
  text: string;
  image: string;
  ringColor: string;
  verified?: boolean;
}

export default function TestimonialsEditorPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const newTestimonialRef = useRef<HTMLDivElement | null>(null);
  const [sectionHeader, setSectionHeader] = useState({
    badge: "Client Reviews",
    title: "Our Client Reviews",
    subtitle: "Feedbacks from our satisfied clients",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials");
      const data = await response.json();

      if (data.testimonials && data.testimonials.length > 0) {
        setTestimonials(data.testimonials);
      } else {
        // Set default testimonials from homepage if none exist
        setTestimonials([
          {
            name: "Sarah Johnson",
            role: "Regular Client",
            rating: 4.9,
            text: "Absolutely amazing experience! The stylists are incredibly talented and truly listen to what you want. My hair has never looked better.",
            image: "/uploads/testimonials/user1.jpg",
            ringColor: "from-blue-500 to-cyan-500",
            verified: true,
          },
          {
            name: "Michael Chen",
            role: "Happy Customer",
            rating: 5.0,
            text: "I've been coming here for over two years and they never disappoint. Professional service, premium products, and results that exceed expectations every single time.",
            image: "/uploads/testimonials/user2.jpg",
            ringColor: "from-green-500 to-emerald-500",
          },
          {
            name: "Emma Williams",
            role: "Loyal Client",
            rating: 4.8,
            text: "The best salon experience I've ever had! From the consultation to the final styling, everything was perfect. The team is friendly, skilled, and really passionate about hair care.",
            image: "/uploads/testimonials/user3.jpg",
            ringColor: "from-purple-500 to-pink-500",
          },
          {
            name: "James Rodriguez",
            role: "Satisfied Customer",
            rating: 4.9,
            text: "Outstanding service from start to finish! My stylist took the time to understand exactly what I wanted and delivered beyond my expectations.",
            image: "/uploads/testimonials/user4.jpg",
            ringColor: "from-orange-500 to-red-500",
          },
          {
            name: "Olivia Martinez",
            role: "Beauty Enthusiast",
            rating: 5.0,
            text: "I was nervous about trying a new salon, but Halo Hair Lounge exceeded all my expectations. The consultation was thorough, and the results were stunning.",
            image: "/uploads/testimonials/user5.jpg",
            ringColor: "from-purple-500 to-pink-500",
          },
          {
            name: "David Thompson",
            role: "Professional Client",
            rating: 4.7,
            text: "Best hair care experience in the city! The attention to detail is remarkable, and they use only top-tier products. Worth every penny!",
            image: "/uploads/testimonials/user6.jpg",
            ringColor: "from-blue-500 to-cyan-500",
          },
          {
            name: "Sophia Anderson",
            role: "Regular Visitor",
            rating: 4.9,
            text: "I've tried many salons over the years, but none compare to Halo. The stylists are true artists who genuinely care about their craft.",
            image: "/uploads/testimonials/user7.jpg",
            ringColor: "from-purple-500 to-pink-500",
          },
          {
            name: "Ryan Mitchell",
            role: "First-Time Client",
            rating: 5.0,
            text: "Incredible transformation! I came in with damaged hair and left with healthy, vibrant locks. The team's expertise in hair restoration is unmatched.",
            image: "/uploads/testimonials/user8.jpg",
            ringColor: "from-orange-500 to-red-500",
          },
          {
            name: "Isabella Garcia",
            role: "Bridal Client",
            rating: 5.0,
            text: "They made me feel like a princess on my wedding day! The bridal styling was absolutely perfect, and it lasted all day and night.",
            image: "/uploads/testimonials/user9.jpg",
            ringColor: "from-orange-500 to-red-500",
          },
          {
            name: "Daniel Lee",
            role: "Corporate Client",
            rating: 4.8,
            text: "As someone who values professionalism and quality, I'm impressed by Halo's consistency. Every appointment is punctual, every service is excellent.",
            image: "/uploads/testimonials/user10.jpg",
            ringColor: "from-blue-500 to-cyan-500",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to load testimonials");
      // Set defaults on error too
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (
    index: number,
    file: File
  ): Promise<void> => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image must be less than 10MB");
      return;
    }

    setUploadingIndex(index);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "testimonial");
    formData.append("enhanceHD", "true");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      updateTestimonialField(index, "image", data.url);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonials }),
      });

      if (response.ok) {
        toast.success("Testimonials saved successfully!");
        setEditMode(null);
        // Refresh to get latest data
        await fetchTestimonials();
      } else {
        toast.error("Failed to save testimonials");
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving testimonials");
    } finally {
      setSaving(false);
    }
  };

  const updateTestimonialField = (
    index: number,
    field: keyof Testimonial,
    value: string | number | boolean
  ) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  };

  const addTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        name: "New Client",
        role: "Client",
        rating: 5,
        text: "Add testimonial text here...",
        image:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
        ringColor: "from-purple-500 to-pink-500",
      },
    ]);
    setTimeout(() => {
      newTestimonialRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const deleteTestimonial = (index: number) => {
    if (testimonials.length > 1) {
      setTestimonials(testimonials.filter((_, i) => i !== index));
      toast.success("Testimonial deleted");
    } else {
      toast.error("Must have at least one testimonial");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 pt-16 px-2 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              Edit Testimonials
            </h1>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => router.push("/halo-admin-portal-2024/edit-page")}
                className="flex items-center gap-0.5 py-1 px-1.5 text-xs h-7"
                variant="outline"
              >
                <ArrowLeft size={12} />
                Back
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-0.5 py-1 px-1.5 text-xs h-7 bg-gradient-to-r from-primary-600 to-primary-700"
              >
                {saving ? (
                  <>
                    <Save size={12} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={12} />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            Click on any text to edit. Changes will be reflected on the
            homepage.
          </p>
        </div>

        {/* Testimonials Section Header - Editable Card */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg mb-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-4"
            >
              {editMode === "badge" ? (
                <input
                  type="text"
                  value={sectionHeader.badge}
                  onChange={(e) =>
                    setSectionHeader({
                      ...sectionHeader,
                      badge: e.target.value,
                    })
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="inline-block px-6 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-semibold text-sm border-2 border-green-500"
                />
              ) : (
                <span
                  onClick={() => setEditMode("badge")}
                  className="inline-block px-6 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-semibold text-sm cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  {sectionHeader.badge}
                </span>
              )}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              {editMode === "title" ? (
                <input
                  type="text"
                  value={sectionHeader.title}
                  onChange={(e) =>
                    setSectionHeader({
                      ...sectionHeader,
                      title: e.target.value,
                    })
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="text-center w-full px-4 py-2 text-3xl md:text-4xl font-bold border-2 border-green-500 rounded-lg bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              ) : (
                <span
                  onClick={() => setEditMode("title")}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {sectionHeader.title.split(" ").slice(0, 2).join(" ")}{" "}
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {sectionHeader.title.split(" ").slice(2).join(" ")}
                  </span>
                </span>
              )}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
            >
              {editMode === "subtitle" ? (
                <input
                  type="text"
                  value={sectionHeader.subtitle}
                  onChange={(e) =>
                    setSectionHeader({
                      ...sectionHeader,
                      subtitle: e.target.value,
                    })
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="text-center w-full px-4 py-2 text-base md:text-lg border-2 border-green-500 rounded-lg bg-white dark:bg-dark-700 text-gray-600 dark:text-gray-400"
                />
              ) : (
                <span
                  onClick={() => setEditMode("subtitle")}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {sectionHeader.subtitle}
                </span>
              )}
            </motion.p>
          </div>
        </div>

        {/* Manage Cards Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
              Manage Cards ({testimonials.length})
            </h2>
            <Button
              onClick={addTestimonial}
              className="flex flex-row items-center gap-0.5 py-1 text-xs h-7 bg-gradient-to-r from-primary-600 to-primary-700 !w-auto whitespace-nowrap flex-shrink-0"
            >
              <Plus size={12} />
              Add Card
            </Button>
          </div>
          <p className="text-sm text-dark-600 dark:text-dark-400">
            {testimonials.length} card{testimonials.length !== 1 ? "s" : ""}{" "}
            loaded
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => {
            const isLastTestimonial = index === testimonials.length - 1;
            return (
              <motion.div
                key={index}
                ref={isLastTestimonial ? newTestimonialRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 relative group"
                style={{
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 30px -5px rgba(0, 0, 0, 0.15)",
                }}
              >
                {/* Delete Button - Top Left */}
                <button
                  onClick={() => deleteTestimonial(index)}
                  className="absolute top-4 left-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg hover:bg-red-600 hover:scale-110 transform duration-200"
                  title="Delete testimonial"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Rating Badge - Top Right */}
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${testimonial.ringColor} text-white shadow-lg`}
                  >
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span className="text-sm font-bold">
                      {testimonial.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* User Info Section */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Profile Image with Colored Ring */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonial.ringColor} p-0.5`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name and Role */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      {editMode === `name-${index}` ? (
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) =>
                            updateTestimonialField(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          onBlur={() => setEditMode(null)}
                          autoFocus
                          className="font-bold text-gray-900 dark:text-white text-base w-full px-2 py-1 rounded border-2 border-pink-500 bg-white dark:bg-dark-700"
                        />
                      ) : (
                        <h4
                          onClick={() => setEditMode(`name-${index}`)}
                          className="font-bold text-gray-900 dark:text-white text-base cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                        >
                          {testimonial.name}
                        </h4>
                      )}
                      {testimonial.verified && (
                        <div className="relative">
                          <svg
                            viewBox="0 0 22 22"
                            className="w-5 h-5"
                            fill="none"
                          >
                            <path
                              d="M11 0L13.09 2.26L16.18 2.63L16.54 5.72L18.8 7.8L16.54 9.88L16.18 12.97L13.09 13.34L11 15.6L8.91 13.34L5.82 12.97L5.46 9.88L3.2 7.8L5.46 5.72L5.82 2.63L8.91 2.26L11 0Z"
                              fill="#22c55e"
                              transform="translate(0, 3.2) scale(1)"
                            />
                            <path
                              d="M8.5 11L10 12.5L13.5 9"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="square"
                              strokeLinejoin="miter"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    {editMode === `role-${index}` ? (
                      <input
                        type="text"
                        value={testimonial.role}
                        onChange={(e) =>
                          updateTestimonialField(index, "role", e.target.value)
                        }
                        onBlur={() => setEditMode(null)}
                        autoFocus
                        className="text-sm text-gray-600 dark:text-gray-400 w-full px-2 py-1 rounded border-2 border-pink-500 bg-white dark:bg-dark-700"
                      />
                    ) : (
                      <p
                        onClick={() => setEditMode(`role-${index}`)}
                        className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                      >
                        {testimonial.role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Testimonial Text */}
                <div>
                  {editMode === `text-${index}` ? (
                    <textarea
                      value={testimonial.text}
                      onChange={(e) =>
                        updateTestimonialField(index, "text", e.target.value)
                      }
                      onBlur={() => setEditMode(null)}
                      autoFocus
                      rows={4}
                      className="w-full text-gray-700 dark:text-gray-300 leading-relaxed text-sm px-3 py-2 rounded border-2 border-pink-500 bg-white dark:bg-dark-700 resize-none"
                    />
                  ) : (
                    <p
                      onClick={() => setEditMode(`text-${index}`)}
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                    >
                      "{testimonial.text}"
                    </p>
                  )}
                </div>

                {/* Edit Controls - Bottom Section */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700 space-y-3">
                  {/* Image Upload/URL Section */}
                  <div>
                    <label className="block text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Image
                    </label>
                    <div className="space-y-2">
                      {/* Upload Button */}
                      <div className="flex gap-2">
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[index] = el;
                          }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(index, file);
                          }}
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRefs.current[index]?.click()}
                          disabled={uploadingIndex === index}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploadingIndex === index ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              Upload Image
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setEditMode(`image-${index}`)}
                          className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-all"
                        >
                          <LinkIcon className="w-4 h-4" />
                          URL
                        </button>
                      </div>

                      {/* Image URL Input (when in edit mode) */}
                      {editMode === `image-${index}` && (
                        <div className="space-y-1">
                          <input
                            type="url"
                            value={testimonial.image}
                            onChange={(e) =>
                              updateTestimonialField(
                                index,
                                "image",
                                e.target.value
                              )
                            }
                            onBlur={() => setEditMode(null)}
                            autoFocus
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 text-xs rounded-lg border-2 border-pink-500 bg-white dark:bg-dark-700 text-dark-900 dark:text-white focus:ring-2 focus:ring-pink-500/20"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Press Enter or click outside to save
                          </p>
                        </div>
                      )}

                      {/* Current Image URL Display */}
                      {!editMode?.startsWith(`image-${index}`) && (
                        <div
                          onClick={() => setEditMode(`image-${index}`)}
                          className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline truncate"
                          title={testimonial.image}
                        >
                          {testimonial.image}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ring Color and Rating Row */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Ring Color */}
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Ring Color
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {ringColorOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() =>
                              updateTestimonialField(
                                index,
                                "ringColor",
                                opt.value
                              )
                            }
                            className={`relative p-2 rounded-lg border-2 transition-all duration-200 ${
                              testimonial.ringColor === opt.value
                                ? "border-pink-500 shadow-lg scale-105"
                                : "border-gray-200 dark:border-dark-700 hover:border-pink-300 hover:scale-102"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-6 h-6 rounded-full bg-gradient-to-br ${opt.value} shadow-md`}
                              />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {opt.name}
                              </span>
                            </div>
                            {testimonial.ringColor === opt.value && (
                              <div className="absolute top-1 right-1">
                                <svg
                                  className="w-3 h-3 text-pink-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() =>
                              updateTestimonialField(index, "rating", star)
                            }
                            className="transition-transform hover:scale-125 active:scale-95"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= testimonial.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Verified Badge Toggle */}
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Verified Badge
                      </label>
                      <button
                        onClick={() =>
                          updateTestimonialField(
                            index,
                            "verified",
                            !testimonial.verified
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          testimonial.verified
                            ? "bg-gradient-to-r from-pink-500 to-purple-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            testimonial.verified
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
