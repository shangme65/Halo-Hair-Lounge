"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Plus, Trash2, Save, Upload } from "lucide-react";
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
}

export default function TestimonialsEditorPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);

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
        setTestimonials([
          {
            name: "Sarah Johnson",
            role: "Regular Client",
            rating: 5,
            text: "Absolutely love the service! The stylists are so talented.",
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
            ringColor: "from-purple-500 to-pink-500",
          },
          {
            name: "Michael Chen",
            role: "Business Professional",
            rating: 5,
            text: "Best hair salon in town! Always professional and friendly.",
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            ringColor: "from-blue-500 to-cyan-500",
          },
          {
            name: "Emily Davis",
            role: "Bride",
            rating: 5,
            text: "They made me look perfect for my wedding day!",
            image:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
            ringColor: "from-green-500 to-emerald-500",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
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
    value: string | number
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
        <div className="flex flex-col gap-2 mb-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Edit Testimonials
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Click to edit
            </p>
          </div>
          <div className="flex gap-1.5 w-full">
            <Button
              onClick={addTestimonial}
              className="flex-1 gap-1.5 text-xs py-1.5 px-2"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 gap-1.5 text-xs py-1.5 px-2 bg-gradient-to-r from-pink-600 to-purple-600"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-2 hover:shadow-lg transition-all relative group"
            >
              {/* Delete Button */}
              <button
                onClick={() => deleteTestimonial(index)}
                className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>

              <div className="space-y-1.5">
                {/* Image with Ring */}
                <div className="flex justify-center">
                  <div
                    className={`p-1 rounded-full bg-gradient-to-br ${testimonial.ringColor}`}
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white dark:bg-dark-800">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Image URL
                  </label>
                  {editMode === `image-${index}` ? (
                    <input
                      type="text"
                      value={testimonial.image}
                      onChange={(e) =>
                        updateTestimonialField(index, "image", e.target.value)
                      }
                      onBlur={() => setEditMode(null)}
                      autoFocus
                      className="w-full px-2 py-1 text-xs rounded border border-pink-500 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                    />
                  ) : (
                    <div
                      onClick={() => setEditMode(`image-${index}`)}
                      className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline truncate"
                    >
                      {testimonial.image}
                    </div>
                  )}
                </div>

                {/* Ring Color */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Ring Color
                  </label>
                  <select
                    value={testimonial.ringColor}
                    onChange={(e) =>
                      updateTestimonialField(index, "ringColor", e.target.value)
                    }
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                  >
                    {ringColorOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  {editMode === `name-${index}` ? (
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) =>
                        updateTestimonialField(index, "name", e.target.value)
                      }
                      onBlur={() => setEditMode(null)}
                      autoFocus
                      className="w-full px-2 py-1.5 text-sm font-semibold rounded border border-pink-500 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                    />
                  ) : (
                    <h3
                      onClick={() => setEditMode(`name-${index}`)}
                      className="text-sm font-semibold text-dark-900 dark:text-white cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                    >
                      {testimonial.name}
                    </h3>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  {editMode === `role-${index}` ? (
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) =>
                        updateTestimonialField(index, "role", e.target.value)
                      }
                      onBlur={() => setEditMode(null)}
                      autoFocus
                      className="w-full px-2 py-1 text-xs rounded border border-pink-500 bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300"
                    />
                  ) : (
                    <p
                      onClick={() => setEditMode(`role-${index}`)}
                      className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                    >
                      {testimonial.role}
                    </p>
                  )}
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
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= testimonial.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Testimonial
                  </label>
                  {editMode === `text-${index}` ? (
                    <textarea
                      value={testimonial.text}
                      onChange={(e) =>
                        updateTestimonialField(index, "text", e.target.value)
                      }
                      onBlur={() => setEditMode(null)}
                      autoFocus
                      rows={4}
                      className="w-full px-2 py-1.5 text-xs rounded border border-pink-500 bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 resize-none"
                    />
                  ) : (
                    <p
                      onClick={() => setEditMode(`text-${index}`)}
                      className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors italic"
                    >
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
