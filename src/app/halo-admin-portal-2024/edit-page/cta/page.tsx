"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Save, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface CtaContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  trustIndicators: string[];
}

export default function CtaEditorPage() {
  const [cta, setCta] = useState<CtaContent>({
    badge: "",
    title: "",
    description: "",
    buttonText: "",
    buttonHref: "",
    trustIndicators: [],
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
          badge: "Book Now & Get Started",
          title: "Ready for Your Transformation?",
          description:
            "Book your appointment today and experience the Halo difference",
          buttonText: "Book Your Appointment",
          buttonHref: "/book",
          trustIndicators: [
            "Expert Stylists",
            "Premium Products",
            "Flexible Scheduling",
            "Premium Styling",
            "Expert Care",
            "Personalized Service",
          ],
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 pt-16 px-2 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col gap-2 mb-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
              Edit Call-to-Action
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Click to edit
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full gap-1.5 text-xs py-1.5 px-2 bg-gradient-to-r from-green-600 to-green-600"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>

        {/* Preview Section - Exactly like homepage */}
        <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-2xl overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05),transparent_50%)]" />

          <div className="relative text-center py-16 px-6">
            <motion.div className="max-w-4xl mx-auto">
              {/* Accent Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-xl"
              >
                {editMode === "badge" ? (
                  <input
                    type="text"
                    value={cta.badge || "Book Now & Get Started"}
                    onChange={(e) => updateField("badge", e.target.value)}
                    onBlur={() => setEditMode(null)}
                    autoFocus
                    className="text-xs font-semibold text-white tracking-wider bg-transparent border-b-2 border-white outline-none text-center"
                  />
                ) : (
                  <span
                    onClick={() => setEditMode("badge")}
                    className="text-xs font-semibold text-white tracking-wider flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    {cta.badge || "Book Now & Get Started"}
                  </span>
                )}
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-4"
              >
                {editMode === "title" ? (
                  <input
                    type="text"
                    value={cta.title || ""}
                    onChange={(e) => updateField("title", e.target.value)}
                    onBlur={() => setEditMode(null)}
                    autoFocus
                    className="w-full px-3 py-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-center rounded border-2 border-white bg-white/10 text-white placeholder-white/50 backdrop-blur-sm"
                  />
                ) : (
                  <h2
                    onClick={() => setEditMode("title")}
                    className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <span className="inline-block bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                      {cta.title}
                    </span>
                  </h2>
                )}
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                {editMode === "description" ? (
                  <textarea
                    value={cta.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    onBlur={() => setEditMode(null)}
                    autoFocus
                    rows={2}
                    className="w-full px-3 py-2 text-base sm:text-lg lg:text-xl text-center rounded border-2 border-white bg-white/10 text-white placeholder-white/50 backdrop-blur-sm resize-none max-w-3xl mx-auto"
                  />
                ) : (
                  <p
                    onClick={() => setEditMode("description")}
                    className="text-base sm:text-lg lg:text-xl text-green-50 max-w-3xl mx-auto leading-relaxed font-light cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    {cta.description}
                  </p>
                )}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
                className="mb-8"
              >
                {editMode === "buttonText" ? (
                  <input
                    type="text"
                    value={cta.buttonText || ""}
                    onChange={(e) => updateField("buttonText", e.target.value)}
                    onBlur={() => setEditMode(null)}
                    autoFocus
                    className="px-6 py-3 text-base font-semibold text-center rounded-2xl border-2 border-white bg-white/10 text-white placeholder-white/50 backdrop-blur-sm"
                  />
                ) : (
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => setEditMode("buttonText")}
                    className="group shadow-2xl hover:shadow-green-500/50 transition-all duration-300 text-base px-6 py-3"
                  >
                    <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    {cta.buttonText}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                )}
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-6 text-green-100/80 text-sm"
              >
                {cta.trustIndicators && cta.trustIndicators.length > 0 ? (
                  cta.trustIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      {editMode === `indicator-${index}` ? (
                        <input
                          type="text"
                          value={indicator}
                          onChange={(e) => {
                            const newIndicators = [...cta.trustIndicators];
                            newIndicators[index] = e.target.value;
                            setCta({ ...cta, trustIndicators: newIndicators });
                          }}
                          onBlur={() => setEditMode(null)}
                          autoFocus
                          className="px-2 py-1 text-sm text-center rounded border-2 border-white bg-white/10 text-white placeholder-white/50 backdrop-blur-sm"
                        />
                      ) : (
                        <span
                          onClick={() => setEditMode(`indicator-${index}`)}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          {indicator}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span>Expert Stylists</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span>Premium Products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span>Flexible Scheduling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span>Premium Styling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span>Expert Care</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span>Personalized Service</span>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Editor Fields */}
        <Card className="mt-3 p-2">
          <h3 className="text-base font-semibold mb-3 text-dark-900 dark:text-white">
            Quick Edit Fields
          </h3>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={cta.badge || ""}
                onChange={(e) => updateField("badge", e.target.value)}
                placeholder="Badge Text (e.g., Book Now & Get Started)"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
              />
            </div>

            <div>
              <input
                type="text"
                value={cta.title || ""}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Title"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
              />
            </div>

            <div>
              <textarea
                value={cta.description || ""}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Description"
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={cta.buttonText || ""}
                  onChange={(e) => updateField("buttonText", e.target.value)}
                  placeholder="Button Text"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                />
              </div>

              <div>
                <input
                  type="url"
                  value={cta.buttonHref || ""}
                  onChange={(e) => updateField("buttonHref", e.target.value)}
                  placeholder="Button Link (e.g., /book or https://...)"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 text-dark-900 dark:text-white">
                Trust Indicators (one per line)
              </h4>
              <textarea
                value={cta.trustIndicators?.join("\n") || ""}
                onChange={(e) => {
                  const indicators = e.target.value
                    .split("\n")
                    .filter((item) => item.trim() !== "");
                  setCta({ ...cta, trustIndicators: indicators });
                }}
                placeholder="Expert Stylists&#10;Premium Products&#10;Flexible Scheduling"
                rows={6}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white resize-none font-mono"
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
