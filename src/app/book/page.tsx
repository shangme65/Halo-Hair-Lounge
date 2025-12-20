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
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  categories: string[];
  image?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  brand?: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
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

  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    fetchServices();
    fetchProducts();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
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
      !selectedService ||
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService,
          productIds: selectedProducts,
          date: selectedDate,
          startTime: selectedTime,
          notes,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book appointment");
      }

      toast.success(
        "Appointment booked successfully! We'll contact you to confirm."
      );
      // Reset form
      setSelectedService("");
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

  const selectedServiceData = services.find((s) => s.id === selectedService);
  const selectedProductsData = products.filter((p) =>
    selectedProducts.includes(p.id)
  );

  const calculateTotal = () => {
    const servicePrice = selectedServiceData?.price || 0;
    const productsPrice = selectedProductsData.reduce(
      (sum, product) => sum + product.price,
      0
    );
    return servicePrice + productsPrice;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Book Your Appointment
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400">
            Choose your service, date, and time
          </p>
        </motion.div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center">
                <User className="w-5 h-5 mr-2 text-primary-600" />
                Your Information
              </h2>
              <Input
                type="text"
                placeholder="Full Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email Address *"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
              />
              <Input
                type="tel"
                placeholder="Phone Number *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-lg font-semibold mb-4 flex items-center">
                <Scissors className="w-5 h-5 mr-2 text-primary-600" />
                Select Service
              </label>
              {isLoadingServices ? (
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-dark-100 dark:bg-dark-800 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedService === service.id
                          ? "border-primary-600 bg-primary-50 dark:bg-primary-950"
                          : "border-dark-200 dark:border-dark-700 hover:border-primary-400"
                      }`}
                      onClick={() => setSelectedService(service.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {service.name}
                          </h3>
                          <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center text-dark-600 dark:text-dark-400">
                              <Clock className="w-4 h-4 mr-1" />
                              {service.duration} min
                            </span>
                            <span className="font-semibold text-primary-600">
                              ${service.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Selection */}
            <div>
              <label className="block text-lg font-semibold mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-primary-600" />
                Select Products (Optional)
              </label>
              <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
                Add professional products to your appointment for use during or
                after your service
              </p>
              {isLoadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-dark-100 dark:bg-dark-800 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedProducts.includes(product.id)
                          ? "border-primary-600 bg-primary-50 dark:bg-primary-950"
                          : "border-dark-200 dark:border-dark-700 hover:border-primary-400"
                      }`}
                      onClick={() => toggleProductSelection(product.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-dark-200 dark:bg-dark-700 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-dark-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1 truncate">
                            {product.name}
                          </h3>
                          {product.brand && (
                            <p className="text-xs text-dark-500 dark:text-dark-500 mb-1">
                              {product.brand}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-primary-600">
                              ${product.price.toFixed(2)}
                            </span>
                            {selectedProducts.includes(product.id) && (
                              <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded-full">
                                Selected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-lg font-semibold mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-primary-600" />
                Select Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-lg font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-600" />
                  Select Time
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-lg font-semibold mb-4">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-dark-200 dark:border-dark-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 bg-white dark:bg-dark-800 transition-all"
                placeholder="Any special requests or information we should know..."
              />
            </div>

            {/* Summary */}
            {selectedServiceData && (
              <Card className="bg-primary-50 dark:bg-primary-950 border-2 border-primary-200 dark:border-primary-800">
                <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dark-600 dark:text-dark-400">
                      Service:
                    </span>
                    <span className="font-semibold">
                      {selectedServiceData.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-600 dark:text-dark-400">
                      Service Price:
                    </span>
                    <span className="font-semibold">
                      ${selectedServiceData.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-600 dark:text-dark-400">
                      Duration:
                    </span>
                    <span className="font-semibold">
                      {selectedServiceData.duration} minutes
                    </span>
                  </div>
                  {selectedProductsData.length > 0 && (
                    <>
                      <div className="border-t border-primary-200 dark:border-primary-800 pt-2 mt-2">
                        <span className="text-dark-600 dark:text-dark-400 font-medium">
                          Selected Products:
                        </span>
                      </div>
                      {selectedProductsData.map((product) => (
                        <div
                          key={product.id}
                          className="flex justify-between pl-4"
                        >
                          <span className="text-dark-600 dark:text-dark-400 text-xs">
                            {product.name}
                          </span>
                          <span className="font-semibold text-xs">
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
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
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
                  <div className="flex justify-between pt-2 border-t border-primary-200 dark:border-primary-800">
                    <span className="text-dark-600 dark:text-dark-400">
                      Total:
                    </span>
                    <span className="font-bold text-lg text-primary-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={
                !customerName ||
                !customerEmail ||
                !customerPhone ||
                !selectedService ||
                !selectedDate ||
                !selectedTime
              }
            >
              Confirm Booking
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
