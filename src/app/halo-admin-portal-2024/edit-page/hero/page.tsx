"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  Edit2,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import HeroScene from "@/components/3d/HeroScene";
import toast from "react-hot-toast";

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  colorScheme: "purple" | "gold" | "teal" | "rose" | "green";
  cta: {
    text: string;
    href: string;
  };
}

export default function HeroEditor() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([
    {
      title: "Transform Your Look",
      subtitle: "Premium Hair Care Excellence",
      description: "Experience luxury styling with our expert stylists",
      colorScheme: "green",
      cta: { text: "Book Appointment", href: "/book" },
    },
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editMode, setEditMode] = useState<string | null>(null);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hero");
      const data = await response.json();

      if (data.heroContent && data.heroContent.slides) {
        setSlides(data.heroContent.slides);
      }
    } catch (error) {
      console.error("Error fetching hero content:", error);
      toast.error("Failed to load hero content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success("Hero section updated successfully!");
      setEditMode(null);
    } catch (error) {
      console.error("Error saving hero content:", error);
      toast.error("Failed to save hero content");
    } finally {
      setSaving(false);
    }
  };

  const updateSlideField = (index: number, field: string, value: any) => {
    const newSlides = [...slides];
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      newSlides[index] = {
        ...newSlides[index],
        [parent]: {
          ...(newSlides[index] as any)[parent],
          [child]: value,
        },
      };
    } else {
      newSlides[index] = { ...newSlides[index], [field]: value };
    }
    setSlides(newSlides);
  };

  const addSlide = () => {
    setSlides([
      ...slides,
      {
        title: "New Slide Title",
        subtitle: "New Subtitle",
        description: "New description",
        colorScheme: "green",
        cta: { text: "Get Started", href: "/book" },
      },
    ]);
    setCurrentSlide(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length === 1) {
      toast.error("You must have at least one slide");
      return;
    }
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    if (currentSlide >= newSlides.length) {
      setCurrentSlide(newSlides.length - 1);
    }
  };

  const slide = slides[currentSlide];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <div className="pt-20 px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/halo-admin-portal-2024/edit-page")}
                className="flex items-center gap-2"
                variant="outline"
              >
                <ArrowLeft size={18} />
                Back
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 dark:text-white">
                  Hero Section Editor
                </h1>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  Click on any element to edit it
                </p>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {/* Preview Section */}
          <Card className="mb-6 overflow-hidden">
            <div className="relative min-h-[600px] flex items-center justify-center">
              {/* 3D Background */}
              <div className="absolute inset-0 z-0">
                <HeroScene colorScheme={slide.colorScheme} />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900/80 z-10" />

              {/* Content */}
              <div className="container mx-auto px-4 relative z-20">
                <div className="text-center max-w-5xl mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`preview-${currentSlide}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Subtitle */}
                      <div
                        className={`inline-block px-6 py-3 glass rounded-full cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all ${
                          editMode === `subtitle-${currentSlide}`
                            ? "ring-2 ring-primary-500"
                            : ""
                        }`}
                        onClick={() => setEditMode(`subtitle-${currentSlide}`)}
                      >
                        {editMode === `subtitle-${currentSlide}` ? (
                          <input
                            type="text"
                            value={slide.subtitle}
                            onChange={(e) =>
                              updateSlideField(
                                currentSlide,
                                "subtitle",
                                e.target.value
                              )
                            }
                            onBlur={() => setEditMode(null)}
                            autoFocus
                            className="bg-transparent text-primary-300 font-semibold text-sm outline-none text-center min-w-[200px]"
                          />
                        ) : (
                          <span className="text-primary-300 font-semibold text-sm flex items-center">
                            <Sparkles className="w-4 h-4 mr-2" />
                            {slide.subtitle}
                            <Edit2 className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100" />
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <div
                        className={`cursor-pointer hover:ring-2 hover:ring-primary-500 rounded-lg p-2 transition-all ${
                          editMode === `title-${currentSlide}`
                            ? "ring-2 ring-primary-500"
                            : ""
                        }`}
                        onClick={() => setEditMode(`title-${currentSlide}`)}
                      >
                        {editMode === `title-${currentSlide}` ? (
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) =>
                              updateSlideField(
                                currentSlide,
                                "title",
                                e.target.value
                              )
                            }
                            onBlur={() => setEditMode(null)}
                            autoFocus
                            className="bg-transparent text-white text-6xl font-display font-bold outline-none text-center w-full"
                          />
                        ) : (
                          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                            {slide.title}
                          </h1>
                        )}
                      </div>

                      {/* Description */}
                      <div
                        className={`cursor-pointer hover:ring-2 hover:ring-primary-500 rounded-lg p-2 transition-all ${
                          editMode === `description-${currentSlide}`
                            ? "ring-2 ring-primary-500"
                            : ""
                        }`}
                        onClick={() =>
                          setEditMode(`description-${currentSlide}`)
                        }
                      >
                        {editMode === `description-${currentSlide}` ? (
                          <input
                            type="text"
                            value={slide.description}
                            onChange={(e) =>
                              updateSlideField(
                                currentSlide,
                                "description",
                                e.target.value
                              )
                            }
                            onBlur={() => setEditMode(null)}
                            autoFocus
                            className="bg-transparent text-dark-200 text-xl outline-none text-center w-full"
                          />
                        ) : (
                          <p className="text-xl md:text-2xl text-dark-200 mb-8 max-w-3xl mx-auto">
                            {slide.description}
                          </p>
                        )}
                      </div>

                      {/* CTA Button */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <div
                          className={`cursor-pointer hover:ring-2 hover:ring-primary-500 rounded-lg transition-all inline-block ${
                            editMode === `cta-${currentSlide}`
                              ? "ring-2 ring-primary-500"
                              : ""
                          }`}
                          onClick={() => setEditMode(`cta-${currentSlide}`)}
                        >
                          {editMode === `cta-${currentSlide}` ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={slide.cta.text}
                                onChange={(e) =>
                                  updateSlideField(
                                    currentSlide,
                                    "cta.text",
                                    e.target.value
                                  )
                                }
                                placeholder="Button Text"
                                className="bg-dark-800 text-white px-4 py-2 rounded-lg outline-none"
                              />
                              <input
                                type="text"
                                value={slide.cta.href}
                                onChange={(e) =>
                                  updateSlideField(
                                    currentSlide,
                                    "cta.href",
                                    e.target.value
                                  )
                                }
                                placeholder="Link URL"
                                className="bg-dark-800 text-white px-4 py-2 rounded-lg outline-none"
                              />
                              <button
                                onClick={() => setEditMode(null)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg"
                              >
                                <CheckCircle size={18} />
                              </button>
                            </div>
                          ) : (
                            <Button size="lg" className="group">
                              {slide.cta.text}
                              <Edit2 className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Color Scheme Selector */}
                      <div className="mt-8 flex justify-center gap-3">
                        {(
                          ["purple", "gold", "teal", "rose", "green"] as const
                        ).map((color) => (
                          <button
                            key={color}
                            onClick={() =>
                              updateSlideField(
                                currentSlide,
                                "colorScheme",
                                color
                              )
                            }
                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                              slide.colorScheme === color
                                ? "border-white scale-110"
                                : "border-dark-600 hover:scale-105"
                            }`}
                            style={{
                              background:
                                color === "purple"
                                  ? "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"
                                  : color === "gold"
                                  ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                                  : color === "teal"
                                  ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
                                  : color === "rose"
                                  ? "linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)"
                                  : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Card>

          {/* Slides Management */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                Manage Slides ({slides.length})
              </h2>
              <Button
                onClick={addSlide}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Slide
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {slides.map((s, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    currentSlide === index
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-dark-200 dark:border-dark-700 hover:border-primary-300"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                >
                  <div className="text-sm font-medium text-dark-900 dark:text-white mb-1 truncate">
                    Slide {index + 1}
                  </div>
                  <div className="text-xs text-dark-600 dark:text-dark-400 truncate">
                    {s.title}
                  </div>
                  {slides.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSlide(index);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
