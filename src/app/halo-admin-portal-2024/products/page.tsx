"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  Check,
  Upload,
  Star,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  categories: string[]; // Array of categories - product appears in all selected
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

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [visibleDeleteButtons, setVisibleDeleteButtons] = useState<string[]>(
    []
  );
  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [enhanceHD, setEnhanceHD] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<{
    value: string;
    label: string;
    count: number;
  } | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [deletionType, setDeletionType] = useState<"remove" | "delete">(
    "remove"
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    images: "",
    categories: [] as string[],
    brand: "",
    stock: "",
    isActive: true,
    isFeatured: false,
    tags: "",
  });

  useEffect(() => {
    if (session && session.user.role !== "ADMIN") {
      router.push("/halo-admin-portal-2024/appointments");
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [session, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/halo-admin-api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/halo-admin-api/product-categories");
      const data = await res.json();
      setCategories(data);
      setExpandedCategories([]);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? [] : [category]
    );
  };

  const handleDeleteCategory = async (
    category: string,
    label: string,
    productCount: number
  ) => {
    setDeletingCategory({ value: category, label, count: productCount });
    setShowDeleteCategoryModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (!deletingCategory) return;

    try {
      const res = await fetch(
        `/api/halo-admin-api/product-categories/${deletingCategory.value}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete category");

      const data = await res.json();
      toast.success(data.message);
      setShowDeleteCategoryModal(false);
      setDeletingCategory(null);
      fetchProducts();
      fetchCategories();

      // Notify other components (like Footer) to update
      localStorage.setItem(
        "productCategoriesLastUpdate",
        Date.now().toString()
      );
      window.dispatchEvent(new Event("productCategoriesUpdated"));
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const res = await fetch("/api/halo-admin-api/product-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create category");
      }

      toast.success("Category created successfully!");
      setShowAddCategoryModal(false);
      setNewCategoryName("");
      fetchCategories();

      // Notify other components (like Footer) to update
      localStorage.setItem(
        "productCategoriesLastUpdate",
        Date.now().toString()
      );
      window.dispatchEvent(new Event("productCategoriesUpdated"));
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    }
  };

  const toggleProductCategory = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((c) => c !== value)
        : [...prev.categories, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingProduct
        ? `/api/halo-admin-api/products/${editingProduct.id}`
        : "/api/halo-admin-api/products";

      const method = editingProduct ? "PUT" : "POST";

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice
          ? parseFloat(formData.compareAtPrice)
          : null,
        images: formData.images
          .split(",")
          .map((img) => img.trim())
          .filter(Boolean),
        categories: formData.categories,
        brand: formData.brand,
        stock: parseInt(formData.stock),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save product");

      toast.success(editingProduct ? "Product updated!" : "Product created!");
      setShowModal(false);
      resetForm();
      fetchProducts();

      // Notify other components (like Footer) to update
      localStorage.setItem(
        "productCategoriesLastUpdate",
        Date.now().toString()
      );
      window.dispatchEvent(new Event("productCategoriesUpdated"));
    } catch (error) {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    // Handle backward compatibility: support both categories array and legacy category string
    const productCategories =
      product.categories ||
      ((product as any).category ? [(product as any).category] : []);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || "",
      images: product.images.join(", "),
      categories: Array.isArray(productCategories)
        ? productCategories
        : [productCategories],
      brand: product.brand,
      stock: product.stock.toString(),
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      tags: product.tags.join(", "),
    });
    setShowModal(true);
  };

  const handleDelete = (product: Product, category?: string) => {
    setDeletingProduct(product);
    setCurrentCategory(category || null);
    setDeletionType(category ? "remove" : "delete");
    setShowDeleteProductModal(true);
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      let url = `/api/halo-admin-api/products/${deletingProduct.id}`;

      // Add category parameter if removing from specific category
      if (deletionType === "remove" && currentCategory) {
        url += `?removeFromCategory=${encodeURIComponent(currentCategory)}`;
      }

      const res = await fetch(url, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      const data = await res.json();
      toast.success(data.message || "Product updated!");
      fetchProducts();
      setShowDeleteProductModal(false);
      setDeletingProduct(null);
      setCurrentCategory(null);
      setDeletionType("remove");

      // Notify other components (like Footer) to update
      localStorage.setItem(
        "productCategoriesLastUpdate",
        Date.now().toString()
      );
      window.dispatchEvent(new Event("productCategoriesUpdated"));
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const toggleStatus = async (
    product: Product,
    field: "isActive" | "isFeatured"
  ) => {
    try {
      const res = await fetch(`/api/halo-admin-api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, [field]: !product[field] }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Updated successfully!");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setImagePreview(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      compareAtPrice: "",
      images: "",
      categories: [],
      brand: "",
      stock: "",
      isActive: true,
      isFeatured: false,
      tags: "",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 10MB)`);
          continue;
        }

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("type", "product");
        formDataUpload.append("enhanceHD", enhanceHD.toString());

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Upload failed");
        }

        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      if (uploadedUrls.length > 0) {
        // Add uploaded images to existing images
        const currentImages = formData.images
          ? formData.images
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
        currentImages.push(...uploadedUrls);

        setFormData((prev) => ({ ...prev, images: currentImages.join(", ") }));
        setImagePreview(uploadedUrls[0]);
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
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

  return (
    <div className="bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      <div className="pt-20 px-3 pb-4 sm:pt-24 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 leading-tight">
                Products
              </h1>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="flex items-center gap-0.5 px-2 py-1 text-[10px] font-medium bg-gradient-to-b from-white to-primary-50 dark:from-dark-700 dark:to-dark-800 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400 rounded-lg hover:from-primary-50 hover:to-primary-100 dark:hover:from-dark-600 dark:hover:to-dark-700 transition-all active:scale-95 shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_2px_rgba(0,0,0,0.1)]"
                  style={{
                    textShadow: "0 1px 1px rgba(255,255,255,0.5)",
                  }}
                >
                  <FolderPlus size={12} />
                  <span className="ml-0.5">Add Category</span>
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="flex items-center gap-0.5 px-2 py-1 text-[10px] font-medium bg-gradient-to-b from-primary-400 to-primary-600 dark:from-primary-600 dark:to-primary-800 text-white rounded-lg hover:from-primary-500 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-700 transition-all active:scale-95 shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2)]"
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  <Plus size={12} />
                  Add Product
                </button>
              </div>
            </div>
            <p className="text-[13px] text-primary-700 dark:text-primary-300 mt-1">
              Manage inventory by category
            </p>
          </div>

          {/* Search */}
          <Card className="p-2 mb-6">
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
            <div className="space-y-4 pb-4">
              {Array.isArray(categories) &&
                categories.map((category) => {
                  const categoryProducts =
                    productsByCategory[category.value] || [];
                  const isExpanded = expandedCategories.includes(
                    category.value
                  );

                  return (
                    <Card key={category.value} className="overflow-hidden !p-0">
                      {/* Category Header */}
                      <div
                        id={`category-${category.value}`}
                        className="flex items-center justify-between py-2 pl-1 pr-0 bg-primary-50 dark:bg-primary-900/20 border-b border-dark-200 dark:border-dark-700 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                        onClick={() => {
                          toggleCategory(category.value);
                          setTimeout(() => {
                            document
                              .getElementById(`category-${category.value}`)
                              ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                          }, 100);
                        }}
                      >
                        <div className="flex items-center">
                          <button className="p-0 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors">
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
                          <h2 className="text-lg font-bold text-primary-900 dark:text-primary-100 -ml-1">
                            {category.label}
                          </h2>
                          <span
                            className="ml-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-b from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 text-primary-900 dark:text-primary-100 rounded-full shadow-md"
                            style={{
                              boxShadow:
                                "0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(0, 0, 0, 0.15)",
                            }}
                          >
                            {categoryProducts.length}{" "}
                            {categoryProducts.length === 1
                              ? "product"
                              : "products"}
                          </span>
                        </div>
                        {!visibleDeleteButtons.includes(category.value) ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setVisibleDeleteButtons([
                                ...visibleDeleteButtons,
                                category.value,
                              ]);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-b from-dark-200 to-dark-300 hover:from-dark-300 hover:to-dark-400 dark:from-dark-700 dark:to-dark-800 dark:hover:from-dark-600 dark:hover:to-dark-700 text-dark-700 dark:text-dark-300 font-medium rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
                            title="Click to reveal delete button"
                            style={{
                              boxShadow:
                                "0 4px 6px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <Trash2 size={14} />?
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(
                                category.value,
                                category.label,
                                categoryProducts.length
                              );
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gradient-to-b from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
                            style={{
                              boxShadow:
                                "0 4px 6px rgba(239, 68, 68, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.2)",
                            }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        )}
                      </div>

                      {/* Category Products */}
                      {isExpanded && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-2"
                          >
                            {categoryProducts.length === 0 ? (
                              <div className="text-center py-8 text-dark-600 dark:text-dark-400">
                                <p className="text-sm">
                                  No products in this category
                                </p>
                                <button
                                  onClick={() => {
                                    resetForm();
                                    setFormData((prev) => ({
                                      ...prev,
                                      category: category.value,
                                    }));
                                    setShowModal(true);
                                  }}
                                  className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:underline"
                                >
                                  Add a product
                                </button>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {categoryProducts.map((product) => (
                                  <div
                                    key={product.id}
                                    className="overflow-hidden border border-dark-200 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-800 hover:shadow-lg transition-shadow duration-300"
                                  >
                                    <div className="aspect-[4/3] bg-dark-100 dark:bg-dark-800 relative group">
                                      {product.images.length > 0 ? (
                                        <>
                                          <Image
                                            src={
                                              product.images[
                                                currentImageIndex[product.id] ||
                                                  0
                                              ]
                                            }
                                            alt={product.name}
                                            fill
                                            className="object-cover"
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
                                                      ? product.images.length -
                                                        1
                                                      : current - 1;
                                                  setCurrentImageIndex({
                                                    ...currentImageIndex,
                                                    [product.id]: newIndex,
                                                  });
                                                }}
                                                className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
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
                                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                                              >
                                                <ChevronRight size={16} />
                                              </button>
                                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                                {product.images.map(
                                                  (_, idx) => (
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
                                                  )
                                                )}
                                              </div>
                                            </>
                                          )}
                                        </>
                                      ) : (
                                        <div className="flex items-center justify-center h-full">
                                          <Upload className="w-12 h-12 text-dark-400" />
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
                                        <button
                                          onClick={() =>
                                            toggleStatus(product, "isActive")
                                          }
                                          className={`flex-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                                            product.isActive
                                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                          }`}
                                        >
                                          {product.isActive
                                            ? "Active"
                                            : "Inactive"}
                                        </button>
                                        <button
                                          onClick={() =>
                                            toggleStatus(product, "isFeatured")
                                          }
                                          className={`flex-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                                            product.isFeatured
                                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                              : "bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400"
                                          }`}
                                        >
                                          <Star
                                            size={10}
                                            className="inline mr-0.5"
                                          />
                                          {product.isFeatured
                                            ? "Featured"
                                            : "Feature"}
                                        </button>
                                      </div>

                                      <div className="flex gap-1.5">
                                        <button
                                          onClick={() => handleEdit(product)}
                                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                                        >
                                          <Edit2 size={12} />
                                          Edit
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDelete(
                                              product,
                                              category.value
                                            )
                                          }
                                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                        >
                                          <Trash2 size={12} />
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </Card>
                  );
                })}

              {filteredProducts.length === 0 && categories.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-dark-600 dark:text-dark-400">
                    No products found matching your search
                  </p>
                </div>
              )}

              {categories.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-dark-600 dark:text-dark-400">
                    No categories available
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowAddCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-900 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-2 mb-4">
                <FolderPlus className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-bold text-dark-900 dark:text-white">
                  Add New Category
                </h3>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Category Name
                </label>
                <Input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Hair Masks"
                />
              </div>

              <div className="flex gap-2 justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    setNewCategoryName("");
                  }}
                  className="py-1 px-8 text-xs h-8 flex items-center justify-center"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCategory}
                  className="py-1 px-8 text-xs h-8 flex items-center justify-center"
                  disabled={!newCategoryName.trim()}
                >
                  Add
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-16 left-0 right-0 bottom-0 z-50 bg-white dark:bg-dark-900 flex flex-col"
          >
            <div className="sticky top-0 bg-white dark:bg-dark-900 z-10 px-4 py-3 border-b border-dark-200 dark:border-dark-700 flex justify-between items-center flex-shrink-0">
              <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-4 pt-6">
                <div className="grid grid-cols-2 gap-4 mb-20">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Product Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Keratin Shampoo"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the product..."
                      rows={3}
                      required
                      className="w-full px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Price ($) *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Compare at Price ($)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.compareAtPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          compareAtPrice: e.target.value,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Stock Quantity *
                    </label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Brand *
                    </label>
                    <Input
                      type="text"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      placeholder="e.g., L'Oreal"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Category * (Select at least one)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => {
                        const isSelected = formData.categories.includes(
                          cat.value
                        );
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => toggleProductCategory(cat.value)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border-2 ${
                              isSelected
                                ? "bg-green-500 text-white border-green-500 shadow-md"
                                : "bg-white dark:bg-dark-800 text-dark-700 dark:text-dark-300 border-dark-300 dark:border-dark-600 hover:border-green-400"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-white border-white"
                                  : "border-dark-400 dark:border-dark-500"
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="w-3 h-3 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {formData.categories.length === 0 && (
                      <p className="mt-2 text-xs text-red-500">
                        Please select at least one category
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Image URLs (comma-separated)
                    </label>
                    <textarea
                      value={formData.images}
                      onChange={(e) =>
                        setFormData({ ...formData, images: e.target.value })
                      }
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      rows={2}
                      className="w-full px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Or Upload Images from Device
                    </label>
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        id="enhanceHDProduct"
                        checked={enhanceHD}
                        onChange={(e) => setEnhanceHD(e.target.checked)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                      />
                      <label
                        htmlFor="enhanceHDProduct"
                        className="text-sm font-medium text-dark-700 dark:text-dark-300"
                      >
                        Enhance image quality (HD)
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer">
                        <div className="w-full px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-300 dark:border-dark-600 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-600 transition-colors text-center">
                          {uploading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">Uploading...</span>
                            </div>
                          ) : (
                            <span className="text-sm text-dark-600 dark:text-dark-400">
                              Choose files...
                            </span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {formData.images && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {formData.images
                          .split(",")
                          .map((img) => img.trim())
                          .filter(Boolean)
                          .map((imgUrl, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={imgUrl}
                                alt={`Product ${idx + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border-2 border-dark-200 dark:border-dark-600"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const images = formData.images
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean);
                                  images.splice(idx, 1);
                                  setFormData({
                                    ...formData,
                                    images: images.join(", "),
                                  });
                                }}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Tags (comma-separated)
                    </label>
                    <Input
                      type="text"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="moisturizing, sulfate-free, organic"
                    />
                  </div>

                  <div className="col-span-2 flex gap-6">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                      />
                      <label
                        htmlFor="isActive"
                        className="text-sm font-medium text-dark-700 dark:text-dark-300"
                      >
                        Product is active
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isFeatured: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                      />
                      <label
                        htmlFor="isFeatured"
                        className="text-sm font-medium text-dark-700 dark:text-dark-300"
                      >
                        Feature this product
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-dark-900 border-t border-dark-200 dark:border-dark-700 p-4 flex gap-6 justify-center shadow-lg">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 text-sm"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Check size={16} />
                      {editingProduct ? "Update Product" : "Create Product"}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Category Confirmation Modal */}
      <AnimatePresence>
        {showDeleteCategoryModal && deletingCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowDeleteCategoryModal(false);
              setDeletingCategory(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-2">
                    Delete Category
                  </h3>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    Are you sure you want to delete the{" "}
                    <span className="font-semibold text-dark-900 dark:text-white">
                      {deletingCategory.label}
                    </span>{" "}
                    category
                    {deletingCategory.count > 0 && (
                      <>
                        {" "}
                        and all{" "}
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          {deletingCategory.count}
                        </span>{" "}
                        product(s) in it
                      </>
                    )}
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteCategoryModal(false);
                    setDeletingCategory(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-dark-700 dark:text-dark-300 bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteCategory}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
                  style={{
                    boxShadow:
                      "0 4px 6px rgba(239, 68, 68, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Delete Category
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Product Confirmation Modal */}
      <AnimatePresence>
        {showDeleteProductModal && deletingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowDeleteProductModal(false);
              setDeletingProduct(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              {/* Icon and Title Row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-dark-900 dark:text-white">
                  {deletingProduct.categories.length > 1
                    ? deletionType === "remove"
                      ? "Remove Product from Category"
                      : "Delete Product"
                    : "Delete Product"}
                </h3>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  {deletingProduct.categories.length > 1 ? (
                    deletionType === "remove" ? (
                      <>
                        Remove{" "}
                        <span className="font-semibold text-dark-900 dark:text-white">
                          {deletingProduct.name}
                        </span>{" "}
                        from the{" "}
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                          {categories.find((c) => c.value === currentCategory)
                            ?.label || currentCategory}
                        </span>{" "}
                        category? The product will remain in other categories.
                      </>
                    ) : (
                      <>
                        Are you sure you want to permanently delete{" "}
                        <span className="font-semibold text-dark-900 dark:text-white">
                          {deletingProduct.name}
                        </span>
                        ? This will remove it from all categories. This action
                        cannot be undone.
                      </>
                    )
                  ) : (
                    <>
                      Are you sure you want to delete{" "}
                      <span className="font-semibold text-dark-900 dark:text-white">
                        {deletingProduct.name}
                      </span>
                      ? This action cannot be undone.
                    </>
                  )}
                </p>
                {deletionType === "remove" &&
                  deletingProduct.categories.length > 1 && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        <strong>Current categories:</strong>{" "}
                        {deletingProduct.categories
                          .map(
                            (cat) =>
                              categories.find((c) => c.value === cat)?.label ||
                              cat
                          )
                          .join(", ")}
                      </p>
                    </div>
                  )}
                {deletingProduct.categories.length > 1 && (
                  <>
                    <div className="mt-3 flex gap-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deletionType"
                          value="remove"
                          checked={deletionType === "remove"}
                          onChange={() => setDeletionType("remove")}
                          className="mr-2"
                        />
                        <span className="text-xs text-dark-600 dark:text-dark-400">
                          Remove from this category only
                        </span>
                      </label>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="deletionType"
                          value="delete"
                          checked={deletionType === "delete"}
                          onChange={() => setDeletionType("delete")}
                          className="mr-2"
                        />
                        <span className="text-xs text-red-600 dark:text-red-400">
                          Delete product completely from all categories
                        </span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Buttons - Full Width */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowDeleteProductModal(false);
                    setDeletingProduct(null);
                    setCurrentCategory(null);
                    setDeletionType("remove");
                  }}
                  className="w-full px-4 py-2.5 text-sm font-medium text-dark-700 dark:text-dark-300 bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteProduct}
                  className={`w-full px-4 py-2.5 text-sm font-medium text-white rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95 ${
                    deletingProduct.categories.length > 1 &&
                    deletionType === "remove"
                      ? "bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                      : "bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  }`}
                  style={{
                    boxShadow:
                      deletingProduct.categories.length > 1 &&
                      deletionType === "remove"
                        ? "0 4px 6px rgba(249, 115, 22, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)"
                        : "0 4px 6px rgba(239, 68, 68, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {deletingProduct.categories.length > 1 &&
                  deletionType === "remove"
                    ? "Remove from Category"
                    : "Delete Product"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
