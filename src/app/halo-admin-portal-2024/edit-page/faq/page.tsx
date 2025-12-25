"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Trash2, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-hot-toast";

interface Faq {
  question: string;
  answer: string;
}

export default function FaqEditorPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch("/api/faq");
      const data = await response.json();

      if (data.faqs && data.faqs.length > 0) {
        setFaqs(data.faqs);
      } else {
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
        body: JSON.stringify({ faqs }),
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
    setFaqs([
      ...faqs,
      {
        question: "New Question",
        answer: "Answer to the question...",
      },
    ]);
  };

  const deleteFaq = (index: number) => {
    if (faqs.length > 1) {
      setFaqs(faqs.filter((_, i) => i !== index));
      toast.success("FAQ deleted");
    } else {
      toast.error("Must have at least one FAQ");
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
        {/* FAQ Section Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <span className="inline-block px-6 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-semibold text-sm">
              Got Questions?
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
          >
            Everything you need to know about our services and booking process
          </motion.p>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-2 mb-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Edit FAQ
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Click to edit
            </p>
          </div>
          <div className="flex gap-1.5 w-full">
            <Button
              onClick={addFaq}
              className="flex-1 gap-1.5 text-xs py-1.5 px-2"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 gap-1.5 text-xs py-1.5 px-2 bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* FAQs List */}
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white dark:bg-dark-800 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-dark-700 hover:border-green-300 dark:hover:border-green-500 transition-all duration-300 hover:shadow-xl">
                {/* Delete Button - Positioned Absolute */}
                <button
                  onClick={() => deleteFaq(index)}
                  className="absolute top-4 right-14 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg hover:bg-red-600 hover:scale-110 transform duration-200"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

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
                    className={`w-6 h-6 flex-shrink-0 ml-4 transition-all duration-300 ${
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

        {/* Contact Us Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-base md:text-lg">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Contact Us
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
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
