"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Award,
  Users,
  Sparkles,
  Target,
  Zap,
  Shield,
  Star,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const values = [
  {
    icon: Heart,
    title: "Passion for Excellence",
    description:
      "We are passionate about delivering exceptional hair care services that exceed your expectations.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: Award,
    title: "Professional Expertise",
    description:
      "Our team consists of certified stylists with years of experience in the latest techniques and trends.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Users,
    title: "Client-Centered",
    description:
      "Your satisfaction is our priority. We listen, understand, and create looks that make you feel confident.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description:
      "We stay ahead of trends, offering cutting-edge styles and treatments using premium products.",
    gradient: "from-purple-500 to-indigo-600",
  },
];

const team = [
  {
    name: "Sarah Johnson",
    role: "Master Stylist & Owner",
    experience: "15+ years",
    specialties: ["Color Correction", "Balayage", "Extensions"],
  },
  {
    name: "Michael Chen",
    role: "Senior Stylist",
    experience: "10+ years",
    specialties: ["Precision Cuts", "Men's Grooming", "Styling"],
  },
  {
    name: "Emily Rodriguez",
    role: "Color Specialist",
    experience: "8+ years",
    specialties: ["Creative Color", "Highlights", "Treatments"],
  },
  {
    name: "David Kim",
    role: "Texture Specialist",
    experience: "12+ years",
    specialties: ["Braiding", "Natural Hair", "Protective Styles"],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-primary-50/30 via-white to-green-50/20 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="text-center p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3 bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent whitespace-nowrap">
              About Halo Hair Lounge
            </h1>
            <p className="text-base sm:text-lg text-dark-600 dark:text-dark-400 max-w-3xl mx-auto">
              Where artistry meets innovation in hair care. We're committed to
              helping you look and feel your absolute best.
            </p>
          </Card>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-6 lg:p-8">
                <h2 className="text-2xl font-display font-bold mb-4 text-primary-600">
                  Our Story
                </h2>
                <div className="space-y-3 text-dark-700 dark:text-dark-300 leading-relaxed text-sm sm:text-base">
                  <p>
                    Founded in 2010, Halo Hair Lounge began with a simple
                    vision: to create a welcoming space where everyone feels
                    beautiful and confident. What started as a small boutique
                    salon has grown into a premier destination for hair care
                    excellence.
                  </p>
                  <p>
                    Our team of passionate stylists brings together decades of
                    combined experience, staying current with the latest
                    techniques while honoring timeless artistry. We believe that
                    great hair care is about more than just technique—it's about
                    understanding each client's unique needs and creating
                    personalized solutions.
                  </p>
                  <p>
                    Today, we're proud to serve our community with a full range
                    of services, from precision cuts and vibrant color to
                    luxurious treatments and protective styling. Every visit to
                    Halo Hair Lounge is an experience in transformation and
                    self-care.
                  </p>
                </div>
              </div>
              <div className="relative min-h-[250px] lg:min-h-[350px] bg-gradient-to-br from-primary-100 via-green-50 to-primary-50 dark:from-primary-900/20 dark:via-green-900/10 dark:to-primary-900/20 flex items-center justify-center">
                <Sparkles className="w-20 h-20 text-primary-600 opacity-50" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Values Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2 text-primary-600">
              Our Values
            </h2>
            <p className="text-sm sm:text-base text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                >
                  <Card className="h-full p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 flex-shrink-0 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center shadow-md`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-dark-900 dark:text-white">
                        {value.title}
                      </h3>
                    </div>
                    <p className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2 text-primary-600">
              Meet Our Team
            </h2>
            <p className="text-sm sm:text-base text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Talented professionals dedicated to your hair care journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
              >
                <Card className="h-full p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-primary-500 to-green-500 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-sm font-bold text-white">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-dark-900 dark:text-white truncate">
                        {member.name}
                      </h3>
                      <p className="text-primary-600 dark:text-primary-400 font-medium text-xs">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-dark-600 dark:text-dark-400 mb-2">
                    {member.experience} experience
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="text-center bg-gradient-to-br from-primary-50 to-green-50 dark:from-primary-950/50 dark:to-green-950/50 border-2 border-primary-200 dark:border-primary-800 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 text-primary-600">
              Ready to Transform Your Look?
            </h2>
            <p className="text-sm sm:text-base text-dark-700 dark:text-dark-300 mb-5 max-w-2xl mx-auto">
              Book an appointment with our expert team and experience the Halo
              Hair Lounge difference
            </p>
            <Button size="lg" onClick={() => (window.location.href = "/book")}>
              Book Your Appointment
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
