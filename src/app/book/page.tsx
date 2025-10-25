"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Scissors } from "lucide-react";
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
  category: string;
  image?: string;
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
  const { data: session } = useSession();
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  useEffect(() => {
    fetchServices();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please sign in to book an appointment");
      router.push("/auth/signin?from=/book");
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService,
          date: selectedDate,
          startTime: selectedTime,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book appointment");
      }

      toast.success("Appointment booked successfully!");
      router.push("/dashboard/appointments");
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);

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
                      Duration:
                    </span>
                    <span className="font-semibold">
                      {selectedServiceData.duration} minutes
                    </span>
                  </div>
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
                      ${selectedServiceData.price.toFixed(2)}
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
              disabled={!selectedService || !selectedDate || !selectedTime}
            >
              {session ? "Confirm Booking" : "Sign In to Book"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
