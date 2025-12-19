"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Clock, DollarSign, Sparkles, Star } from "lucide-react";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Image from "next/image";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  categories: string[];
  image?: string;
  isActive?: boolean;
}

interface ServiceCategory {
  id: string;
  value: string;
  label: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/service-categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      // Filter to show only active services to visitors
      const activeServices = Array.isArray(data)
        ? data.filter((service: Service) => service.isActive !== false)
        : (data.services || []).filter(
            (service: Service) => service.isActive !== false
          );
      setServices(activeServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter(
          (s) => s.categories && s.categories.includes(selectedCategory)
        );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen py-20 bg-white dark:bg-dark-900">
      {/* Hero Section with Sliding Background */}
      <div className="relative mb-16 overflow-hidden">
        {/* Sliding Background Images */}
        <div className="absolute inset-0 w-full h-full">
          <motion.div
            className="flex h-full"
            animate={{
              x: [0, -500],
            }}
            transition={{
              x: {
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              },
            }}
          >
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex h-full shrink-0">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={`${setIndex}-${i}`}
                    className="w-screen h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))`,
                    }}
                  >
                    <Scissors className="w-32 h-32 text-white/20" />
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-12 h-12 text-white mx-auto" />
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 text-white">
              Our Services
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
            >
              Professional hair care services tailored to your unique style
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {/* All Services Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selectedCategory === "All" ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("All")}
              className={`
                group relative overflow-hidden transition-all duration-300
                ${
                  selectedCategory === "All"
                    ? "shadow-lg shadow-primary-500/50"
                    : "hover:shadow-md"
                }
              `}
            >
              <span className="relative z-10">All Services</span>
            </Button>
          </motion.div>

          {/* Dynamic Category Buttons */}
          {categories.map((category, index) => (
            <motion.div
              key={category.value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * (index + 1) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={
                  selectedCategory === category.value ? "primary" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={`
                  group relative overflow-hidden transition-all duration-300
                  ${
                    selectedCategory === category.value
                      ? "shadow-lg shadow-primary-500/50"
                      : "hover:shadow-md"
                  }
                `}
              >
                <span className="relative z-10">{category.label}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card
                  key={i}
                  className="h-80 animate-pulse bg-gradient-to-br from-dark-100 to-dark-200 dark:from-dark-800 dark:to-dark-900"
                >
                  <div />
                </Card>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={selectedCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredServices.map((service, idx) => (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className="h-full flex flex-col relative overflow-hidden border-2 border-transparent hover:border-primary-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/20">
                    {/* Animated gradient background on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-600/0 to-primary-700/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />

                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{
                        x: "100%",
                        transition: {
                          duration: 1,
                          ease: "easeInOut",
                        },
                      }}
                    />

                    <div className="relative z-10 flex-1 p-6">
                      {/* Header with icon */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <motion.h3
                            className="text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors duration-300"
                            whileHover={{ scale: 1.02 }}
                          >
                            {service.name}
                          </motion.h3>

                          <div className="flex flex-wrap gap-2">
                            {service.categories &&
                              service.categories.map((cat) => {
                                const catData = categories.find(
                                  (c) => c.value === cat
                                );
                                return (
                                  <motion.span
                                    key={cat}
                                    className="inline-block px-3 py-1 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-400 text-xs font-semibold rounded-full shadow-sm"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {catData?.label || cat}
                                  </motion.span>
                                );
                              })}
                          </div>
                        </div>

                        <motion.div
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Scissors className="w-6 h-6 text-white" />
                        </motion.div>
                      </div>

                      <p className="text-dark-600 dark:text-dark-400 mb-6 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Service details */}
                      <div className="space-y-4 mb-6">
                        <motion.div
                          className="flex items-center justify-between p-3 rounded-lg bg-dark-50 dark:bg-dark-800/50 group-hover:bg-primary-50/50 dark:group-hover:bg-primary-900/10 transition-colors duration-300"
                          whileHover={{ x: 5 }}
                        >
                          <span className="flex items-center text-dark-700 dark:text-dark-300 font-medium">
                            <Clock className="w-5 h-5 mr-3 text-primary-600" />
                            Duration
                          </span>
                          <span className="font-bold text-dark-900 dark:text-white">
                            {service.duration} min
                          </span>
                        </motion.div>

                        <motion.div
                          className="flex items-center justify-between p-3 rounded-lg bg-dark-50 dark:bg-dark-800/50 group-hover:bg-primary-50/50 dark:group-hover:bg-primary-900/10 transition-colors duration-300"
                          whileHover={{ x: 5 }}
                        >
                          <span className="flex items-center text-dark-700 dark:text-dark-300 font-medium">
                            <DollarSign className="w-5 h-5 mr-3 text-primary-600" />
                            Price
                          </span>
                          <motion.span
                            className="font-bold text-2xl bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
                            whileHover={{ scale: 1.1 }}
                          >
                            ${service.price.toFixed(2)}
                          </motion.span>
                        </motion.div>
                      </div>

                      {/* Book button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full relative overflow-hidden group/btn shadow-lg hover:shadow-xl transition-shadow duration-300"
                          onClick={() => (window.location.href = "/book")}
                        >
                          <span className="relative z-10">Book Now</span>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                            initial={false}
                          />
                        </Button>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No services found message */}
        {!isLoading && filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Scissors className="w-16 h-16 mx-auto mb-4 text-dark-400" />
            <p className="text-xl text-dark-600 dark:text-dark-400">
              No services found in this category
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
