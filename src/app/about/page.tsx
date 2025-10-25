"use client";

import { motion } from "framer-motion";
import { Heart, Award, Users, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const values = [
  {
    icon: Heart,
    title: "Passion for Excellence",
    description:
      "We are passionate about delivering exceptional hair care services that exceed your expectations.",
  },
  {
    icon: Award,
    title: "Professional Expertise",
    description:
      "Our team consists of certified stylists with years of experience in the latest techniques and trends.",
  },
  {
    icon: Users,
    title: "Client-Centered",
    description:
      "Your satisfaction is our priority. We listen, understand, and create looks that make you feel confident.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description:
      "We stay ahead of trends, offering cutting-edge styles and treatments using premium products.",
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
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            About Halo Hair Lounge
          </h1>
          <p className="text-xl text-dark-600 dark:text-dark-400 max-w-3xl mx-auto">
            Where artistry meets innovation in hair care. We're committed to
            helping you look and feel your absolute best.
          </p>
        </motion.div>

        {/* Story Section */}
        <Card className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-4">
                Our Story
              </h2>
              <div className="space-y-4 text-dark-600 dark:text-dark-400">
                <p>
                  Founded in 2010, Halo Hair Lounge began with a simple vision:
                  to create a welcoming space where everyone feels beautiful and
                  confident. What started as a small boutique salon has grown
                  into a premier destination for hair care excellence.
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
                  Today, we're proud to serve our community with a full range of
                  services, from precision cuts and vibrant color to luxurious
                  treatments and protective styling. Every visit to Halo Hair
                  Lounge is an experience in transformation and self-care.
                </p>
              </div>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-32 h-32 text-primary-600 animate-pulse-slow" />
            </div>
          </div>
        </Card>

        {/* Values Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold mb-4">Our Values</h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="text-center h-full">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {value.title}
                    </h3>
                    <p className="text-dark-600 dark:text-dark-400 text-sm">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-bold mb-4">
              Meet Our Team
            </h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Talented professionals dedicated to your hair care journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-dark-600 dark:text-dark-400 mb-3">
                    {member.experience} experience
                  </p>
                  <div className="space-y-1">
                    {member.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs rounded-full mx-1"
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
        <Card className="text-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 border-2 border-primary-200 dark:border-primary-800">
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Transform Your Look?
          </h2>
          <p className="text-dark-600 dark:text-dark-400 mb-6 max-w-2xl mx-auto">
            Book an appointment with our expert team and experience the Halo
            Hair Lounge difference
          </p>
          <Button size="lg" onClick={() => (window.location.href = "/book")}>
            Book Your Appointment
          </Button>
        </Card>
      </div>
    </div>
  );
}
