"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Award, Clock, Users, Plus, Trash2, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-hot-toast";

const iconOptions = [
  { name: "Heart", icon: Heart },
  { name: "Award", icon: Award },
  { name: "Clock", icon: Clock },
  { name: "Users", icon: Users },
];

interface Reason {
  icon: string;
  title: string;
  description: string;
}

export default function WhyChooseUsEditorPage() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);

  useEffect(() => {
    fetchReasons();
  }, []);

  const fetchReasons = async () => {
    try {
      const response = await fetch("/api/why-choose-us");
      const data = await response.json();

      if (data.reasons && data.reasons.length > 0) {
        setReasons(data.reasons);
      } else {
        setReasons([
          {
            icon: "Heart",
            title: "Passionate Experts",
            description: "Our team loves what they do",
          },
          {
            icon: "Award",
            title: "Award Winning",
            description: "Recognized for excellence",
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
        ]);
      }
    } catch (error) {
      console.error("Error fetching reasons:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/why-choose-us", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reasons }),
      });

      if (response.ok) {
        toast.success("Content saved successfully!");
        setEditMode(null);
      } else {
        toast.error("Failed to save content");
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving content");
    } finally {
      setSaving(false);
    }
  };

  const updateReasonField = (
    index: number,
    field: keyof Reason,
    value: string
  ) => {
    const updated = [...reasons];
    updated[index] = { ...updated[index], [field]: value };
    setReasons(updated);
  };

  const addReason = () => {
    setReasons([
      ...reasons,
      { icon: "Heart", title: "New Reason", description: "Reason description" },
    ]);
  };

  const deleteReason = (index: number) => {
    if (reasons.length > 1) {
      setReasons(reasons.filter((_, i) => i !== index));
      toast.success("Reason deleted");
    } else {
      toast.error("Must have at least one reason");
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((opt) => opt.name === iconName);
    return iconOption ? iconOption.icon : Heart;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 pt-16 px-2 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col gap-2 mb-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Why Choose Us
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Click to edit
            </p>
          </div>
          <div className="flex gap-1.5 w-full">
            <Button
              onClick={addReason}
              className="flex-1 gap-1.5 text-xs py-1.5 px-2"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 gap-1.5 text-xs py-1.5 px-2 bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {reasons.map((reason, index) => {
            const IconComponent = getIconComponent(reason.icon);

            return (
              <Card
                key={index}
                className="p-4 hover:shadow-xl transition-all relative group"
              >
                {/* Delete Button */}
                <button
                  onClick={() => deleteReason(index)}
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
                      value={reason.icon}
                      onChange={(e) =>
                        updateReasonField(index, "icon", e.target.value)
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
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
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
                        value={reason.title}
                        onChange={(e) =>
                          updateReasonField(index, "title", e.target.value)
                        }
                        onBlur={() => setEditMode(null)}
                        autoFocus
                        className="w-full px-2 py-1.5 text-sm font-semibold rounded border border-blue-500 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                      />
                    ) : (
                      <h3
                        onClick={() => setEditMode(`title-${index}`)}
                        className="text-sm font-semibold text-dark-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {reason.title}
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
                        value={reason.description}
                        onChange={(e) =>
                          updateReasonField(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        onBlur={() => setEditMode(null)}
                        autoFocus
                        rows={3}
                        className="w-full px-2 py-1.5 text-xs rounded border border-blue-500 bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 resize-none"
                      />
                    ) : (
                      <p
                        onClick={() => setEditMode(`description-${index}`)}
                        className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {reason.description}
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
