"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, DollarSign, Package, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

const categories = [
  { value: "All", label: "All Products" },
  { value: "HAIR_CARE", label: "Hair Care" },
  { value: "STYLING", label: "Styling" },
  { value: "TREATMENT", label: "Treatment" },
  { value: "ACCESSORIES", label: "Accessories" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      // API already filters for active products only
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

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
    <div className="min-h-screen py-20 bg-gradient-to-br from-primary-50/30 via-white to-primary-50/20 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <ShoppingBag className="w-12 h-12 text-primary-600 mx-auto" />
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold mb-6 relative">
            <motion.span
              className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              Our Products
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-dark-600 dark:text-dark-400 max-w-2xl mx-auto leading-relaxed"
          >
            Premium hair care products for professional results at home
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
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

        {/* Products Grid */}
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
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
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
                      {/* Product Image Placeholder */}
                      <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingBag className="w-16 h-16 text-primary-600/50" />
                        </div>
                      </div>

                      {/* Header with badge */}
                      <div className="mb-4">
                        <motion.h3
                          className="text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors duration-300"
                          whileHover={{ scale: 1.02 }}
                        >
                          {product.name}
                        </motion.h3>

                        <motion.span
                          className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-400 text-xs font-semibold rounded-full shadow-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          {product.category.charAt(0) +
                            product.category
                              .slice(1)
                              .toLowerCase()
                              .replace(/_/g, " ")}
                        </motion.span>
                      </div>

                      <p className="text-dark-600 dark:text-dark-400 mb-6 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Product details */}
                      <div className="space-y-4 mb-6">
                        <motion.div
                          className="flex items-center justify-between p-3 rounded-lg bg-dark-50 dark:bg-dark-800/50 group-hover:bg-primary-50/50 dark:group-hover:bg-primary-900/10 transition-colors duration-300"
                          whileHover={{ x: 5 }}
                        >
                          <span className="flex items-center text-dark-700 dark:text-dark-300 font-medium">
                            <Package className="w-5 h-5 mr-3 text-primary-600" />
                            Stock
                          </span>
                          <span className="font-bold text-dark-900 dark:text-white">
                            {product.stock} units
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
                            ${product.price.toFixed(2)}
                          </motion.span>
                        </motion.div>
                      </div>

                      {/* Contact button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full relative overflow-hidden group/btn shadow-lg hover:shadow-xl transition-shadow duration-300"
                          onClick={() => (window.location.href = "/contact")}
                        >
                          <span className="relative z-10">Contact Us</span>
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

        {/* No products found message */}
        {!isLoading && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-dark-400" />
            <p className="text-xl text-dark-600 dark:text-dark-400">
              No products found in this category
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
