"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FileEdit,
  Home,
  Star,
  Users,
  MessageSquare,
  HelpCircle,
  Phone,
  ChevronRight,
  ChevronDown,
  Layout,
  Info,
  FileText,
  Shield,
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
    name: "Reviews Section",
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

const footerSections = [
  {
    name: "About Us",
    description: "Company information and story",
    icon: Info,
    path: "/halo-admin-portal-2024/edit-page/about",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    name: "Contact",
    description: "Contact details and business hours",
    icon: Phone,
    path: "/halo-admin-portal-2024/edit-page/contact",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    name: "Privacy Policy",
    description: "Data protection and privacy information",
    icon: Shield,
    path: "/halo-admin-portal-2024/edit-page/privacy",
    color: "from-violet-500 to-violet-600",
  },
  {
    name: "Terms of Service",
    description: "Terms and conditions of use",
    icon: FileText,
    path: "/halo-admin-portal-2024/edit-page/terms",
    color: "from-fuchsia-500 to-fuchsia-600",
  },
];

export default function EditPageDashboard() {
  const router = useRouter();
  const [footerSectionsVisible, setFooterSectionsVisible] = useState(false);

  return (
    <div className="bg-gradient-to-br from-dark-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950">
      <div className="pt-20 px-4 pb-4">
        {/* Homepage Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-green-600 rounded-lg flex-shrink-0">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              Homepage Sections
            </h3>
          </div>
          <p className="text-sm sm:text-base text-green-600 dark:text-green-400 mb-4">
            Click on any section below to edit its content, images, and
            settings. Changes will be reflected immediately on the live site.
          </p>

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
                  <Card className="group shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white dark:bg-dark-800 !p-0 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-2 hover:ring-primary-500/50">
                    {/* Icon and Title in same row */}
                    <div className="pb-0 pr-2 pl-3 pt-1 sm:pr-2.5 sm:pl-3 sm:pt-1.5 flex items-center justify-between">
                      <div className="flex items-center space-x-1 flex-1">
                        <div
                          className={`p-0.5 sm:p-1 bg-gradient-to-br ${section.color} rounded-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                        >
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-dark-900 dark:text-white group-hover:text-primary-600 transition-colors">
                          {section.name}
                        </h3>
                      </div>
                      <ChevronRight className="w-4 h-4 text-dark-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>

                    {/* Description under title */}
                    <p className="text-sm sm:text-base text-dark-600 dark:text-dark-400 line-clamp-1 pl-3 pr-1 sm:pl-3 sm:pr-1 pb-1.5 sm:pb-2">
                      {section.description}
                    </p>

                    {/* Bottom Bar under description */}
                    <div
                      className={`h-1 bg-gradient-to-r ${section.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
              <Layout className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              Footer Sections
            </h3>
          </div>
          <p className="text-sm sm:text-base text-green-600 dark:text-green-400 mb-4">
            Manage footer links, contact information, and social media settings.
          </p>

          {/* Footer Sections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {footerSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 8) }}
                  onClick={() => router.push(section.path)}
                  className="cursor-pointer"
                >
                  <Card className="group shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white dark:bg-dark-800 !p-0 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-2 hover:ring-primary-500/50">
                    {/* Icon and Title in same row */}
                    <div className="pb-0 pr-2 pl-3 pt-1 sm:pr-2.5 sm:pl-3 sm:pt-1.5 flex items-center justify-between">
                      <div className="flex items-center space-x-1 flex-1">
                        <div
                          className={`p-0.5 sm:p-1 bg-gradient-to-br ${section.color} rounded-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                        >
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-dark-900 dark:text-white group-hover:text-primary-600 transition-colors">
                          {section.name}
                        </h3>
                      </div>
                      <ChevronRight className="w-4 h-4 text-dark-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>

                    {/* Description under title */}
                    <p className="text-sm sm:text-base text-dark-600 dark:text-dark-400 line-clamp-1 pl-3 pr-1 sm:pl-3 sm:pr-1 pb-1.5 sm:pb-2">
                      {section.description}
                    </p>

                    {/* Bottom Bar under description */}
                    <div
                      className={`h-1 bg-gradient-to-r ${section.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
