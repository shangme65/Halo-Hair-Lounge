"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Save, Loader2, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import IconSelector, { renderIcon } from "@/components/admin/IconSelector";
import { toast } from "react-hot-toast";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesContent {
  badgeText: string;
  headingPrefix: string;
  headingHighlight: string;
  description: string;
  features: Feature[];
}

const DEFAULT_CONTENT: FeaturesContent = {
  badgeText: "Our Commitment",
  headingPrefix: "Why Choose ",
  headingHighlight: "Halo Hair Lounge",
  description:
    "Experience the perfect blend of luxury, expertise, and innovation at our premier salon",
  features: [
    {
      icon: "Scissors",
      title: "Expert Stylists",
      description: "Highly trained professionals with years of experience",
    },
    {
      icon: "Sparkles",
      title: "Premium Products",
      description: "Only the finest hair care products and tools",
    },
    {
      icon: "Calendar",
      title: "Easy Booking",
      description: "Book appointments online 24/7 with instant confirmation",
    },
    {
      icon: "ShoppingBag",
      title: "Online Store",
      description: "Shop professional-grade products from home",
    },
    {
      icon: "Clock",
      title: "Flexible Hours",
      description: "Open when you need us",
    },
    {
      icon: "Users",
      title: "Community Focused",
      description: "Building relationships",
    },
  ],
};

const DEFAULT_FEATURES: Feature[] = DEFAULT_CONTENT.features;

