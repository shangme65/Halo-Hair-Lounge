"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FileEdit,
  Home,
  Star,
  Users,
  MessageSquare,
  HelpCircle,
  Phone,
  ChevronRight,
} from "lucide-react";
import Card from "@/components/ui/Card";

const homepageSections = [
  {
    name: "Hero Section",
    description: "Main landing section with 3D background and call-to-action",
    icon: Home,
    path: "/halo-admin-portal-2024/edit-page/hero",
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Features Section",
    description: "Showcase key features and benefits",
    icon: Star,
    path: "/halo-admin-portal-2024/edit-page/features",
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Why Choose Us",
    description: "Highlight unique value propositions",
    icon: Users,
    path: "/halo-admin-portal-2024/edit-page/why-choose-us",
    color: "from-green-500 to-green-600",
  },
  {
    name: "Client Reviews",
    description: "Testimonials and customer feedback carousel",
    icon: MessageSquare,
    path: "/halo-admin-portal-2024/edit-page/testimonials",
    color: "from-orange-500 to-orange-600",
  },
  {
    name: "FAQ Section",
    description: "Frequently asked questions and answers",
    icon: HelpCircle,
    path: "/halo-admin-portal-2024/edit-page/faq",
    color: "from-pink-500 to-pink-600",
  },
  {
    name: "CTA Section",
    description: "Final call-to-action and contact information",
    icon: Phone,
    path: "/halo-admin-portal-2024/edit-page/cta",
    color: "from-teal-500 to-teal-600",
  },
];

export default function EditPageDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <div className="pt-24 sm:pt-28 px-4 pb-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Combined Header and Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <Card className="p-4 sm:p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
              {/* Edit Homepage Header */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <FileEdit className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 dark:text-white">
                    Edit Homepage
                  </h1>
                  <p className="text-xs sm:text-sm text-dark-600 dark:text-dark-400">
                    Manage and customize all homepage sections
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-primary-200 dark:border-primary-700 my-4"></div>

              {/* Homepage Sections Info */}
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary-600 rounded-lg flex-shrink-0">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-dark-900 dark:text-white mb-1">
                    Homepage Sections
                  </h3>
                  <p className="text-xs sm:text-sm text-dark-600 dark:text-dark-400">
                    Click on any section below to edit its content, images, and
                    settings. Changes will be reflected immediately on the live
                    site.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {homepageSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 2) }}
                  onClick={() => router.push(section.path)}
                  className="cursor-pointer"
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="py-2 pr-2 pl-1.5 sm:py-2.5 sm:pr-2.5 sm:pl-2">
                      {/* Icon, Title and Arrow in same row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-1">
                          <div
                            className={`p-1 sm:p-1.5 bg-gradient-to-br ${section.color} rounded-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                          >
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-dark-900 dark:text-white group-hover:text-primary-600 transition-colors">
                            {section.name}
                          </h3>
                        </div>
                        <ChevronRight className="w-4 h-4 text-dark-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-dark-600 dark:text-dark-400 line-clamp-1 pl-6 sm:pl-8 mt-1">
                        {section.description}
                      </p>
                    </div>

                    {/* Bottom Bar */}
                    <div
                      className={`h-1 bg-gradient-to-r ${section.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6"
          >
            <Card className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Section editors are coming soon. For now,
                you can view the structure of each section. Direct editing
                capabilities will be available in the next update.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
