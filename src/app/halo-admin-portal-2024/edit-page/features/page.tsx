"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Star, Plus, Trash2, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-hot-toast";

const iconOptions = [
  { name: "Sparkles", icon: Sparkles },
  { name: "Zap", icon: Zap },
  { name: "Shield", icon: Shield },
  { name: "Star", icon: Star },
];

interface Feature {
  icon: string;
  title: string;
  description: string;
}

export default function FeaturesEditorPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);

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
        setFeatures([
          {
            icon: "Sparkles",
            title: "Premium Products",
            description: "Only the finest hair care products",
          },
          {
            icon: "Zap",
            title: "Expert Stylists",
            description: "Trained professionals at your service",
          },
          {
            icon: "Shield",
            title: "Quality Guarantee",
            description: "100% satisfaction guaranteed",
          },
          {
            icon: "Star",
            title: "Luxury Experience",
            description: "Relax in our elegant salon",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching features:", error);
      toast.error("Failed to load features");
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
        body: JSON.stringify({ features }),
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
  };

  const deleteFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
      toast.success("Feature deleted");
    } else {
      toast.error("Must have at least one feature");
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((opt) => opt.name === iconName);
    return iconOption ? iconOption.icon : Sparkles;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 p-3 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Edit Features Section
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Click any text to edit inline
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={addFeature}
              className="flex-1 sm:flex-none gap-2 text-xs sm:text-sm py-2 px-3"
            >
              <Plus className="w-4 h-4" /> Add Feature
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none gap-2 text-xs sm:text-sm py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((feature, index) => {
            const IconComponent = getIconComponent(feature.icon);

            return (
              <Card
                key={index}
                className="p-4 hover:shadow-xl transition-all relative group"
              >
                {/* Delete Button */}
                <button
                  onClick={() => deleteFeature(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                <div className="space-y-3">
                  {/* Icon Selector */}
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                      Icon
                    </label>
                    <select
                      value={feature.icon}
                      onChange={(e) =>
                        updateFeatureField(index, "icon", e.target.value)
                      }
                      className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.name} value={opt.name}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Icon Preview */}
                  <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
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
                        className="w-full px-2 py-1.5 text-sm font-semibold rounded border border-purple-500 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                      />
                    ) : (
                      <h3
                        onClick={() => setEditMode(`title-${index}`)}
                        className="text-sm font-semibold text-dark-900 dark:text-white cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        {feature.title}
                      </h3>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
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
                        rows={3}
                        className="w-full px-2 py-1.5 text-xs rounded border border-purple-500 bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 resize-none"
                      />
                    ) : (
                      <p
                        onClick={() => setEditMode(`description-${index}`)}
                        className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