export default function FeaturesEditorPage() {
  const router = useRouter();
  const [badgeText, setBadgeText] = useState(DEFAULT_CONTENT.badgeText);
  const [headingPrefix, setHeadingPrefix] = useState(
    DEFAULT_CONTENT.headingPrefix
  );
  const [headingHighlight, setHeadingHighlight] = useState(
    DEFAULT_CONTENT.headingHighlight
  );
  const [description, setDescription] = useState(DEFAULT_CONTENT.description);
  const [features, setFeatures] = useState<Feature[]>(DEFAULT_FEATURES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    index: number | null;
  }>({ show: false, index: null });
  const newFeatureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch("/api/features");
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        setFeatures(data.features);
      } else {
        setFeatures(DEFAULT_FEATURES);
      }

      // Set section content if available
      if (data.badgeText) setBadgeText(data.badgeText);
      if (data.headingPrefix) setHeadingPrefix(data.headingPrefix);
      if (data.headingHighlight) setHeadingHighlight(data.headingHighlight);
      if (data.description) setDescription(data.description);
    } catch (error) {
      console.error("Error fetching features:", error);
      toast.error("Failed to load features");
      setFeatures(DEFAULT_FEATURES);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          badgeText,
          headingPrefix,
          headingHighlight,
          description,
          features,
        }),
      });

      if (response.ok) {
        toast.success("Features saved successfully!");
        setEditMode(null);
      } else {
        toast.error("Failed to save features");
      }
    } catch (error) {
      console.error("Error saving features:", error);
      toast.error("Error saving features");
    } finally {
      setSaving(false);
    }
  };

  const updateFeatureField = (
    index: number,
    field: keyof Feature,
    value: string
  ) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const addFeature = () => {
    setFeatures([
      ...features,
      {
        icon: "Sparkles",
        title: "New Feature",
        description: "Feature description",
      },
    ]);

    // Scroll to new feature after it's rendered
    setTimeout(() => {
      newFeatureRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const deleteFeature = (index: number) => {
    if (features.length <= 1) {
      toast.error("Must have at least one feature");
      return;
    }

    setDeleteConfirm({ show: true, index });
  };

  const confirmDelete = () => {
    if (deleteConfirm.index !== null) {
      setFeatures(features.filter((_, i) => i !== deleteConfirm.index));
      toast.success("Feature deleted");
    }
    setDeleteConfirm({ show: false, index: null });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 pt-24 px-4 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              Featured Editor
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
            Click on any text to edit. Changes will be reflected on the
            homepage.
          </p>
        </div>

        {/* Section Preview/Editor */}
        <div className="mb-8 bg-gray-50 dark:bg-dark-800/50 rounded-2xl p-6 border border-gray-200 dark:border-dark-700">
          <div className="text-center">
            {/* Badge Text Editor */}
            <div className="mb-4">
              {editMode === "badge" ? (
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="inline-block px-6 py-2 text-sm font-semibold text-green-700 dark:text-green-400 bg-gradient-to-r from-green-100 to-primary-100 dark:from-green-950 dark:to-primary-950 rounded-full border-2 border-green-500 focus:outline-none"
                />
              ) : (
                <div
                  onClick={() => setEditMode("badge")}
                  className="inline-block px-6 py-2 bg-gradient-to-r from-green-100 to-primary-100 dark:from-green-950 dark:to-primary-950 rounded-full border border-green-200 dark:border-green-800 shadow-lg shadow-green-500/20 cursor-pointer hover:scale-105 transition-transform"
                >
                  <span className="text-sm font-semibold text-green-700 dark:text-green-400 tracking-wider">
                    {badgeText}
                  </span>
                </div>
              )}
            </div>

            {/* Heading Editor */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-5 leading-tight">
              {editMode === "headingPrefix" ? (
                <input
                  type="text"
                  value={headingPrefix}
                  onChange={(e) => setHeadingPrefix(e.target.value)}
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="inline-block px-3 py-1 text-gray-900 dark:text-white bg-white dark:bg-dark-800 border-2 border-primary-500 rounded-lg focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditMode("headingPrefix")}
                  className="text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 transition-colors"
                >
                  {headingPrefix}
                </span>
              )}{" "}
              {editMode === "headingHighlight" ? (
                <input
                  type="text"
                  value={headingHighlight}
                  onChange={(e) => setHeadingHighlight(e.target.value)}
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="inline-block px-3 py-1 bg-gradient-to-r from-green-600 via-primary-600 to-green-700 dark:from-green-400 dark:via-primary-400 dark:to-green-500 text-white rounded-lg border-2 border-primary-500 focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditMode("headingHighlight")}
                  className="bg-gradient-to-r from-green-600 via-primary-600 to-green-700 dark:from-green-400 dark:via-primary-400 dark:to-green-500 bg-clip-text text-transparent cursor-pointer hover:scale-105 inline-block transition-transform"
                >
                  {headingHighlight}
                </span>
              )}
            </h2>

            {/* Description Editor */}
            {editMode === "description" ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setEditMode(null)}
                autoFocus
                rows={3}
                className="w-full max-w-3xl mx-auto px-4 py-2 text-lg sm:text-xl text-dark-600 dark:text-dark-400 bg-white dark:bg-dark-800 border-2 border-primary-500 rounded-lg focus:outline-none resize-none"
              />
            ) : (
              <p
                onClick={() => setEditMode("description")}
                className="text-lg sm:text-xl text-dark-600 dark:text-dark-400 leading-relaxed max-w-3xl mx-auto cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Manage Cards Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
              Manage Cards ({features.length})
            </h2>
            <Button
              onClick={addFeature}
              className="flex flex-row items-center gap-0.5 py-1 text-xs h-7 bg-gradient-to-r from-primary-600 to-primary-700 !w-auto whitespace-nowrap flex-shrink-0"
            >
              <Plus size={12} />
              Add Feature
            </Button>
          </div>
          <p className="text-sm text-dark-600 dark:text-dark-400">
            {features.length} card{features.length !== 1 ? "s" : ""} loaded
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const isLastFeature = index === features.length - 1;
            return (
              <motion.div
                key={index}
                ref={isLastFeature ? newFeatureRef : null}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative group cursor-pointer">
                  {/* 3D Shadow Layers */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-primary-800/20 rounded-2xl transform translate-y-4 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-primary-800/10 rounded-2xl transform translate-y-6 transition-transform duration-300" />

                  {/* Main Card */}
                  <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 rounded-2xl p-5 border border-dark-200/20 dark:border-dark-700/30 shadow-2xl overflow-hidden">
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Icon Selector and Delete Button Row */}
                    <div className="mb-3 relative z-10">
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                        Icon
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <IconSelector
                            value={feature.icon}
                            onChange={(value) =>
                              updateFeatureField(index, "icon", value)
                            }
                          />
                        </div>
                        <Button
                          onClick={() => deleteFeature(index)}
                          className="flex items-center gap-1 py-1 px-2 text-xs h-7 bg-dark-900 hover:bg-black dark:bg-dark-800 dark:hover:bg-dark-900"
                          title="Delete feature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Icon and Title Row */}
                    <div className="flex items-center gap-3 mb-1.5 relative">
                      {/* Icon Container with 3D Effect */}
                      <motion.div
                        className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-lg flex-shrink-0"
                        whileHover={{
                          scale: 1.1,
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.5 },
                        }}
                      >
                        {renderIcon(
                          feature.icon,
                          "w-5 h-5 text-white relative z-10 drop-shadow-lg"
                        )}
                      </motion.div>

                      {/* Title */}
                      <div className="flex-1">
                        <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                          Title
                        </label>
                        {editMode === `title-${index}` ? (
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) =>
                              updateFeatureField(index, "title", e.target.value)
                            }
                            onBlur={() => setEditMode(null)}
                            autoFocus
                            className="w-full px-2 py-1 text-base font-bold rounded-lg border-2 border-primary-500 bg-white dark:bg-dark-800 text-dark-900 dark:text-white focus:outline-none"
                          />
                        ) : (
                          <h3
                            onClick={() => setEditMode(`title-${index}`)}
                            className="text-base font-bold bg-gradient-to-r from-dark-900 to-primary-700 dark:from-white dark:to-primary-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer"
                          >
                            {feature.title}
                          </h3>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="relative z-10">
                      <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400">
                        Description
                      </label>
                      {editMode === `description-${index}` ? (
                        <textarea
                          value={feature.description}
                          onChange={(e) =>
                            updateFeatureField(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          onBlur={() => setEditMode(null)}
                          autoFocus
                          rows={2}
                          className="w-full px-2 py-1 text-sm rounded-lg border-2 border-primary-500 bg-white dark:bg-dark-800 text-dark-600 dark:text-dark-400 resize-none focus:outline-none"
                        />
                      ) : (
                        <p
                          onClick={() => setEditMode(`description-${index}`)}
                          className="text-sm text-dark-600 dark:text-dark-400 leading-relaxed cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {feature.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Accent Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-600 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-800 rounded-lg p-6 max-w-md mx-4 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">
              Delete Feature Card
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-6">
              Are you sure you want to delete this feature card? This action
              cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setDeleteConfirm({ show: false, index: null })}
                className="px-3 py-1.5 text-xs"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
