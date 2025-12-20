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
  category: string;
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
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    images: "",
    category: "SHAMPOO",
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
      setExpandedCategories(data.map((cat: CategoryInfo) => cat.value));
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleDeleteCategory = async (
    category: string,
    productCount: number
  ) => {
    if (productCount === 0) {
      toast.error("This category has no products to delete");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete all ${productCount} product(s) in the ${category} category? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `/api/halo-admin-api/product-categories/${category}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete category");

      const data = await res.json();
      toast.success(data.message);
      fetchProducts();
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleAddCategory = () => {
    toast.error(
      "Adding new categories requires updating the database schema. Please contact the developer to add new product categories."
    );
    setShowAddCategoryModal(false);
    setNewCategoryName("");
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
        category: formData.category,
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
    } catch (error) {
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || "",
      images: product.images.join(", "),
      category: product.category,
      brand: product.brand,
      stock: product.stock.toString(),
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      tags: product.tags.join(", "),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/halo-admin-api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      toast.success("Product deleted!");
      fetchProducts();
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
      category: "SHAMPOO",
      brand: "",
      stock: "",
      isActive: true,
      isFeatured: false,
      tags: "",
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    try {
      setUploading(true);

      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("type", "product");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await res.json();

      // Add uploaded image to existing images
      const currentImages = formData.images
        ? formData.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      currentImages.push(data.url);

      setFormData((prev) => ({ ...prev, images: currentImages.join(", ") }));
      setImagePreview(data.url);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group products by category
  const productsByCategory = categories.reduce((acc, category) => {
    acc[category.value] = filteredProducts.filter(
      (product) => product.category === category.value
    );
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      <div className="pt-20 px-3 pb-4 sm:pt-24 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-xl font-bold text-dark-900 dark:text-white mb-0.5">
                Products
              </h1>
              <p className="text-xs text-dark-600 dark:text-dark-400">
                Manage inventory by category
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddCategoryModal(true)}
                variant="outline"
                className="flex items-center gap-1 px-2 py-1.5 text-xs"
              >
                <FolderPlus size={16} />
                Add Category
              </Button>
              <Button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center gap-1 px-2 py-1.5 text-xs"
              >
                <Plus size={16} />
                Add Product
              </Button>
            </div>
          </div>

          {/* Search */}
          <Card className="p-2.5 mb-3">
            <div className="relative">
              <Search
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-dark-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              {categories.map((category) => {
                const categoryProducts =
                  productsByCategory[category.value] || [];
                const isExpanded = expandedCategories.includes(category.value);

                return (
                  <Card key={category.value} className="overflow-hidden">
                    {/* Category Header */}
                    <div
                      className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 border-b border-dark-200 dark:border-dark-700 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                      onClick={() => toggleCategory(category.value)}
                    >
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-primary-200 dark:hover:bg-primary-800 rounded transition-colors">
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
                      {categoryProducts.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(
                              category.value,
                              categoryProducts.length
                            );
                          }}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          <Trash2 size={14} />
                          Delete Category
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
                          className="p-3"
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {categoryProducts.map((product) => (
                                <Card
                                  key={product.id}
                                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                >
                                  <div className="aspect-[4/3] bg-dark-100 dark:bg-dark-800 relative">
                                    {product.images[0] ? (
                                      <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="flex items-center justify-center h-full">
                                        <Upload className="w-12 h-12 text-dark-400" />
                                      </div>
                                    )}
                                    {product.isFeatured && (
                                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                        <Star size={12} fill="white" />
                                        Featured
                                      </div>
                                    )}
                                  </div>

                                  <div className="p-3">
                                    <h3 className="text-sm font-bold text-dark-900 dark:text-white mb-1 line-clamp-1">
                                      {product.name}
                                    </h3>
                                    <p className="text-xs text-dark-600 dark:text-dark-400 mb-2 line-clamp-2">
                                      {product.description}
                                    </p>

                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-base font-bold text-dark-900 dark:text-white">
                                        ${product.price}
                                      </span>
                                      {product.compareAtPrice && (
                                        <span className="text-xs text-dark-500 line-through">
                                          ${product.compareAtPrice}
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-dark-600 dark:text-dark-400 mb-2">
                                      <span>Stock: {product.stock}</span>
                                      <span className="text-[10px] bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium">
                                        {product.category}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 mb-2">
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
                                        onClick={() => handleDelete(product.id)}
                                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                      >
                                        <Trash2 size={12} />
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </Card>
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
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
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

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Adding new product categories requires
                  database schema updates. This feature is currently limited to
                  predefined categories. Please contact your developer to add
                  new categories to the system.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCategory}
                  className="flex-1"
                  disabled={!newCategoryName.trim()}
                >
                  Add Category
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
            className="fixed inset-0 z-50 bg-white dark:bg-dark-900 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-dark-900 z-10 px-4 py-3 border-b border-dark-200 dark:border-dark-700 flex justify-between items-center">
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

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="SHAMPOO">Shampoo</option>
                    <option value="CONDITIONER">Conditioner</option>
                    <option value="STYLING">Styling</option>
                    <option value="TREATMENT">Treatment</option>
                    <option value="TOOLS">Tools</option>
                    <option value="ACCESSORIES">Accessories</option>
                  </select>
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
                    Or Upload Image from Device
                  </label>
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
                            Choose file...
                          </span>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
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

              <div className="sticky bottom-0 bg-white dark:bg-dark-900 border-t border-dark-200 dark:border-dark-700 p-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Check size={20} />
                      {editingProduct ? "Update Product" : "Create Product"}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
