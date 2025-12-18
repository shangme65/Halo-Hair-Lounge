"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-hot-toast";

interface CtaContent {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export default function CtaEditorPage() {
  const [cta, setCta] = useState<CtaContent>({
    title: "",
    description: "",
    buttonText: "",
    buttonHref: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);

  useEffect(() => {
    fetchCta();
  }, []);

  const fetchCta = async () => {
    try {
      const response = await fetch("/api/cta");
      const data = await response.json();

      if (data.title) {
        setCta(data);
      } else {
        setCta({
          title: "Ready to Transform Your Look?",
          description:
            "Book your appointment today and experience the difference. Our expert stylists are waiting to make your hair dreams come true.",
          buttonText: "Book Now",
          buttonHref: "/book",
        });
      }
    } catch (error) {
      console.error("Error fetching CTA:", error);
      toast.error("Failed to load CTA");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/cta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cta),
      });

      if (response.ok) {
        toast.success("CTA saved successfully!");
        setEditMode(null);
      } else {
        toast.error("Failed to save CTA");
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving CTA");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof CtaContent, value: string) => {
    setCta({ ...cta, [field]: value });
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
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Edit Call-to-Action Section
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Click any text to edit inline
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto gap-2 text-xs sm:text-sm py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Preview Card */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium mb-2 text-purple-100">
                Title
              </label>
              {editMode === "title" ? (
                <input
                  type="text"
                  value={cta.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="w-full px-3 py-2 text-2xl sm:text-3xl font-bold text-center rounded border-2 border-white bg-white/10 text-white placeholder-white/50 backdrop-blur-sm"
                />
              ) : (
                <h2
                  onClick={() => setEditMode("title")}
                  className="text-2xl sm:text-3xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {cta.title}
                </h2>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium mb-2 text-purple-100">
                Description
              </label>
              {editMode === "description" ? (
                <textarea
                  value={cta.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  rows={3}
                  className="w-full px-3 py-2 text-base sm:text-lg text-center rounded border-2 border-white bg-white/10 text-white placeholder-white/50 backdrop-blur-sm resize-none"
                />
              ) : (
                <p
                  onClick={() => setEditMode("description")}
                  className="text-base sm:text-lg text-purple-50 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {cta.description}
                </p>
              )}
            </div>

            {/* Button */}
            <div className="pt-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <div className="w-full sm:w-auto">
                  <label className="block text-xs font-medium mb-1.5 text-purple-100">
                    Button Text
                  </label>
                  {editMode === "buttonText" ? (
                    <input
                      type="text"
                      value={cta.buttonText}
                      onChange={(e) =>
                        updateField("buttonText", e.target.value)
                      }
                      onBlur={() => setEditMode(null)}
                      autoFocus
                      className="w-full px-3 py-2 text-sm font-semibold text-center rounded border-2 border-white bg-white/10 text-white placeholder-white/50 backdrop-blur-sm"
                    />
                  ) : (
                    <button
                      onClick={() => setEditMode("buttonText")}
                      className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      {cta.buttonText}
                    </button>
                  )}
                </div>

                <div className="w-full sm:w-auto">
                  <label className="block text-xs font-medium mb-1.5 text-purple-100">
                    Button Link
                  </label>
                  {editMode === "buttonHref" ? (
                    <input
                      type="text"
                      value={cta.buttonHref}
                      onChange={(e) =>
                        updateField("buttonHref", e.target.value)
                      }
                      onBlur={() => setEditMode(null)}
                      autoFocus
                      className="w-full px-3 py-2 text-sm text-center rounded border-2 border-white bg-white/10 text-white placeholder-white/50 backdrop-blur-sm"
                    />
                  ) : (
                    <div
                      onClick={() => setEditMode("buttonHref")}
                      className="px-3 py-2 text-sm text-center rounded bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors"
                    >
                      {cta.buttonHref}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Editor Fields */}
        <Card className="mt-4 p-4">
          <h3 className="text-base font-semibold mb-3 text-dark-900 dark:text-white">
            Quick Edit Fields
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                value={cta.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={cta.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Button Text
                </label>
                <input
                  type="text"
                  value={cta.buttonText}
                  onChange={(e) => updateField("buttonText", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Button Link
                </label>
                <input
                  type="text"
                  value={cta.buttonHref}
                  onChange={(e) => updateField("buttonHref", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
