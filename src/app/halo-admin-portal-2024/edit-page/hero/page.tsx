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
  colorScheme: "purple" | "gold" | "teal" | "rose" | "green";
  cta: {
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
      className="p-6 rounded-xl border-2 border-dark-200 dark:border-dark-700 hover:border-primary-400 transition-all bg-white dark:bg-dark-800"
    >
      {/* Slide Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-dark-200 dark:border-dark-700">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <GripVertical size={20} className="text-dark-400" />
          </div>
          <div className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold">
            Slide {index + 1}
          </div>
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white truncate max-w-md">
            {slide.title}
          </h3>
        </div>
        {slidesLength > 1 && (
          <Button
            onClick={() => deleteSlide(index)}
            size="sm"
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} className="mr-1" />
            Delete
          </Button>
        )}
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
            placeholder="e.g., Premium Hair Care Excellence"
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
            placeholder="e.g., Transform Your Look"
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
            placeholder="e.g., Experience luxury styling with our expert stylists"
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
              value={slide.cta.text}
              onChange={(e) =>
                updateSlideField(index, "cta.text", e.target.value)
              }
              placeholder="e.g., Book Appointment"
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
              value={slide.cta.href}
              onChange={(e) =>
                updateSlideField(index, "cta.href", e.target.value)
              }
              placeholder="e.g., /book"
              className="w-full px-4 py-2 rounded-lg border border-dark-300 dark:border-dark-600 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Secondary Button (Fixed to Explore Services) */}
        <div className="p-4 bg-dark-50 dark:bg-dark-900/50 rounded-lg border border-dark-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">
                <Sparkles size={16} className="text-dark-500" />
                Secondary Button (Fixed)
              </label>
              <p className="text-xs text-dark-500 dark:text-dark-400">
                This button always links to /services
              </p>
            </div>
            <div className="px-4 py-2 bg-white dark:bg-dark-800 border border-dark-300 dark:border-dark-600 rounded-lg text-sm text-dark-700 dark:text-dark-300">
              Explore Services → /services
            </div>
          </div>
        </div>

        {/* Color Scheme Selector */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-dark-700 dark:text-dark-300 mb-3">
            <Palette size={16} className="text-primary-500" />
            Color Scheme
          </label>
          <div className="flex gap-3 flex-wrap">
            {(
              [
                { name: "purple", label: "Purple" },
                { name: "gold", label: "Gold" },
                { name: "teal", label: "Teal" },
                { name: "rose", label: "Rose" },
                { name: "green", label: "Green" },
              ] as const
            ).map((color) => (
              <button
                key={color.name}
                onClick={() =>
                  updateSlideField(index, "colorScheme", color.name)
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  slide.colorScheme === color.name
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105"
                    : "border-dark-300 dark:border-dark-600 hover:border-primary-300"
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{
                    background:
                      color.name === "purple"
                        ? "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"
                        : color.name === "gold"
                        ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                        : color.name === "teal"
                        ? "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
                        : color.name === "rose"
                        ? "linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)"
                        : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  }}
                />
                <span className="text-sm font-medium text-dark-700 dark:text-dark-300">
                  {color.label}
                </span>
                {slide.colorScheme === color.name && (
                  <CheckCircle className="w-4 h-4 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview Button */}
        <Button
          onClick={() => setCurrentSlide(index)}
          size="sm"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Eye size={16} />
          Preview This Slide
        </Button>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 pt-16 px-2 pb-4">
      <div className="pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => router.push("/halo-admin-portal-2024/edit-page")}
                className="flex items-center gap-1 text-xs py-1.5 px-2"
                variant="outline"
              >
                <ArrowLeft size={14} />
                Back
              </Button>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-dark-900 dark:text-white">
                  Hero Editor
                </h1>
                <p className="text-xs text-dark-600 dark:text-dark-400">
                  Click to edit
                </p>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs py-1.5 px-2 bg-gradient-to-r from-primary-600 to-primary-700 w-full"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save
                </>
              )}
            </Button>
          </div>

          {/* Preview Section */}
          <Card className="mb-3 overflow-hidden">
            <div className="relative min-h-[300px] sm:min-h-[400px] flex items-center justify-center">
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

          {/* All Slides Editor */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                  Manage Slides ({slides.length})
                </h2>
                <p className="text-sm text-dark-600 dark:text-dark-400 mt-1">
                  <GripVertical size={14} className="inline mr-1" />
                  Drag to reorder slides
                </p>
              </div>
              <Button
                onClick={addSlide}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Slide
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={slides.map((_, i) => i.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-6">
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
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
