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
      setProducts(data.products || []);
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
    <div className="min-h-screen py-6 bg-gradient-to-br from-primary-50/30 via-white to-primary-50/20 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Book Your Appointment
          </h1>
          <p className="text-sm text-dark-600 dark:text-dark-400">
            Choose your service, date, and time
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Customer Information Card */}
          <Card className="p-3">
            <h2 className="text-sm font-semibold flex items-center mb-2">
              <User className="w-4 h-4 mr-1.5 text-primary-600" />
              Your Information
            </h2>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Full Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="text-sm h-9"
              />
              <Input
                type="email"
                placeholder="Email Address *"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                className="text-sm h-9"
              />
              <Input
                type="tel"
                placeholder="Phone Number *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="text-sm h-9"
              />
            </div>
          </Card>

          {/* Service Category Selection Card */}
          <Card className="p-3">
            <h2 className="text-sm font-semibold flex items-center mb-2">
              <Scissors className="w-4 h-4 mr-1.5 text-primary-600" />
              Select Service
            </h2>
            {isLoadingCategories ? (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-dark-100 dark:bg-dark-800 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    className={`p-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCategory === category.id
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-950"
                        : "border-dark-200 dark:border-dark-700 hover:border-primary-400"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-primary-600 flex-shrink-0" />
                      <h3 className="font-semibold text-xs truncate">
                        {category.label}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>

          {/* Product Selection Card */}
          <Card className="p-3">
            <h2 className="text-sm font-semibold flex items-center mb-2">
              <ShoppingBag className="w-4 h-4 mr-1.5 text-primary-600" />
              Select Products (Optional)
            </h2>
            {isLoadingProducts ? (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-dark-100 dark:bg-dark-800 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {products.slice(0, 6).map((product) => (
                  <motion.div
                    key={product.id}
                    className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedProducts.includes(product.id)
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-950"
                        : "border-dark-200 dark:border-dark-700 hover:border-primary-400"
                    }`}
                    onClick={() => toggleProductSelection(product.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-2">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-dark-200 dark:bg-dark-700 rounded-md flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-dark-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs mb-0.5 truncate">
                          {product.name}
                        </h3>
                        {product.brand && (
                          <p className="text-xs text-dark-500 truncate mb-1">
                            {product.brand}
                          </p>
                        )}
                        <span className="font-semibold text-xs text-primary-600">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
                      <div key={product.id} className="flex justify-between pl-2">
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
    </div>
  );
}
