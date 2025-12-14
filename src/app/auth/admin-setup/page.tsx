"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Trash2, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import toast from "react-hot-toast";

export default function AdminSetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyInitialized, setAlreadyInitialized] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = useSession();

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

  const handleDeleteAccount = async () => {
    if (!session) {
      toast.error("Please sign in first to delete your account");
      router.push("/auth/signin");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/halo-admin-api/account/delete-self", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      toast.success("Account deleted successfully. Logging out...");

      // Clear cache
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // Sign out and redirect
      await signOut({ redirect: false });
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete account");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleInitializeAdmin = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/admin-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
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
      <>
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
              The admin account has already been set up. Please sign in to
              access the admin portal.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/auth/signin")}
                size="lg"
                className="w-full"
              >
                Go to Sign In
              </Button>
              {session && session.user.role === "ADMIN" && (
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  size="lg"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete My Admin Account
                </Button>
              )}
            </div>
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Additional admin accounts can be created
                from within the admin portal by existing administrators.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Delete Account Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => !isDeleting && setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-dark-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                <h2 className="text-2xl font-bold text-dark-900 dark:text-white text-center mb-2">
                  Delete Your Account?
                </h2>

                <p className="text-dark-600 dark:text-dark-400 text-center mb-6">
                  This action is permanent and cannot be undone. Your account
                  will be immediately deleted, cache cleared, and you will be
                  logged out.
                </p>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Warning:</strong> After deletion, you can create a
                    new admin account using this page with the secret key.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDeleteModal(false)}
                    variant="secondary"
                    className="flex-1"
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    isLoading={isDeleting}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
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
          <div className="space-y-6 text-center">
            <div className="py-8">
              <h2 className="text-xl font-semibold mb-4 text-dark-800 dark:text-dark-200">
                Initialize Administrator Account
              </h2>
              <p className="text-dark-600 dark:text-dark-400 mb-6">
                Click the button below to automatically create an admin account
                using credentials from the environment configuration.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 text-left">
                <h3 className="text-sm font-semibold mb-2 text-blue-800 dark:text-blue-200">
                  Admin Credentials (from .env):
                </h3>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>
                    • Email:{" "}
                    {process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
                      "Configured in server"}
                  </li>
                  <li>• Name: Configured in environment</li>
                  <li>• Password: Configured in environment</li>
                </ul>
              </div>

              <Button
                onClick={handleInitializeAdmin}
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                <Shield className="w-5 h-5 mr-2" />
                {isLoading ? "Initializing..." : "Initialize Admin Account"}
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-dark-200 dark:border-dark-700">
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
          </div>
        </Card>

        {/* Security Notice */}
        <motion.div
          className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Security Notice:</strong> The admin account will be created
            using credentials configured in your environment variables (.env
            file). After setup, this page will be disabled and additional admins
            must be created through the admin portal.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
