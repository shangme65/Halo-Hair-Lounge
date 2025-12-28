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
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-hot-toast";
import Image from "next/image";

const ringColorOptions = [
  { name: "Purple", value: "from-purple-400 to-purple-600" },
  { name: "Blue", value: "from-blue-400 to-blue-600" },
  { name: "Green", value: "from-green-400 to-green-600" },
  { name: "Orange", value: "from-orange-400 to-orange-600" },
  { name: "Pink", value: "from-pink-400 to-pink-600" },
  { name: "Teal", value: "from-teal-400 to-teal-600" },
  { name: "Indigo", value: "from-indigo-400 to-indigo-600" },
  { name: "Red", value: "from-red-400 to-red-600" },
  { name: "Yellow", value: "from-yellow-400 to-yellow-600" },
  { name: "Cyan", value: "from-cyan-400 to-cyan-600" },
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
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(
    null
  );
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const cardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const newTestimonialRef = useRef<HTMLDivElement | null>(null);
  const [sectionHeader, setSectionHeader] = useState({
    badge: "Client Reviews",
    titlePrefix: "Our Client ",
    titleHighlight: "Reviews",
    subtitle: "Feedbacks from our satisfied clients",
    cardsPerRow: 2,
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
        if (data.sectionHeader) {
          setSectionHeader(data.sectionHeader);
        }
      } else {
        // Set default testimonials from homepage if none exist
        setTestimonials([
          {
            name: "Sarah Johnson",
            role: "Regular Client",
            rating: 5,
            text: "Absolutely amazing experience! The stylists are incredibly talented and truly listen to what you want. My hair has never looked better.",
            image: "/uploads/testimonials/user1.jpg",
            ringColor: "from-blue-400 to-blue-600",
            verified: true,
          },
          {
            name: "Michael Chen",
            role: "Happy Customer",
            rating: 5,
            text: "I've been coming here for over two years and they never disappoint. Professional service, premium products, and results that exceed expectations every single time.",
            image: "/uploads/testimonials/user2.jpg",
            ringColor: "from-green-400 to-green-600",
          },
          {
            name: "Emma Williams",
            role: "Loyal Client",
            rating: 4,
            text: "The best salon experience I've ever had! From the consultation to the final styling, everything was perfect. The team is friendly, skilled, and really passionate about hair care.",
            image: "/uploads/testimonials/user3.jpg",
            ringColor: "from-purple-400 to-purple-600",
          },
          {
            name: "James Rodriguez",
            role: "Satisfied Customer",
            rating: 5,
            text: "Outstanding service from start to finish! My stylist took the time to understand exactly what I wanted and delivered beyond my expectations.",
            image: "/uploads/testimonials/user4.jpg",
            ringColor: "from-orange-400 to-orange-600",
          },
          {
            name: "Olivia Martinez",
            role: "Beauty Enthusiast",
            rating: 5,
            text: "I was nervous about trying a new salon, but Halo Hair Lounge exceeded all my expectations. The consultation was thorough, and the results were stunning.",
            image: "/uploads/testimonials/user5.jpg",
            ringColor: "from-pink-400 to-pink-600",
          },
          {
            name: "David Thompson",
            role: "Professional Client",
            rating: 4,
            text: "Best hair care experience in the city! The attention to detail is remarkable, and they use only top-tier products. Worth every penny!",
            image: "/uploads/testimonials/user6.jpg",
            ringColor: "from-teal-400 to-teal-600",
          },
          {
            name: "Sophia Anderson",
            role: "Regular Visitor",
            rating: 5,
            text: "I've tried many salons over the years, but none compare to Halo. The stylists are true artists who genuinely care about their craft.",
            image: "/uploads/testimonials/user7.jpg",
            ringColor: "from-indigo-400 to-indigo-600",
          },
          {
            name: "Ryan Mitchell",
            role: "First-Time Client",
            rating: 5,
            text: "Incredible transformation! I came in with damaged hair and left with healthy, vibrant locks. The team's expertise in hair restoration is unmatched.",
            image: "/uploads/testimonials/user8.jpg",
            ringColor: "from-red-400 to-red-600",
          },
          {
            name: "Isabella Garcia",
            role: "Bridal Client",
            rating: 5,
            text: "They made me feel like a princess on my wedding day! The bridal styling was absolutely perfect, and it lasted all day and night.",
            image: "/uploads/testimonials/user9.jpg",
            ringColor: "from-yellow-400 to-yellow-600",
          },
          {
            name: "Daniel Lee",
            role: "Corporate Client",
            rating: 4,
            text: "As someone who values professionalism and quality, I'm impressed by Halo's consistency. Every appointment is punctual, every service is excellent.",
            image: "/uploads/testimonials/user10.jpg",
            ringColor: "from-cyan-400 to-cyan-600",
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
        body: JSON.stringify({
          testimonials,
          sectionHeader,
        }),
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
    // Cycle through the 10 default ring colors
    const defaultColors = [
      "from-purple-400 to-purple-600",
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-orange-400 to-orange-600",
      "from-pink-400 to-pink-600",
      "from-teal-400 to-teal-600",
      "from-indigo-400 to-indigo-600",
      "from-red-400 to-red-600",
      "from-yellow-400 to-yellow-600",
      "from-cyan-400 to-cyan-600",
    ];
    const nextColorIndex = testimonials.length % defaultColors.length;

    setTestimonials([
      ...testimonials,
      {
        name: "New Client",
        role: "Client",
        rating: 5,
        text: "Add testimonial text here...",
        image:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
        ringColor: defaultColors[nextColorIndex],
        verified: true,
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

      // Focus on the previous card or scroll to top
      setTimeout(() => {
        if (index > 0) {
          // Focus on the card above (previous card)
          const prevCard = cardRefs.current[index - 1];
          if (prevCard) {
            prevCard.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          // If it's the first card, scroll to top
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 pt-24 px-2 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mt-4"
      >
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              Edit Reviews
            </h1>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => router.push("/halo-admin-portal-2024/edit-page")}
                className="flex items-center gap-0.5 py-1 px-1.5 text-xs h-7 transition-shadow duration-500 ease-in-out hover:!shadow-[inset_0_-3px_2px_0_rgba(0,0,0,0.25),inset_2px_0_2px_0_rgba(255,255,255,0.15),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_4px_0_0_rgba(34,197,94,0.8),0_5px_0_0_rgba(34,197,94,0.6),0_6px_0_0_rgba(34,197,94,0.4),0_10px_12px_-3px_rgba(0,0,0,0.5),0_15px_25px_-5px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(34,197,94,0.7)]"
                variant="outline"
              >
                <ArrowLeft size={12} />
                Back
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-0.5 py-1 px-1.5 text-xs h-7 bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-2xl hover:shadow-green-500/50 transition-shadow duration-500 ease-in-out"
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
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-block mb-3 px-3 py-1.5 bg-primary-500/10 dark:bg-primary-500/20 backdrop-blur-sm rounded-full border border-primary-500/20 dark:border-primary-500/30 shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{
                boxShadow:
                  "0 4px 15px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
              }}
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
                  className="text-xs font-semibold text-primary-600 tracking-wider drop-shadow-sm bg-transparent border-none outline-none text-center"
                />
              ) : (
                <span
                  onClick={() => setEditMode("badge")}
                  className="text-xs font-semibold text-primary-600 tracking-wider drop-shadow-sm cursor-pointer"
                >
                  {sectionHeader.badge}
                </span>
              )}
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
              {editMode === "titlePrefix" ? (
                <input
                  type="text"
                  value={sectionHeader.titlePrefix}
                  onChange={(e) =>
                    setSectionHeader({
                      ...sectionHeader,
                      titlePrefix: e.target.value,
                    })
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="inline-block px-3 py-1 text-gray-900 dark:text-white bg-white dark:bg-dark-800 border-2 border-primary-500 rounded-lg focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditMode("titlePrefix")}
                  className="text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 transition-colors"
                >
                  {sectionHeader.titlePrefix}
                </span>
              )}{" "}
              {editMode === "titleHighlight" ? (
                <input
                  type="text"
                  value={sectionHeader.titleHighlight}
                  onChange={(e) =>
                    setSectionHeader({
                      ...sectionHeader,
                      titleHighlight: e.target.value,
                    })
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="inline-block px-3 py-1 text-green-500 dark:text-green-400 bg-white dark:bg-dark-800 border-2 border-primary-500 rounded-lg focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditMode("titleHighlight")}
                  className="text-green-500 dark:text-green-400 cursor-pointer hover:text-green-600 dark:hover:text-green-300 transition-colors"
                >
                  {sectionHeader.titleHighlight}
                </span>
              )}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
                  className="text-center w-full px-4 py-2 text-base border-2 border-green-500 rounded-lg bg-white dark:bg-dark-700 text-gray-600 dark:text-gray-400"
                />
              ) : (
                <span
                  onClick={() => setEditMode("subtitle")}
                  className="cursor-pointer"
                >
                  {sectionHeader.subtitle}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Cards Per Row Control */}
        <div className="bg-white dark:bg-dark-800 rounded-xl p-3 shadow-lg mb-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-dark-900 dark:text-white">
                Homepage Display
              </h3>
              <div className="flex gap-1.5">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() =>
                      setSectionHeader({ ...sectionHeader, cardsPerRow: num })
                    }
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                      sectionHeader.cardsPerRow === num
                        ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              Set how many testimonial cards to show at once on the homepage
            </p>
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
              className="flex flex-row items-center gap-0.5 py-1 text-xs h-7 bg-gradient-to-r from-primary-600 to-primary-700 !w-auto whitespace-nowrap flex-shrink-0 hover:shadow-2xl hover:shadow-green-500/50 transition-shadow duration-500 ease-in-out"
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
                key={`testimonial-${index}`}
                ref={(el) => {
                  cardRefs.current[index] = el;
                  if (isLastTestimonial) {
                    newTestimonialRef.current = el;
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 relative group"
                style={{
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 30px -5px rgba(0, 0, 0, 0.15)",
                }}
              >
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
                      style={{
                        boxShadow: testimonial.ringColor.includes("purple")
                          ? "0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)"
                          : testimonial.ringColor.includes("blue")
                          ? "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)"
                          : testimonial.ringColor.includes("green")
                          ? "0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(16, 185, 129, 0.3)"
                          : testimonial.ringColor.includes("pink")
                          ? "0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(219, 39, 119, 0.3)"
                          : testimonial.ringColor.includes("teal") ||
                            testimonial.ringColor.includes("cyan")
                          ? "0 0 20px rgba(20, 184, 166, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)"
                          : testimonial.ringColor.includes("indigo")
                          ? "0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(79, 70, 229, 0.3)"
                          : testimonial.ringColor.includes("red")
                          ? "0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(220, 38, 38, 0.3)"
                          : testimonial.ringColor.includes("yellow")
                          ? "0 0 20px rgba(250, 204, 21, 0.5), 0 0 40px rgba(234, 179, 8, 0.3)"
                          : testimonial.ringColor.includes("orange")
                          ? "0 0 20px rgba(249, 115, 22, 0.5), 0 0 40px rgba(234, 88, 12, 0.3)"
                          : "0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)",
                      }}
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
                          className="font-bold text-gray-900 dark:text-white text-base cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          {testimonial.name}
                        </h4>
                      )}
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
                        className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors"
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
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      "{testimonial.text}"
                    </p>
                  )}
                </div>

                {/* Edit Controls - Bottom Section */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700 space-y-3">
                  {/* Image Upload/URL Section */}
                  <div>
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
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:text-green-600 dark:hover:text-green-400 hover:underline truncate transition-colors"
                          title={testimonial.image}
                        >
                          {testimonial.image}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ring Color */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Ring Color
                    </label>
                    <div className="grid grid-cols-5 gap-2">
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
                          className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded border transition-all ${
                            testimonial.ringColor === opt.value
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                              : "border-dark-300 dark:border-dark-600 hover:border-primary-300"
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              background:
                                opt.name === "Purple"
                                  ? "linear-gradient(135deg, #c084fc 0%, #c026d3 100%)"
                                  : opt.name === "Blue"
                                  ? "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)"
                                  : opt.name === "Green"
                                  ? "linear-gradient(135deg, #4ade80 0%, #16a34a 100%)"
                                  : opt.name === "Orange"
                                  ? "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)"
                                  : opt.name === "Pink"
                                  ? "linear-gradient(135deg, #f9a8d4 0%, #db2777 100%)"
                                  : opt.name === "Teal"
                                  ? "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)"
                                  : opt.name === "Indigo"
                                  ? "linear-gradient(135deg, #a5b4fc 0%, #4f46e5 100%)"
                                  : opt.name === "Red"
                                  ? "linear-gradient(135deg, #f87171 0%, #dc2626 100%)"
                                  : opt.name === "Yellow"
                                  ? "linear-gradient(135deg, #fde047 0%, #ca8a04 100%)"
                                  : "linear-gradient(135deg, #67e8f9 0%, #0891b2 100%)",
                            }}
                          />
                          {testimonial.ringColor === opt.value && (
                            <CheckCircle className="w-3.5 h-3.5 text-primary-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Rating
                    </label>
                    <div className="flex gap-1.5">
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

                  {/* Delete Button */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-700">
                    {deleteConfirmIndex === index ? (
                      <div className="space-y-2">
                        <p className="text-sm text-center text-gray-700 dark:text-gray-300">
                          Delete this testimonial?
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              deleteTestimonial(index);
                              setDeleteConfirmIndex(null);
                            }}
                            variant="outline"
                            className="flex-1 flex items-center justify-center gap-0.5 py-1 text-xs h-7 text-red-600 hover:!text-white transition-shadow duration-500 ease-in-out hover:!shadow-[inset_0_-3px_2px_0_rgba(0,0,0,0.25),inset_2px_0_2px_0_rgba(255,255,255,0.15),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_4px_0_0_rgba(239,68,68,0.8),0_5px_0_0_rgba(239,68,68,0.6),0_6px_0_0_rgba(239,68,68,0.4),0_10px_12px_-3px_rgba(0,0,0,0.5),0_15px_25px_-5px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(239,68,68,0.7)]"
                            style={{ color: undefined }}
                          >
                            Delete
                          </Button>
                          <Button
                            onClick={() => setDeleteConfirmIndex(null)}
                            variant="outline"
                            className="flex-1 flex items-center justify-center gap-0.5 py-1 text-xs h-7 transition-shadow duration-500 ease-in-out hover:!shadow-[inset_0_-3px_2px_0_rgba(0,0,0,0.25),inset_2px_0_2px_0_rgba(255,255,255,0.15),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_4px_0_0_rgba(34,197,94,0.8),0_5px_0_0_rgba(34,197,94,0.6),0_6px_0_0_rgba(34,197,94,0.4),0_10px_12px_-3px_rgba(0,0,0,0.5),0_15px_25px_-5px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(34,197,94,0.7)]"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setDeleteConfirmIndex(index)}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-red-600 hover:!text-white dark:text-red-400 dark:hover:!text-white transition-shadow duration-500 ease-in-out hover:!shadow-[inset_0_-3px_2px_0_rgba(0,0,0,0.25),inset_2px_0_2px_0_rgba(255,255,255,0.15),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_4px_0_0_rgba(239,68,68,0.8),0_5px_0_0_rgba(239,68,68,0.6),0_6px_0_0_rgba(239,68,68,0.4),0_10px_12px_-3px_rgba(0,0,0,0.5),0_15px_25px_-5px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(239,68,68,0.7)]"
                        style={{ color: undefined }}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    )}
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
