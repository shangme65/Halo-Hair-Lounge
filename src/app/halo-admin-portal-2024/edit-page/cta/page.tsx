"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ArrowRight,
  Save,
  CheckCircle2,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import IconSelector, { renderIcon } from "@/components/admin/IconSelector";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CtaContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  trustIndicators: string[];
  leadingIcon?: string;
  trailingIcon?: string;
}

export default function CtaEditorPage() {
  const router = useRouter();
  const [cta, setCta] = useState<CtaContent>({
    badge: "",
    title: "",
    description: "",
    buttonText: "",
    buttonHref: "",
    trustIndicators: [],
    leadingIcon: "Calendar",
    trailingIcon: "ArrowRight",
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
        setCta({
          ...data,
          leadingIcon: data.leadingIcon || "Calendar",
          trailingIcon: data.trailingIcon || "ArrowRight",
        });
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
          leadingIcon: "Calendar",
          trailingIcon: "ArrowRight",
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

  // use IconSelector/renderIcon from shared admin component

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-6 mt-4 px-4 max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            Edit Call-to-Action
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-600 dark:text-green-400">
              Click to edit
            </p>

            <div className="flex items-center gap-1">
              <Button
                onClick={() => router.push("/halo-admin-portal-2024/edit-page")}
                className="flex items-center gap-0.5 py-1 px-1.5 text-xs h-7 transition-shadow duration-500 ease-in-out hover:!shadow-[inset_0_-3px_2px_0_rgba(0,0,0,0.25),inset_2px_0_2px_0_rgba(255,255,255,0.15),inset_-2px_0_2px_0_rgba(0,0,0,0.1),0_4px_0_0_rgba(34,197,94,0.8),0_5px_0_0_rgba(34,197,94,0.6),0_6px_0_0_rgba(34,197,94,0.4),0_10px_12px_-3px_rgba(0,0,0,0.5),0_15px_25px_-5px_rgba(0,0,0,0.3),0_8px_16px_-4px_rgba(34,197,94,0.7)]"
                variant="outline"
              >
                <ArrowLeft size={12} />
                Back
              </Button>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-0.5 py-1 px-1.5 text-xs h-7 bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-2xl hover:shadow-green-500/50 transition-shadow duration-500 ease-in-out"
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
        </div>

        {/* Preview Section - Match homepage CTA exactly */}
        <div className="w-full">
          <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" />
              <div
                className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500 rounded-full blur-3xl animate-pulse-slow"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute top-1/2 left-1/3 w-80 h-80 bg-green-400 rounded-full blur-3xl animate-pulse-slow"
                style={{ animationDelay: "2s" }}
              />
            </div>

            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-12">
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
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
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
                  {editMode === "cta" ? (
                    <div className="flex flex-col gap-3 items-center justify-center">
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={cta.buttonText || ""}
                          onChange={(e) =>
                            updateField("buttonText", e.target.value)
                          }
                          placeholder="Button Text"
                          className="bg-white/10 text-white px-3 py-2 rounded text-sm outline-none border border-white/30"
                        />
                        <input
                          type="url"
                          value={cta.buttonHref || ""}
                          onChange={(e) =>
                            updateField("buttonHref", e.target.value)
                          }
                          placeholder="Link URL"
                          className="bg-white/10 text-white px-3 py-2 rounded text-sm outline-none border border-white/30"
                        />
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="flex gap-1 items-center bg-white/10 px-2 py-1 rounded border border-white/30">
                          <span className="text-white text-xs mr-1">
                            Start:
                          </span>
                          <IconSelector
                            value={cta.leadingIcon || "Calendar"}
                            onChange={(v) => updateField("leadingIcon", v)}
                          />
                        </div>
                        <div className="flex gap-1 items-center bg-white/10 px-2 py-1 rounded border border-white/30">
                          <span className="text-white text-xs mr-1">End:</span>
                          <IconSelector
                            value={cta.trailingIcon || "ArrowRight"}
                            onChange={(v) => updateField("trailingIcon", v)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditMode(null);
                          }}
                          className="bg-green-600 text-white px-2 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={() => setEditMode("cta")}
                      className="group shadow-2xl hover:shadow-green-500/50 transition-shadow duration-500 ease-in-out px-6"
                    >
                      {renderIcon(
                        cta.leadingIcon || "Calendar",
                        "w-5 h-5 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
                      )}
                      {cta.buttonText}
                      {renderIcon(
                        cta.trailingIcon || "ArrowRight",
                        "w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300"
                      )}
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
                              setCta({
                                ...cta,
                                trustIndicators: newIndicators,
                              });
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
          </section>
        </div>

        {/* Editor Fields */}
        <div className="px-4 max-w-4xl mx-auto">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Leading Icon
                  </label>
                  <IconSelector
                    value={cta.leadingIcon || "Calendar"}
                    onChange={(v) => updateField("leadingIcon", v)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Trailing Icon
                  </label>
                  <IconSelector
                    value={cta.trailingIcon || "ArrowRight"}
                    onChange={(v) => updateField("trailingIcon", v)}
                    className="w-full"
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
        </div>
      </motion.div>
    </div>
  );
}
