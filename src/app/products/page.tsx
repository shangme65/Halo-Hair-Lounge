"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, ChevronDown, ChevronRight, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Image from "next/image";
import ImageLightbox from "@/components/ui/ImageLightbox";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  categories: string[];
  brand: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
}

interface CategoryInfo {
  value: string;
  label: string;
  productCount: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxTitle, setLightboxTitle] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/product-categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories");
    }
  };

  const toggleCategory = (categoryValue: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryValue)
        ? prev.filter((c) => c !== categoryValue)
        : [...prev, categoryValue]
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group products by category - products appear in all their categories
  // Handle backward compatibility: check both categories array and legacy category string
  const productsByCategory = Array.isArray(categories)
    ? categories.reduce((acc, category) => {
        acc[category.value] = filteredProducts.filter((product) => {
          // Support both new array format and legacy single category
          const productCategories =
            product.categories ||
            ((product as any).category ? [(product as any).category] : []);
          return productCategories.includes(category.value);
        });
        return acc;
      }, {} as Record<string, Product[]>)
    : {};

  // Function to open lightbox
  const openLightbox = (product: Product, imageIndex: number = 0) => {
    if (product.images && product.images.length > 0) {
      setLightboxImages(product.images);
      setLightboxTitle(product.name);
      setLightboxIndex(imageIndex);
      setLightboxOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <div className="pt-20 px-3 pb-4 sm:pt-24 sm:px-4 container mx-auto max-w-7xl">
        {!mounted ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-dark-900 dark:text-white leading-tight">
                Our Products
              </h1>
              <p className="text-xs text-dark-600 dark:text-dark-400">
                Premium hair care products for professional results
              </p>
            </div>

            {/* Search */}
            <Card className="p-2 mb-2">
              <div className="relative">
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-dark-400"
                  size={12}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2 py-1.5 text-xs bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </Card>

            {/* Products by Category */}
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(categories) &&
                  categories.map((category) => {
                    const categoryProducts =
                      productsByCategory[category.value] || [];
                    const isExpanded = expandedCategories.includes(
                      category.value
                    );

                    if (categoryProducts.length === 0) return null;

                    return (
                      <Card
                        key={category.value}
                        className="overflow-hidden !p-0"
                      >
                        {/* Category Header */}
                        <div
                          className="flex items-center justify-between py-2 px-3 bg-primary-50 dark:bg-primary-900/20 border-b border-dark-200 dark:border-dark-700 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                          onClick={() => toggleCategory(category.value)}
                        >
                          <div className="flex items-center gap-2">
                            <button className="p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
                              {isExpanded ? (
                                <ChevronDown
                                  size={20}
                                  className="text-primary-700 dark:text-primary-300"
                                />
                              ) : (
                                <ChevronRight
                                  size={20}
                                  className="text-primary-700 dark:text-primary-300"
                                />
                              )}
                            </button>
                            <h2 className="text-lg font-bold text-primary-900 dark:text-primary-100">
                              {category.label}
                            </h2>
                            <span className="px-2 py-0.5 text-xs font-medium bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200 rounded-full">
                              {categoryProducts.length}{" "}
                              {categoryProducts.length === 1
                                ? "product"
                                : "products"}
                            </span>
                          </div>
                        </div>

                        {/* Category Products */}
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-2"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {categoryProducts.map((product) => (
                                <div
                                  key={product.id}
                                  className="overflow-hidden border border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 hover:shadow-lg transition-shadow duration-300"
                                >
                                  <div
                                    className="aspect-[4/3] bg-dark-100 dark:bg-dark-800 relative group cursor-pointer"
                                    onClick={() =>
                                      openLightbox(
                                        product,
                                        currentImageIndex[product.id] || 0
                                      )
                                    }
                                  >
                                    {product.images.length > 0 ? (
                                      <>
                                        <Image
                                          src={
                                            product.images[
                                              currentImageIndex[product.id] || 0
                                            ]
                                          }
                                          alt={product.name}
                                          fill
                                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {product.images.length > 1 && (
                                          <>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const current =
                                                  currentImageIndex[
                                                    product.id
                                                  ] || 0;
                                                const newIndex =
                                                  current === 0
                                                    ? product.images.length - 1
                                                    : current - 1;
                                                setCurrentImageIndex({
                                                  ...currentImageIndex,
                                                  [product.id]: newIndex,
                                                });
                                              }}
                                              className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all z-10"
                                            >
                                              <ChevronRight
                                                size={16}
                                                className="rotate-180"
                                              />
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                const current =
                                                  currentImageIndex[
                                                    product.id
                                                  ] || 0;
                                                const newIndex =
                                                  current ===
                                                  product.images.length - 1
                                                    ? 0
                                                    : current + 1;
                                                setCurrentImageIndex({
                                                  ...currentImageIndex,
                                                  [product.id]: newIndex,
                                                });
                                              }}
                                              className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all z-10"
                                            >
                                              <ChevronRight size={16} />
                                            </button>
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                                              {product.images.map((_, idx) => (
                                                <div
                                                  key={idx}
                                                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                                                    idx ===
                                                    (currentImageIndex[
                                                      product.id
                                                    ] || 0)
                                                      ? "bg-white w-4"
                                                      : "bg-white/50"
                                                  }`}
                                                />
                                              ))}
                                            </div>
                                            {/* Photo count badge */}
                                            <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                                              {product.images.length} photos
                                            </div>
                                          </>
                                        )}
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium drop-shadow-lg">
                                            Click to view fullscreen
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex items-center justify-center h-full text-dark-400">
                                        No image
                                      </div>
                                    )}
                                    {product.compareAtPrice &&
                                      product.compareAtPrice >
                                        product.price && (
                                        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                                          -
                                          {Math.round(
                                            ((product.compareAtPrice -
                                              product.price) /
                                              product.compareAtPrice) *
                                              100
                                          )}
                                          %
                                        </div>
                                      )}
                                    {product.isFeatured && (
                                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                        <Star size={12} fill="white" />
                                        Featured
                                      </div>
                                    )}
                                  </div>

                                  <div className="p-2">
                                    <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-1 line-clamp-1">
                                      {product.name}
                                    </h3>
                                    <p className="text-xs text-dark-600 dark:text-dark-400 mb-1.5 line-clamp-2">
                                      {product.description}
                                    </p>

                                    <div className="flex items-center justify-between mb-1.5">
                                      <div className="flex items-center gap-2">
                                        <span className="text-base font-bold text-dark-900 dark:text-white">
                                          ${product.price}
                                        </span>
                                        {product.compareAtPrice && (
                                          <span className="text-xs text-dark-500 line-through">
                                            ${product.compareAtPrice}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-xs text-dark-600 dark:text-dark-400 font-bold">
                                        Stock: {product.stock}
                                      </span>
                                      <div className="flex flex-wrap gap-1">
                                        {(
                                          product.categories ||
                                          ((product as any).category
                                            ? [(product as any).category]
                                            : [])
                                        ).map((cat: string) => (
                                          <span
                                            key={cat}
                                            className="text-[10px] bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium"
                                          >
                                            {categories.find(
                                              (c) => c.value === cat
                                            )?.label || cat}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 mb-1.5">
                                      <div
                                        className={`w-full px-2 py-0.5 rounded text-[10px] font-medium text-center ${
                                          product.isActive
                                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                        }`}
                                      >
                                        {product.isActive
                                          ? "Active"
                                          : "Inactive"}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </Card>
                    );
                  })}

                {filteredProducts.length === 0 &&
                  Array.isArray(categories) &&
                  categories.length > 0 && (
                    <div className="text-center py-12">
                      <p className="text-dark-600 dark:text-dark-400">
                        No products found matching your search
                      </p>
                    </div>
                  )}

                {(!Array.isArray(categories) || categories.length === 0) && (
                  <div className="text-center py-12">
                    <p className="text-dark-600 dark:text-dark-400">
                      No products available
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={lightboxTitle}
      />
    </div>
  );
}
