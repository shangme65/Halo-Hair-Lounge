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
  GripVertical,
  Calendar,
  Link as LinkIcon,
  Type,
  AlignLeft,
  Palette,
  MousePointer,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HexColorPicker } from "react-colorful";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import HeroScene from "@/components/3d/HeroScene";
import toast from "react-hot-toast";

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  colorScheme: "purple" | "gold" | "teal" | "green";
  cta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
}

interface SortableSlideProps {
  slide: HeroSlide;
  index: number;
  currentSlide: number;
  updateSlideField: (index: number, field: string, value: any) => void;
  deleteSlide: (index: number) => void;
  setCurrentSlide: (index: number) => void;
  slidesLength: number;
}

function SortableSlide({
  slide,
  index,
  currentSlide,
  updateSlideField,
  deleteSlide,
  setCurrentSlide,
  slidesLength,
}: SortableSlideProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: index.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 sm:p-6 rounded-lg border border-dark-200 dark:border-dark-700 hover:border-primary-400 transition-all bg-white dark:bg-dark-800 shadow-sm hover:shadow-md"
    >
      {/* Slide Header */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-dark-200 dark:border-dark-700">
        <div className="flex items-center gap-1 sm:gap-3 flex-1 min-w-0">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 sm:p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors flex-shrink-0"
          >
            <GripVertical size={14} className="sm:w-5 sm:h-5 text-dark-400" />
          </div>
          <div className="px-1.5 py-0.5 sm:px-3 sm:py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-semibold flex-shrink-0">
            Slide {index + 1}
          </div>
          <h3 className="text-sm sm:text-lg font-semibold text-dark-900 dark:text-white truncate flex-1 min-w-0">
            {slide.title}
          </h3>
        </div>
      </div>

      {/* Slide Content Editor */}
      <div className="grid gap-4">
        {/* Subtitle */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            <Sparkles size={16} className="text-primary-500" />
            Subtitle
          </label>
          <input
            type="text"
            value={slide.subtitle}
            onChange={(e) =>
              updateSlideField(index, "subtitle", e.target.value)
            }
            placeholder={slide.subtitle || "e.g., Premium Hair Care Excellence"}
            className="w-full px-4 py-3 rounded-lg border border-dark-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            <Type size={16} className="text-primary-500" />
            Title
          </label>
          <input
            type="text"
            value={slide.title}
            onChange={(e) => updateSlideField(index, "title", e.target.value)}
            placeholder={slide.title || "e.g., Transform Your Look"}
            className="w-full px-4 py-3 rounded-lg border border-dark-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-dark-900 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            <AlignLeft size={16} className="text-primary-500" />
            Description
          </label>
          <textarea
            value={slide.description}
            onChange={(e) =>
              updateSlideField(index, "description", e.target.value)
            }
            placeholder={
              slide.description ||
              "e.g., Experience luxury styling with our expert stylists"
            }
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-dark-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        {/* Primary CTA Button */}
        <div className="grid sm:grid-cols-2 gap-4 p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg border border-primary-200 dark:border-primary-800">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              <MousePointer size={16} className="text-primary-600" />
              Primary Button Text
            </label>
            <input
              type="text"
              value={slide.cta?.text || ""}
              onChange={(e) =>
                updateSlideField(index, "cta.text", e.target.value)
              }
              placeholder={slide.cta?.text || "e.g., Book Appointment"}
              className="w-full px-4 py-2 rounded-lg border border-dark-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              <LinkIcon size={16} className="text-primary-600" />
              Primary Button Link
            </label>
            <input
              type="text"
              value={slide.cta?.href || ""}
              onChange={(e) =>
                updateSlideField(index, "cta.href", e.target.value)
              }
              placeholder={
                slide.cta?.href || "e.g., /book or https://example.com"
              }
              className="w-full px-4 py-2 rounded-lg border border-dark-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Secondary CTA Button */}
        <div className="grid sm:grid-cols-2 gap-4 p-4 bg-dark-50 dark:bg-dark-900/50 rounded-lg border border-dark-200 dark:border-dark-700">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              <MousePointer size={16} className="text-dark-600" />
              Secondary Button Text
            </label>
            <input
              type="text"
              value={slide.secondaryCta?.text || ""}
              onChange={(e) =>
                updateSlideField(index, "secondaryCta.text", e.target.value)
              }
              placeholder={slide.secondaryCta?.text || "e.g., Explore Services"}
              className="w-full px-4 py-2 rounded-lg border border-dark-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              <LinkIcon size={16} className="text-dark-600" />
              Secondary Button Link
            </label>
            <input
              type="text"
              value={slide.secondaryCta?.href || ""}
              onChange={(e) =>
                updateSlideField(index, "secondaryCta.href", e.target.value)
              }
              placeholder={
                slide.secondaryCta?.href ||
                "e.g., /services or https://example.com"
              }
              className="w-full px-4 py-2 rounded-lg border border-dark-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Color Scheme Selector */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
            <Palette size={16} className="text-primary-500" />
            Color Scheme
          </label>
          <div className="flex gap-2">
            {(
              [
                { name: "purple", label: "Purple" },
                { name: "gold", label: "Gold" },
                { name: "teal", label: "Teal" },
                { name: "green", label: "Green" },
              ] as const
            ).map((color) => (
              <button
                key={color.name}
                onClick={() =>
                  updateSlideField(index, "colorScheme", color.name)
                }
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded border transition-all text-xs ${
                  slide.colorScheme === color.name
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-dark-300 dark:border-dark-600 hover:border-primary-300"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background:
                      color.name === "purple"
                        ? "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"
                        : color.name === "gold"
                        ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                        : color.name === "teal"
                        ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
                        : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  }}
                />
                <span className="text-xs font-medium text-dark-700 dark:text-dark-300">
                  {color.label}
                </span>
                {slide.colorScheme === color.name && (
                  <CheckCircle className="w-3 h-3 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2">
          {slidesLength > 1 && (
            <Button
              onClick={() => deleteSlide(index)}
              variant="outline"
              className="flex items-center gap-0.5 py-1 text-xs h-7 text-red-600 hover:text-red-700 !w-auto"
            >
              <Trash2 size={12} />
              Delete
            </Button>
          )}

          <Button
            onClick={() => {
              setCurrentSlide(index);
              // Scroll to top to view the preview section
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 py-1 text-xs h-7 bg-gradient-to-r from-primary-600 to-primary-700 !w-auto"
          >
            <Eye size={12} />
            Preview This Slide
          </Button>
        </div>
      </div>
    </div>
  );
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
    {
      title: "Discover Beauty",
      subtitle: "Innovative Hair Solutions",
      description: "From classic cuts to bold transformations",
      colorScheme: "green",
      cta: { text: "View Services", href: "/services" },
    },
    {
      title: "Your Hair Journey",
      subtitle: "Starts Here Today",
      description: "Personalized consultations and expert care",
      colorScheme: "green",
      cta: { text: "Get Started", href: "/about" },
    },
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editMode, setEditMode] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hero");
      const data = await response.json();

      console.log("Hero content fetched:", data);
      console.log("Slides:", data.heroContent?.slides);

      if (data.heroContent && data.heroContent.slides) {
        setSlides(data.heroContent.slides);
        console.log("Slides set to:", data.heroContent.slides);
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id as string);
      const newIndex = parseInt(over.id as string);

      setSlides((items) => arrayMove(items, oldIndex, newIndex));

      // Update current slide if it was moved
      if (currentSlide === oldIndex) {
        setCurrentSlide(newIndex);
      } else if (currentSlide === newIndex) {
        setCurrentSlide(oldIndex > newIndex ? newIndex + 1 : newIndex - 1);
      }

      toast.success("Slide reordered!");
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

  if (!slide) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-dark-600 dark:text-dark-400">
          No slides available. Click "Add Slide" to create one.
        </p>
      </div>
    );
  }

  if (!slide) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-dark-600 dark:text-dark-400">
          No slides available. Click "Add Slide" to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 pt-24">
      <div className="px-4 pb-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-6 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                Hero Editor
              </h1>

              <div className="flex items-center gap-1">
                <Button
                  onClick={() =>
                    router.push("/halo-admin-portal-2024/edit-page")
                  }
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
                      <Loader2 size={12} className="animate-spin" />
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
              Edit and manage your hero slides
            </p>
          </div>

          {/* Preview Section */}
          <div className="mb-8 overflow-hidden rounded-lg bg-white dark:bg-dark-800 shadow-sm border border-dark-200 dark:border-dark-700">
            <div className="relative min-h-[250px] sm:min-h-[350px] flex items-center justify-center">
              {/* 3D Background */}
              <div className="absolute inset-0 z-0">
                <HeroScene colorScheme={slide.colorScheme} />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900/80 z-10" />

              {/* Content */}
              <div className="w-full px-3 sm:px-6 py-4 sm:py-6 relative z-20">
                <div className="text-center max-w-4xl mx-auto h-full flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`preview-${currentSlide}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-3 sm:space-y-4"
                    >
                      {/* Subtitle */}
                      <div
                        className={`inline-block px-3 py-1.5 sm:px-4 sm:py-2 glass rounded-full cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all ${
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
                            className="bg-transparent text-primary-300 font-semibold text-xs sm:text-sm outline-none text-center min-w-[150px] sm:min-w-[200px]"
                          />
                        ) : (
                          <span className="text-primary-300 font-semibold text-xs sm:text-sm flex items-center">
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            {slide.subtitle}
                            <Edit2 className="w-2 h-2 sm:w-3 sm:h-3 ml-1 sm:ml-2 opacity-0 group-hover:opacity-100" />
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
                            className="bg-transparent text-white text-2xl sm:text-3xl font-display font-bold outline-none text-center w-full"
                          />
                        ) : (
                          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2 sm:mb-3 leading-tight drop-shadow-2xl">
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
                            className="bg-transparent text-dark-200 text-sm sm:text-base outline-none text-center w-full"
                          />
                        ) : (
                          <p className="text-sm sm:text-base text-dark-200 mb-3 sm:mb-4 max-w-2xl mx-auto">
                            {slide.description}
                          </p>
                        )}
                      </div>

                      {/* CTA Button */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                        <div
                          className={`cursor-pointer hover:ring-2 hover:ring-primary-500 rounded-lg transition-all inline-block ${
                            editMode === `cta-${currentSlide}`
                              ? "ring-2 ring-primary-500"
                              : ""
                          }`}
                          onClick={() => setEditMode(`cta-${currentSlide}`)}
                        >
                          {editMode === `cta-${currentSlide}` ? (
                            <div className="flex gap-1 sm:gap-2">
                              <input
                                type="text"
                                value={slide.cta?.text || ""}
                                onChange={(e) =>
                                  updateSlideField(
                                    currentSlide,
                                    "cta.text",
                                    e.target.value
                                  )
                                }
                                placeholder="Button Text"
                                className="bg-dark-800 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm outline-none"
                              />
                              <input
                                type="text"
                                value={slide.cta?.href || ""}
                                onChange={(e) =>
                                  updateSlideField(
                                    currentSlide,
                                    "cta.href",
                                    e.target.value
                                  )
                                }
                                placeholder="Link URL"
                                className="bg-dark-800 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm outline-none"
                              />
                              <button
                                onClick={() => setEditMode(null)}
                                className="bg-green-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm"
                              >
                                <CheckCircle
                                  size={14}
                                  className="sm:w-4 sm:h-4"
                                />
                              </button>
                            </div>
                          ) : (
                            <Button className="group text-sm py-2 px-4 sm:py-3 sm:px-6">
                              {slide.cta?.text || "Button"}
                              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 opacity-0 group-hover:opacity-100" />
                            </Button>
                          )}
                        </div>
                        {slide.secondaryCta && (
                          <div>
                            <Button
                              variant="outline"
                              className="text-sm py-2 px-4 sm:py-3 sm:px-6"
                            >
                              {slide.secondaryCta?.text || "Explore Services"}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Color Scheme Selector */}
                      <div className="mt-4 sm:mt-6 flex justify-center gap-1.5 sm:gap-2">
                        {(["purple", "gold", "teal", "green"] as const).map(
                          (color) => (
                            <button
                              key={color}
                              onClick={() =>
                                updateSlideField(
                                  currentSlide,
                                  "colorScheme",
                                  color
                                )
                              }
                              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 transition-all ${
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
                                    : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                              }}
                            />
                          )
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Manage Slides Header */}
          <div className="mb-6">
            <div className="flex flex-row items-center justify-between gap-2 mb-1">
              <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
                Manage Slides ({slides.length})
              </h2>
              <Button
                onClick={addSlide}
                className="flex flex-row items-center gap-0.5 py-1 text-xs h-7 bg-gradient-to-r from-primary-600 to-primary-700 !w-auto whitespace-nowrap flex-shrink-0"
              >
                <Plus size={12} />
                Add Slide
              </Button>
            </div>
            <p className="text-sm text-dark-600 dark:text-dark-400">
              <GripVertical size={14} className="inline mr-1" />
              Drag to reorder slides • {slides.length} slide
              {slides.length !== 1 ? "s" : ""} loaded
            </p>
          </div>

          {/* Individual Slide Cards */}
          {slides.length === 0 ? (
            <div className="bg-white dark:bg-dark-800 rounded-lg border border-dark-200 dark:border-dark-700 p-8 shadow-sm">
              <div className="text-center text-dark-500 dark:text-dark-400">
                No slides found. Click "Add Slide" to create your first slide.
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={slides.map((_, i) => i.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {slides.map((s, index) => (
                    <SortableSlide
                      key={index}
                      slide={s}
                      index={index}
                      currentSlide={currentSlide}
                      updateSlideField={updateSlideField}
                      deleteSlide={deleteSlide}
                      setCurrentSlide={setCurrentSlide}
                      slidesLength={slides.length}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </motion.div>
      </div>
    </div>
  );
}
