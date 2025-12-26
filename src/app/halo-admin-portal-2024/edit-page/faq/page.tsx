"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-hot-toast";

interface Faq {
  question: string;
  answer: string;
}

export default function FaqEditorPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    index: number | null;
  }>({ show: false, index: null });
  const [showDeleteButton, setShowDeleteButton] = useState<number | null>(null);
  const [sectionHeader, setSectionHeader] = useState({
    badge: "Got Questions?",
    titlePrefix: "Frequently Asked ",
    titleHighlight: "Questions",
    subtitle:
      "Everything you need to know about our services and booking process",
    ctaText: "Still have questions? We're here to help!",
    ctaButtonText: "Contact Us",
    ctaButtonLink: "/contact",
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    // Close delete button when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking on delete button or trash icon
      if (
        target.closest("[data-delete-button]") ||
        target.closest("[data-delete-icon]")
      ) {
        return;
      }
      if (showDeleteButton !== null) {
        setShowDeleteButton(null);
      }
    };

    if (showDeleteButton !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDeleteButton]);

  const fetchFaqs = async () => {
    try {
      const response = await fetch("/api/faq");
      const data = await response.json();

      if (data.faqs && data.faqs.length > 0) {
        setFaqs(data.faqs);
      }
      if (data.sectionHeader) {
        setSectionHeader(data.sectionHeader);
      }
      if (!data.faqs || data.faqs.length === 0) {
        setFaqs([
          {
            question: "How do I book an appointment?",
            answer:
              "You can easily book an appointment through our online booking system available 24/7. Simply click the 'Book Appointment' button, select your preferred service, choose your stylist, and pick a convenient time slot. You'll receive instant confirmation via email.",
          },
          {
            question: "What services do you offer?",
            answer:
              "We offer a comprehensive range of hair services including haircuts, coloring, styling, scalp treatments, chemical straightening, keratin treatments, and specialized hair loss treatments. Each service is performed by our expert stylists using premium products.",
          },
          {
            question: "What is your cancellation policy?",
            answer:
              "We understand that plans change. You can cancel or reschedule your appointment up to 24 hours before your scheduled time without any charges. Cancellations made less than 24 hours in advance may incur a cancellation fee.",
          },
          {
            question: "Do you use professional-grade products?",
            answer:
              "Yes, we exclusively use premium, professional-grade products from leading brands in the hair care industry. All our products are carefully selected to ensure the best results and maintain the health of your hair.",
          },
          {
            question: "How long does a typical appointment take?",
            answer:
              "The duration varies depending on the service. A basic haircut takes about 45-60 minutes, while color services can take 2-3 hours. Complex treatments like keratin or chemical straightening may take 3-4 hours. We'll provide an estimated time when you book.",
          },
          {
            question: "Do you offer consultations?",
            answer:
              "Absolutely! We offer complimentary consultations for all new clients and for any major style changes. During the consultation, our stylists will discuss your hair goals, assess your hair type, and recommend the best treatments and styles for you.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqs, sectionHeader }),
      });

      if (response.ok) {
        toast.success("FAQs saved successfully!");
        setEditMode(null);
      } else {
        toast.error("Failed to save FAQs");
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving FAQs");
    } finally {
      setSaving(false);
    }
  };

  const updateFaqField = (index: number, field: keyof Faq, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const addFaq = () => {
    const newIndex = faqs.length;
    setFaqs([
      ...faqs,
      {
        question: "New Question",
        answer: "Answer to the question...",
      },
    ]);
    setOpenIndex(newIndex);

    // Scroll to the newly added card after DOM updates
    setTimeout(() => {
      const newCard = cardRefs.current[newIndex];
      if (newCard) {
        newCard.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 300);
  };

  const deleteFaq = (index: number) => {
    if (faqs.length === 1) {
      toast.error("Must have at least one FAQ");
      return;
    }

    setDeleteConfirm({ show: true, index });
  };

  const confirmDeleteFaq = () => {
    if (deleteConfirm.index !== null) {
      const newFaqs = faqs.filter((_, i) => i !== deleteConfirm.index);
      setFaqs(newFaqs);
      setShowDeleteButton(null);
      setDeleteConfirm({ show: false, index: null });

      // Auto-save after deletion
      setTimeout(async () => {
        try {
          const response = await fetch("/api/faq", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ faqs: newFaqs, sectionHeader }),
          });

          if (response.ok) {
            toast.success("FAQ deleted successfully!");
          } else {
            toast.error("Failed to save changes");
          }
        } catch (error) {
          console.error("Error saving:", error);
          toast.error("Error saving changes");
        }
      }, 100);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 pt-16 px-2 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              Edit FAQ
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
                <Save size={12} />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            Click on any text to edit. Changes will be reflected on the
            homepage.
          </p>
        </div>

        {/* FAQ Section Header - Editable */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-semibold mb-3 shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{
                boxShadow:
                  "0 4px 15px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
              }}
            >
              {editMode === "badge" ? (
                <input
                  type="text"
                  value={sectionHeader.badge}
                  onChange={(e) =>
                    setSectionHeader({
                      ...sectionHeader,
                      badge: e.target.value,
                    })
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="text-sm font-semibold text-green-600 dark:text-green-400 bg-transparent border-none outline-none text-center drop-shadow-sm"
                />
              ) : (
                <span
                  onClick={() => setEditMode("badge")}
                  className="cursor-pointer drop-shadow-sm"
                >
                  {sectionHeader.badge}
                </span>
              )}
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2">
              {editMode === "titlePrefix" ? (
                <input
                  type="text"
                  value={sectionHeader.titlePrefix}
                  onChange={(e) =>
                    setSectionHeader({
                      ...sectionHeader,
                      titlePrefix: e.target.value,
                    })
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="inline-block px-3 py-1 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent bg-white dark:bg-dark-700 border-2 border-green-500 rounded-lg focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditMode("titlePrefix")}
                  className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent cursor-pointer"
                >
                  {sectionHeader.titlePrefix}
                </span>
              )}{" "}
              {editMode === "titleHighlight" ? (
                <input
                  type="text"
                  value={sectionHeader.titleHighlight}
                  onChange={(e) =>
                    setSectionHeader({
                      ...sectionHeader,
                      titleHighlight: e.target.value,
                    })
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="inline-block px-3 py-1 text-green-500 dark:text-green-400 bg-white dark:bg-dark-700 border-2 border-green-500 rounded-lg focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditMode("titleHighlight")}
                  className="text-green-500 dark:text-green-400 cursor-pointer"
                >
                  {sectionHeader.titleHighlight}
                </span>
              )}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {editMode === "subtitle" ? (
                <input
                  type="text"
                  value={sectionHeader.subtitle}
                  onChange={(e) =>
                    setSectionHeader({
                      ...sectionHeader,
                      subtitle: e.target.value,
                    })
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="w-full px-3 py-1 text-center text-base text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-700 border-2 border-green-500 rounded-lg focus:outline-none"
                />
              ) : (
                <span
                  onClick={() => setEditMode("subtitle")}
                  className="cursor-pointer"
                >
                  {sectionHeader.subtitle}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* CTA Section - Editable */}
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-lg mb-6">
          <div className="space-y-4">
            <div>
              {editMode === "ctaText" ? (
                <input
                  type="text"
                  value={sectionHeader.ctaText}
                  onChange={(e) =>
                    setSectionHeader({
                      ...sectionHeader,
                      ctaText: e.target.value,
                    })
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-700 border-2 border-green-500 rounded-lg focus:outline-none"
                />
              ) : (
                <p
                  onClick={() => setEditMode("ctaText")}
                  className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-green-600 dark:hover:text-green-400 transition-colors px-4 py-2 border-2 border-gray-300 dark:border-gray-600 hover:border-green-200 dark:hover:border-green-800 rounded-lg"
                >
                  {sectionHeader.ctaText}
                </p>
              )}
            </div>

            <div>
              {editMode === "ctaButtonText" ? (
                <input
                  type="text"
                  value={sectionHeader.ctaButtonText}
                  onChange={(e) =>
                    setSectionHeader({
                      ...sectionHeader,
                      ctaButtonText: e.target.value,
                    })
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="w-full px-4 py-2 bg-white dark:bg-dark-700 border-2 border-green-500 rounded-lg focus:outline-none"
                />
              ) : (
                <div
                  onClick={() => setEditMode("ctaButtonText")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 font-semibold shadow-lg cursor-pointer"
                  style={{
                    boxShadow:
                      "0 4px 20px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {sectionHeader.ctaButtonText}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div>
              {editMode === "ctaButtonLink" ? (
                <input
                  type="url"
                  value={sectionHeader.ctaButtonLink}
                  onChange={(e) =>
                    setSectionHeader({
                      ...sectionHeader,
                      ctaButtonLink: e.target.value,
                    })
                  }
                  onBlur={() => setEditMode(null)}
                  autoFocus
                  className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-dark-700 border-2 border-green-500 rounded-lg focus:outline-none font-mono text-sm"
                  placeholder="e.g., /contact or https://example.com"
                />
              ) : (
                <p
                  onClick={() => setEditMode("ctaButtonLink")}
                  className={`cursor-pointer transition-colors px-4 py-2 border-2 border-gray-300 dark:border-gray-600 hover:border-green-200 dark:hover:border-green-800 rounded-lg font-mono text-sm ${
                    sectionHeader.ctaButtonLink
                      ? "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                      : "text-gray-400 dark:text-gray-500 italic hover:text-green-500 dark:hover:text-green-400"
                  }`}
                >
                  {sectionHeader.ctaButtonLink ||
                    "e.g., /contact or https://example.com"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
              Manage Cards: {faqs.length}
            </h2>
            <Button
              onClick={addFaq}
              className="flex flex-row items-center gap-0.5 py-1 text-xs h-7 bg-gradient-to-r from-primary-600 to-primary-700 !w-auto whitespace-nowrap flex-shrink-0"
            >
              <Plus size={12} />
              Add Card
            </Button>
          </div>
          <p className="text-sm text-dark-600 dark:text-dark-400">
            {faqs.length} {faqs.length !== 1 ? "cards" : "card"} loaded
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-dark-700 hover:border-green-300 dark:hover:border-green-500 transition-all duration-300 hover:shadow-xl">
                {/* Delete Icon Hint & Button - positioned absolutely outside button */}
                {faqs.length > 1 && (
                  <div className="absolute top-4 right-12 z-20 flex flex-col items-center gap-2">
                    {showDeleteButton === index ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFaq(index);
                        }}
                        variant="outline"
                        className="flex items-center gap-0.5 py-1 text-xs h-7 text-red-600 hover:!text-white !w-auto"
                        style={{ color: undefined }}
                        data-delete-button
                      >
                        <Trash2 size={12} />
                        Delete
                      </Button>
                    ) : (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteButton(index);
                        }}
                        className="p-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                        title="Delete FAQ"
                        data-delete-icon
                      >
                        <Trash2 size={16} />
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full px-6 py-3 flex items-start justify-between text-left hover:bg-gradient-to-r hover:from-green-50 dark:hover:from-green-900/20 hover:to-transparent transition-all duration-300"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        openIndex === index
                          ? "bg-green-500 dark:bg-green-600 text-white scale-110"
                          : "bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 group-hover:text-green-600 dark:group-hover:text-green-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    {editMode === `question-${index}` ? (
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) =>
                          updateFaqField(index, "question", e.target.value)
                        }
                        onBlur={() => setEditMode(null)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        className="flex-1 px-3 py-2 font-semibold rounded-lg border-2 border-green-500 bg-white dark:bg-dark-700 text-gray-900 dark:text-white mr-8"
                      />
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditMode(`question-${index}`);
                        }}
                        className={`font-semibold pr-8 transition-colors cursor-pointer ${
                          openIndex === index
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400"
                        }`}
                      >
                        {faq.question}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 flex-shrink-0 transition-all duration-300 ${
                      openIndex === index
                        ? "rotate-180 text-green-500 dark:text-green-400"
                        : "text-gray-400 dark:text-gray-600 group-hover:text-green-500 dark:group-hover:text-green-400"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-3 ml-12"
                      >
                        {editMode === `answer-${index}` ? (
                          <textarea
                            value={faq.answer}
                            onChange={(e) =>
                              updateFaqField(index, "answer", e.target.value)
                            }
                            onBlur={() => setEditMode(null)}
                            autoFocus
                            rows={4}
                            className="w-full px-4 py-3 text-gray-600 dark:text-gray-400 leading-relaxed border-l-4 border-green-400 dark:border-green-500 rounded-r-lg bg-gradient-to-r from-green-50 dark:from-green-900/20 to-transparent resize-none border-2 border-green-500"
                          />
                        ) : (
                          <div
                            onClick={() => setEditMode(`answer-${index}`)}
                            className="text-gray-600 dark:text-gray-400 leading-relaxed border-l-4 border-green-400 dark:border-green-500 pl-4 bg-gradient-to-r from-green-50 dark:from-green-900/20 to-transparent py-2 rounded-r-lg cursor-pointer hover:from-green-100 dark:hover:from-green-900/30 transition-colors"
                          >
                            {faq.answer}
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
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
              Delete FAQ
            </h3>
            <p className="text-dark-600 dark:text-dark-400 mb-6">
              Are you sure you want to delete this FAQ? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setDeleteConfirm({ show: false, index: null })}
                className="flex items-center justify-center px-4 py-1 text-xs h-7"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteFaq}
                className="flex items-center justify-center px-4 py-1 text-xs h-7 bg-red-600 hover:bg-red-700"
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
