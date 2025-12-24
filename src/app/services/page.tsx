"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Image from "next/image";
import ImageLightbox from "@/components/ui/ImageLightbox";

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
  value: string;
  label: string;
  serviceCount: number;
}

// Wrapper component to handle Suspense for useSearchParams
export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
          <div className="pt-20 px-3 pb-4 sm:pt-24 sm:px-4 container mx-auto max-w-7xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        </div>
      }
    >
      <ServicesPageContent />
    </Suspense>
  );
}

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [initialScrollDone, setInitialScrollDone] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxTitle, setLightboxTitle] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetchServices();
    fetchCategories();
  }, []);

  // Auto-expand category from URL and scroll to it
  useEffect(() => {
    if (
      categoryFromUrl &&
      categories.length > 0 &&
      !loading &&
      !initialScrollDone
    ) {
      // Expand the category
      if (!expandedCategories.includes(categoryFromUrl)) {
        setExpandedCategories((prev) => [...prev, categoryFromUrl]);
      }

      // Scroll to the category after a short delay to let DOM update
      setTimeout(() => {
        const element = categoryRefs.current[categoryFromUrl];
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setInitialScrollDone(true);
      }, 100);
    }
  }, [categoryFromUrl, categories, loading, initialScrollDone]);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.services || []);
    } catch (error) {
      console.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/service-categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories");
    }
  };

  const toggleCategory = (categoryValue: string) => {
    const isCurrentlyExpanded = expandedCategories.includes(categoryValue);

    setExpandedCategories(
      isCurrentlyExpanded
        ? [] // Close if already open
        : [categoryValue] // Open only this category, closing all others
    );

    // Scroll to the category after a short delay to let DOM update
    if (!isCurrentlyExpanded) {
      setTimeout(() => {
        const element = categoryRefs.current[categoryValue];
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group services by category
  const servicesByCategory = Array.isArray(categories)
    ? categories.reduce((acc, category) => {
        acc[category.value] = filteredServices.filter(
          (service) =>
            service.categories && service.categories.includes(category.value)
        );
        return acc;
      }, {} as Record<string, Service[]>)
    : {};

  // Function to open lightbox
  const openLightbox = (service: Service) => {
    // Service can have single image or comma-separated images
    const images = service.image
      ? service.image
          .split(",")
          .map((img) => img.trim())
          .filter(Boolean)
      : [];
    if (images.length > 0) {
      setLightboxImages(images);
      setLightboxTitle(service.name);
      setLightboxIndex(0);
      setLightboxOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <div className="pt-20 px-3 pb-2 sm:pt-24 sm:px-4 container mx-auto max-w-7xl">
        {!mounted ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header and Search Combined */}
            <Card className="p-4 mb-4">
              <div className="mb-3">
                <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 leading-tight">
                  Our Services
                </h1>
                <p className="text-xs text-primary-700 dark:text-primary-300">
                  Professional hair care services for every style
                </p>
              </div>

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
              <div className="space-y-4">
                {Array.isArray(categories) &&
                  categories.map((category) => {
                    const categoryServices =
                      servicesByCategory[category.value] || [];
                    const isExpanded = expandedCategories.includes(
                      category.value
                    );

                    if (categoryServices.length === 0) return null;

                    return (
                      <div
                        key={category.value}
                        ref={(el) => {
                          categoryRefs.current[category.value] = el;
                        }}
                      >
                        <Card className="overflow-hidden !p-0">
                          {/* Category Header */}
                          <div
                            className="flex items-center justify-between py-2 px-3 bg-primary-50 dark:bg-primary-900/20 border-b border-dark-200 dark:border-dark-700 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                            onClick={() => toggleCategory(category.value)}
                          >
                            <div className="flex items-center gap-2">
                              <button className="p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
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
                              <h2 className="text-lg font-bold text-primary-900 dark:text-primary-100">
                                {category.label}
                              </h2>
                              <span className="px-2 py-0.5 text-xs font-medium bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200 rounded-full">
                                {categoryServices.length}{" "}
                                {categoryServices.length === 1
                                  ? "service"
                                  : "services"}
                              </span>
                            </div>
                          </div>

                          {/* Category Services */}
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="p-2"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {categoryServices.map((service) => (
                                  <div
                                    key={service.id}
                                    className="overflow-hidden border border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 hover:shadow-lg transition-shadow duration-300"
                                  >
                                    <div
                                      className="aspect-[4/3] bg-dark-100 dark:bg-dark-800 relative cursor-pointer group"
                                      onClick={() => openLightbox(service)}
                                    >
                                      {service.image ? (
                                        <>
                                          <Image
                                            src={service.image
                                              .split(",")[0]
                                              .trim()}
                                            alt={service.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                                          {/* Show image count badge if multiple images */}
                                          {service.image
                                            .split(",")
                                            .filter(Boolean).length > 1 && (
                                            <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
                                              {
                                                service.image
                                                  .split(",")
                                                  .filter(Boolean).length
                                              }{" "}
                                              photos
                                            </div>
                                          )}
                                          {/* Hover overlay */}
                                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                              Click to view
                                            </span>
                                          </div>
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
                                            className="text-primary-600 dark:text-primary-400"
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
                                            className="text-primary-600 dark:text-primary-400"
                                          />
                                          <span className="text-xs text-dark-600 dark:text-dark-400 font-bold">
                                            {service.duration} min
                                          </span>
                                        </div>
                                      </div>

                                      <button
                                        onClick={() => {
                                          // Navigate to booking page with service pre-selected
                                          window.location.href = `/book?service=${service.id}`;
                                        }}
                                        className="w-full px-3 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                                      >
                                        Book Now
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </Card>
                      </div>
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
        )}
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={lightboxTitle}
      />
    </div>
  );
}
