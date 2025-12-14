"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, User, Mail, Lock, Phone, Key } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import toast from "react-hot-toast";

export default function AdminSetupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    secretKey: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyInitialized, setAlreadyInitialized] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if admin already exists on component mount
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const response = await fetch("/api/auth/admin-setup", {
          method: "GET",
        });
        const data = await response.json();
        if (data.adminExists) {
          setAlreadyInitialized(true);
        }
      } catch (error) {
        console.error("Failed to check admin status:", error);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkAdminExists();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!formData.secretKey) {
      toast.error("Secret key is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/admin-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          secretKey: formData.secretKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create admin account");
      }

      toast.success(
        "Admin account created successfully! Redirecting to sign in..."
      );
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to create admin account");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-dark-600 dark:text-dark-400">
            Checking setup status...
          </p>
        </div>
      </div>
    );
  }

  if (alreadyInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold mb-2 text-dark-800 dark:text-dark-200">
            Already Initialized
          </h1>
          <p className="text-dark-600 dark:text-dark-400 mb-8">
            The admin account has already been set up. Please sign in to access
            the admin portal.
          </p>
          <Button
            onClick={() => router.push("/auth/signin")}
            size="lg"
            className="w-full"
          >
            Go to Sign In
          </Button>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Additional admin accounts can be created
              from within the admin portal by existing administrators.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600 mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Initialize Admin Account
          </h1>
          <p className="text-dark-600 dark:text-dark-400">
            Create the first administrator account to get started
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Secret Key Field - Most Important */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-primary-600">
                Secret Key *
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-600" />
                <Input
                  type="password"
                  name="secretKey"
                  value={formData.secretKey}
                  onChange={handleChange}
                  placeholder="Enter admin setup secret key"
                  required
                  className="pl-10 border-2 border-primary-200 focus:border-primary-500"
                />
              </div>
              <p className="text-xs text-dark-500 mt-1">
                Contact your system administrator for the secret key
              </p>
            </div>

            <div className="border-t border-dark-200 dark:border-dark-700 pt-6">
              <h3 className="text-sm font-semibold mb-4 text-dark-700 dark:text-dark-300">
                Account Details
              </h3>

              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              <Shield className="w-5 h-5 mr-2" />
              Create Admin Account
            </Button>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-dark-600 dark:text-dark-400">
                Already have an account?{" "}
                <a
                  href="/auth/signin"
                  className="font-semibold text-primary-600 hover:text-primary-700"
                >
                  Sign In
                </a>
              </p>
            </div>
          </form>
        </Card>

        {/* Security Notice */}
        <motion.div
          className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Security Notice:</strong> This page is for initializing the
            first admin account only. After setup, this page will be disabled
            and additional admins must be created through the admin portal.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
