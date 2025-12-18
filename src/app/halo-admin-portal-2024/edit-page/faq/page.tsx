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
              "You can book online through our website or call us directly. We recommend booking in advance to secure your preferred time slot.",
          },
          {
            question: "What services do you offer?",
            answer:
              "We offer a full range of hair services including cuts, coloring, treatments, styling, and extensions. Check our services page for details.",
          },
          {
            question: "What is your cancellation policy?",
            answer:
              "We require at least 24 hours notice for cancellations. Late cancellations may be subject to a fee.",
          },
          {
            question: "Do you offer consultations?",
            answer:
              "Yes! We offer free consultations for all new clients to discuss your hair goals and recommend the best services.",
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
            <Card
              key={index}
              className="p-4 hover:shadow-lg transition-all relative group"
            >
              {/* Delete Button */}
              <button
                onClick={() => deleteFaq(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Trash2 className="w-3 h-3" />
              </button>

              <div className="space-y-3 pr-8">
                {/* Question */}
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Question
                  </label>
                  {editMode === `question-${index}` ? (
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) =>
                        updateFaqField(index, "question", e.target.value)
                      }
                      onBlur={() => setEditMode(null)}
                      autoFocus
                      className="w-full px-2 py-1.5 text-sm font-semibold rounded border border-indigo-500 bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setEditMode(`question-${index}`);
                        setOpenIndex(index === openIndex ? null : index);
                      }}
                      className="w-full text-left flex items-center justify-between gap-2 group/btn"
                    >
                      <h3 className="text-sm font-semibold text-dark-900 dark:text-white group-hover/btn:text-indigo-600 dark:group-hover/btn:text-indigo-400 transition-colors">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Answer
                        </label>
                        {editMode === `answer-${index}` ? (
                          <textarea
                            value={faq.answer}
                            onChange={(e) =>
                              updateFaqField(index, "answer", e.target.value)
                            }
                            onBlur={() => setEditMode(null)}
                            autoFocus
                            rows={4}
                            className="w-full px-2 py-1.5 text-xs rounded border border-indigo-500 bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 resize-none"
                          />
                        ) : (
                          <p
                            onClick={() => setEditMode(`answer-${index}`)}
                            className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
