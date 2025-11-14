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

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
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
      router.push("/admin/appointments");
      return;
    }
    fetchProducts();
  }, [session, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";

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
      const res = await fetch(`/api/admin/products/${id}`, {
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
      const res = await fetch(`/api/admin/products/${product.id}`, {
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <AdminSidebar />

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2">
                Products Management
              </h1>
              <p className="text-dark-600 dark:text-dark-400">
                Manage store inventory and pricing
              </p>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Add Product
            </Button>
          </div>

          {/* Search */}
          <Card className="p-4 mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </Card>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden group">
                  <div className="aspect-square bg-dark-100 dark:bg-dark-800 relative">
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

                  <div className="p-4">
                    <h3 className="font-semibold text-dark-900 dark:text-white mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-dark-600 dark:text-dark-400 mb-2 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-dark-900 dark:text-white">
                        ${product.price}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-dark-500 line-through">
                          ${product.compareAtPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-dark-600 dark:text-dark-400 mb-3">
                      <span>Stock: {product.stock}</span>
                      <span className="text-xs bg-dark-100 dark:bg-dark-700 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => toggleStatus(product, "isActive")}
                        className={`flex-1 px-2 py-1 rounded text-xs font-medium ${
                          product.isActive
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => toggleStatus(product, "isFeatured")}
                        className={`flex-1 px-2 py-1 rounded text-xs font-medium ${
                          product.isFeatured
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                            : "bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400"
                        }`}
                      >
                        <Star size={12} className="inline mr-1" />
                        {product.isFeatured ? "Featured" : "Feature"}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-dark-600 dark:text-dark-400">
                    No products found
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-3xl w-full my-8"
            >
              <div className="p-6 border-b border-dark-200 dark:border-dark-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-dark-900 dark:text-white">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
              >
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

                <div className="flex gap-3 pt-4">
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
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
