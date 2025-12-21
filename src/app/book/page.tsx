"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Scissors,
  User,
  ShoppingBag,
  Package,
  Tag,
  X,
  ChevronRight,
  Check,
  Sparkles,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

interface ServiceCategory {
  id: string;
  value: string;
  label: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  brand?: string;
  category: string;
  description?: string;
}

interface ProductCategory {
  value: string;
  label: string;
  count: number;
}

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export default function BookingPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [activeProductCategory, setActiveProductCategory] =
    useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: "Info", icon: User },
    { id: 2, name: "Service", icon: Scissors },
    { id: 3, name: "DateTime", icon: CalendarIcon },
    { id: 4, name: "Confirm", icon: Check },
  ];

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return customerName && customerEmail && customerPhone;
      case 2:
        return selectedCategory;
      case 3:
        return selectedDate && selectedTime;
      case 4:
        return true;
      default:
        return false;
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/service-categories");
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      const productList = data.products || [];
      setProducts(productList);

      // Group products by category
      const categoryMap = new Map<string, number>();
      productList.forEach((product: Product) => {
        const count = categoryMap.get(product.category) || 0;
        categoryMap.set(product.category, count + 1);
      });

      const categories: ProductCategory[] = Array.from(
        categoryMap.entries()
      ).map(([value, count]) => ({
        value,
        label: value.charAt(0) + value.slice(1).toLowerCase(),
        count,
      }));

      setProductCategories(categories);
      setActiveProductCategory("ALL");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const openProductModal = (categoryValue: string) => {
    setActiveProductCategory(categoryValue === "ALL" ? "ALL" : categoryValue);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
  };

  const filteredProducts =
    activeProductCategory === "ALL"
      ? products
      : products.filter((p) => p.category === activeProductCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !selectedCategory ||
      !selectedDate ||
      !selectedTime
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          serviceCategory: selectedCategory,
          productIds: selectedProducts,
          date: selectedDate,
          time: selectedTime,
          notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to book appointment");
      }

      toast.success(
        "Appointment request received! We'll contact you to confirm."
      );
      setSelectedCategory("");
      setSelectedProducts([]);
      setSelectedDate("");
      setSelectedTime("");
      setNotes("");
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory
  );
  const selectedProductsData = products.filter((p) =>
    selectedProducts.includes(p.id)
  );

  const calculateTotal = () => {
    return selectedProductsData.reduce(
      (sum, product) => sum + product.price,
      0
    );
  };

  return (
    <div className="min-h-screen py-6 pt-32 bg-gradient-to-br from-primary-50/30 via-white to-primary-50/20 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-300/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        {/* Header with sparkle effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-primary-600 via-green-600 to-primary-700 bg-clip-text text-transparent">
              Book Your Appointment
            </h1>
            <Sparkles className="w-6 h-6 text-primary-600 animate-pulse" />
          </div>
          <p className="text-base text-dark-600 dark:text-dark-400 font-medium">
            Experience luxury hair care in just a few steps
          </p>
        </motion.div>

        {/* Progress Stepper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 backdrop-blur-xl bg-white/70 dark:bg-dark-800/70 rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-dark-700/50"
        >
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-dark-200 dark:bg-dark-700 -z-10">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-600 to-green-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: `${
                    (steps.filter((s) => isStepComplete(s.id)).length /
                      steps.length) *
                    100
                  }%`,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isComplete = isStepComplete(step.id);
              const isCurrent = step.id === currentStep;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative z-10"
                >
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isComplete
                        ? "bg-gradient-to-br from-primary-600 to-green-600 shadow-lg shadow-primary-500/50"
                        : isCurrent
                        ? "bg-white dark:bg-dark-700 border-2 border-primary-600 shadow-lg"
                        : "bg-dark-100 dark:bg-dark-800 border-2 border-dark-300 dark:border-dark-600"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
                    transition={
                      isCurrent ? { repeat: Infinity, duration: 2 } : {}
                    }
                  >
                    {isComplete ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <StepIcon
                        className={`w-6 h-6 ${
                          isCurrent
                            ? "text-primary-600"
                            : "text-dark-400 dark:text-dark-500"
                        }`}
                      />
                    )}
                  </motion.div>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      isComplete || isCurrent
                        ? "text-primary-700 dark:text-primary-400"
                        : "text-dark-500 dark:text-dark-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-800/80 border border-white/20 dark:border-dark-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-green-600 flex items-center justify-center shadow-lg shadow-primary-500/50">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-dark-900 dark:text-white">
                    Your Information
                  </h2>
                  <p className="text-sm text-dark-500 dark:text-dark-400">
                    Tell us about yourself
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                  <Input
                    type="text"
                    placeholder="Full Name *"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (e.target.value && customerEmail && customerPhone)
                        setCurrentStep(2);
                    }}
                    required
                    className="h-12 text-base pl-4 bg-white/50 dark:bg-dark-900/50 border-2 border-dark-200 dark:border-dark-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 rounded-xl transition-all"
                  />
                </motion.div>
                <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                  <Input
                    type="email"
                    placeholder="Email Address *"
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (customerName && e.target.value && customerPhone)
                        setCurrentStep(2);
                    }}
                    required
                    className="h-12 text-base pl-4 bg-white/50 dark:bg-dark-900/50 border-2 border-dark-200 dark:border-dark-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 rounded-xl transition-all"
                  />
                </motion.div>
                <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                  <Input
                    type="tel"
                    placeholder="Phone Number *"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (customerName && customerEmail && e.target.value)
                        setCurrentStep(2);
                    }}
                    required
                    className="h-12 text-base pl-4 bg-white/50 dark:bg-dark-900/50 border-2 border-dark-200 dark:border-dark-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 rounded-xl transition-all"
                  />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Service Category Selection Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 backdrop-blur-xl bg-white/80 dark:bg-dark-800/80 border border-white/20 dark:border-dark-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-primary-600 flex items-center justify-center shadow-lg shadow-green-500/50">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-dark-900 dark:text-white">
                    Select Service
                  </h2>
                  <p className="text-sm text-dark-500 dark:text-dark-400">
                    Choose your desired service
                  </p>
                </div>
              </div>
              {isLoadingCategories ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-gradient-to-br from-dark-100 to-dark-200 dark:from-dark-800 dark:to-dark-700 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((category, idx) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.05 }}
                      className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${
                        selectedCategory === category.id
                          ? "bg-gradient-to-br from-primary-600 to-green-600 shadow-lg shadow-primary-500/50 scale-105"
                          : "bg-gradient-to-br from-white to-primary-50/50 dark:from-dark-700 dark:to-dark-600 hover:shadow-lg hover:scale-102 border-2 border-dark-200 dark:border-dark-600"
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setCurrentStep(3);
                      }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                      <div className="relative flex items-center gap-3">
                        <Tag
                          className={`w-5 h-5 flex-shrink-0 transition-colors ${
                            selectedCategory === category.id
                              ? "text-white"
                              : "text-primary-600"
                          }`}
                        />
                        <div className="flex-1">
                          <h3
                            className={`font-bold text-sm transition-colors ${
                              selectedCategory === category.id
                                ? "text-white"
                                : "text-dark-900 dark:text-white"
                            }`}
                          >
                            {category.label}
                          </h3>
                        </div>
                        {selectedCategory === category.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Product Selection Card */}
          <Card className="p-3">
            <h2 className="text-sm font-semibold flex items-center mb-2">
              <ShoppingBag className="w-4 h-4 mr-1.5 text-primary-600" />
              Select Products (Optional)
            </h2>
            {isLoadingProducts ? (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-dark-100 dark:bg-dark-800 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {productCategories.map((category) => (
                    <motion.div
                      key={category.value}
                      className="p-3 rounded-lg border-2 border-dark-200 dark:border-dark-700 cursor-pointer transition-all hover:border-primary-400 hover:shadow-md bg-gradient-to-br from-white to-primary-50/30 dark:from-dark-800 dark:to-primary-900/10"
                      onClick={() => openProductModal(category.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-0.5">
                            {category.label}
                          </h3>
                          <p className="text-xs text-dark-600 dark:text-dark-400">
                            {category.count}{" "}
                            {category.count === 1 ? "product" : "products"}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-primary-600" />
                      </div>
                    </motion.div>
                  ))}
                </div>
                {selectedProducts.length > 0 && (
                  <div className="mt-3 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <p className="text-xs font-semibold text-primary-900 dark:text-primary-100 mb-1">
                      Selected Products ({selectedProducts.length}):
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedProductsData.map((product) => (
                        <span
                          key={product.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-100 rounded-full text-xs"
                        >
                          {product.name.length > 15
                            ? product.name.substring(0, 15) + "..."
                            : product.name}
                          <button
                            type="button"
                            onClick={() => toggleProductSelection(product.id)}
                            className="hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Date & Time Card */}
          <Card className="p-3">
            <h2 className="text-sm font-semibold flex items-center mb-2">
              <CalendarIcon className="w-4 h-4 mr-1.5 text-primary-600" />
              Select Date
            </h2>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
              className="text-sm h-9 mb-3"
            />

            {selectedDate && (
              <>
                <h2 className="text-sm font-semibold flex items-center mb-2">
                  <Clock className="w-4 h-4 mr-1.5 text-primary-600" />
                  Select Time
                </h2>
                <div className="grid grid-cols-4 gap-1.5">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="text-xs h-8"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* Additional Notes Card */}
          <Card className="p-3">
            <h2 className="text-sm font-semibold mb-2">
              Additional Notes (Optional)
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-dark-200 dark:border-dark-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-white dark:bg-dark-800 transition-all"
              placeholder="Any special requests..."
            />
          </Card>

          {/* Summary Card */}
          {selectedCategoryData && (
            <Card className="p-3 bg-primary-50 dark:bg-primary-950 border-2 border-primary-200 dark:border-primary-800">
              <h3 className="font-semibold text-sm mb-2">Booking Summary</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-dark-600 dark:text-dark-400">
                    Service:
                  </span>
                  <span className="font-semibold">
                    {selectedCategoryData.label}
                  </span>
                </div>
                {selectedProductsData.length > 0 && (
                  <>
                    <div className="border-t border-primary-200 dark:border-primary-800 pt-1.5 mt-1.5">
                      <span className="text-dark-600 dark:text-dark-400 font-medium">
                        Products:
                      </span>
                    </div>
                    {selectedProductsData.map((product) => (
                      <div
                        key={product.id}
                        className="flex justify-between pl-2"
                      >
                        <span className="text-dark-600 dark:text-dark-400 truncate pr-2">
                          {product.name}
                        </span>
                        <span className="font-semibold flex-shrink-0">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </>
                )}
                {selectedDate && (
                  <div className="flex justify-between">
                    <span className="text-dark-600 dark:text-dark-400">
                      Date:
                    </span>
                    <span className="font-semibold">
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex justify-between">
                    <span className="text-dark-600 dark:text-dark-400">
                      Time:
                    </span>
                    <span className="font-semibold">{selectedTime}</span>
                  </div>
                )}
                {selectedProductsData.length > 0 && (
                  <div className="flex justify-between pt-1.5 border-t border-primary-200 dark:border-primary-800">
                    <span className="text-dark-600 dark:text-dark-400">
                      Products Total:
                    </span>
                    <span className="font-bold text-sm text-primary-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full text-sm h-10"
            isLoading={isLoading}
            disabled={
              !customerName ||
              !customerEmail ||
              !customerPhone ||
              !selectedCategory ||
              !selectedDate ||
              !selectedTime
            }
          >
            Confirm Booking
          </Button>
        </form>
      </div>

      {/* Full-Screen Product Modal */}
      {showProductModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white dark:bg-dark-900 overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-dark-900 border-b border-dark-200 dark:border-dark-700 shadow-sm">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                  Select Products
                </h2>
                <button
                  onClick={closeProductModal}
                  className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                <button
                  onClick={() => setActiveProductCategory("ALL")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                    activeProductCategory === "ALL"
                      ? "bg-primary-600 text-white shadow-md"
                      : "bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700"
                  }`}
                >
                  View All
                  <span className="ml-1.5 text-xs opacity-75">
                    ({products.length})
                  </span>
                </button>
                {productCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setActiveProductCategory(category.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                      activeProductCategory === category.value
                        ? "bg-primary-600 text-white shadow-md"
                        : "bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700"
                    }`}
                  >
                    {category.label}
                    <span className="ml-1.5 text-xs opacity-75">
                      ({category.count})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="container mx-auto px-4 py-6">
            {/* Selected Products Summary */}
            {selectedProducts.length > 0 && (
              <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-primary-900 dark:text-primary-100">
                    Selected Products ({selectedProducts.length})
                  </h3>
                  <span className="font-bold text-lg text-primary-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProductsData.map((product) => (
                    <span
                      key={product.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-dark-800 rounded-lg text-sm border border-primary-200 dark:border-primary-700"
                    >
                      {product.name}
                      <span className="text-primary-600 font-semibold">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => toggleProductSelection(product.id)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const isSelected = selectedProducts.includes(product.id);

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative rounded-lg border-2 cursor-pointer transition-all overflow-hidden ${
                      isSelected
                        ? "border-primary-600 shadow-lg"
                        : "border-dark-200 dark:border-dark-700 hover:border-primary-400 hover:shadow-md"
                    }`}
                    onClick={() => toggleProductSelection(product.id)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                        ✓ Selected
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="aspect-square bg-dark-100 dark:bg-dark-800 relative">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-dark-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-base mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      {product.brand && (
                        <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">
                          {product.brand}
                        </p>
                      )}
                      {product.description && (
                        <p className="text-xs text-dark-500 dark:text-dark-500 mb-2 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProductSelection(product.id);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            isSelected
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-primary-600 text-white hover:bg-primary-700"
                          }`}
                        >
                          {isSelected ? "Remove" : "Add"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-dark-400 mx-auto mb-4" />
                <p className="text-dark-600 dark:text-dark-400">
                  No products available in this category
                </p>
              </div>
            )}
          </div>

          {/* Sticky Bottom Action */}
          {selectedProducts.length > 0 && (
            <div className="sticky bottom-0 bg-white dark:bg-dark-900 border-t border-dark-200 dark:border-dark-700 shadow-lg">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark-600 dark:text-dark-400">
                      {selectedProducts.length} product
                      {selectedProducts.length !== 1 ? "s" : ""} selected
                    </p>
                    <p className="text-2xl font-bold text-primary-600">
                      ${calculateTotal().toFixed(2)}
                    </p>
                  </div>
                  <Button onClick={closeProductModal} className="px-6 py-3">
                    Done
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
