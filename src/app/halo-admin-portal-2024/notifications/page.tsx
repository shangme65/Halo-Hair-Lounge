"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Check, Trash2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
    fetchNotifications();
  }, [session, router]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/halo-admin-api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      await fetch("/api/halo-admin-api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const deleteReadNotifications = async () => {
    try {
      await fetch("/api/halo-admin-api/notifications", {
        method: "DELETE",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notifications:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <div className="p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Notifications List */}
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-dark-200 dark:border-dark-700">
            {/* Header inside card */}
            <div className="flex items-center justify-between p-4 border-b border-dark-200 dark:border-dark-700">
              <div>
                <h1 className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                  <Bell
                    size={20}
                    className="text-green-600 dark:text-green-400"
                  />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                      {unreadCount}
                    </span>
                  )}
                </h1>
                <p className="text-xs text-green-500 dark:text-green-400 mt-0.5">
                  Stay updated with your business
                </p>
              </div>

              <div className="flex space-x-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      const unreadIds = notifications
                        .filter((n) => !n.isRead)
                        .map((n) => n.id);
                      markAsRead(unreadIds);
                    }}
                    className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors font-medium flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={deleteReadNotifications}
                  className="text-green-600 hover:text-white hover:bg-green-500 border-green-200 hover:border-green-500 text-xs h-7 transition-all duration-200 flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="ml-1">Clear read</span>
                </Button>
              </div>
            </div>

            {notifications.length > 0 ? (
              <div className="divide-y divide-dark-200 dark:divide-dark-700">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 hover:bg-dark-50 dark:hover:bg-dark-700 cursor-pointer transition-colors ${
                      !notification.isRead
                        ? "bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() => {
                      if (notification.link) {
                        router.push(notification.link);
                      }
                      if (!notification.isRead) {
                        markAsRead([notification.id]);
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 pt-0.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            notification.type === "APPOINTMENT"
                              ? "bg-green-100 dark:bg-green-900/20"
                              : "bg-blue-100 dark:bg-blue-900/20"
                          }`}
                        >
                          <Bell
                            className={`w-4 h-4 ${
                              notification.type === "APPOINTMENT"
                                ? "text-green-600 dark:text-green-400"
                                : "text-blue-600 dark:text-blue-400"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-dark-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-xs text-dark-600 dark:text-dark-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-dark-500 dark:text-dark-500 mt-1">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>

                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Empty State Card */}
          {notifications.length === 0 && (
            <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg border border-dark-200 dark:border-dark-700 mt-4">
              <div className="p-12 text-center">
                <Bell className="w-16 h-16 text-green-300 dark:text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-green-600 dark:text-green-400 mb-2">
                  No notifications yet
                </h3>
                <p className="text-green-500 dark:text-green-400">
                  You'll see notifications here when you receive new bookings or
                  updates.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
