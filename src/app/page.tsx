"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  ShoppingBag,
  Scissors,
  ArrowRight,
  Star,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import HeroScene from "@/components/3d/HeroScene";

const heroSlides = [
  {
    title: "Transform Your Look",
    subtitle: "Premium Hair Care Excellence",
    description: "Experience luxury styling with our expert stylists",
    colorScheme: "green" as const,
    cta: { text: "Book Appointment", href: "/book" },
  },
  {
    title: "Discover Beauty",
    subtitle: "Innovative Hair Solutions",
    description: "From classic cuts to bold transformations",
    colorScheme: "green" as const,
    cta: { text: "View Services", href: "/services" },
  },
  {
    title: "Your Hair Journey",
    subtitle: "Starts Here Today",
    description: "Personalized consultations and expert care",
    colorScheme: "green" as const,
    cta: { text: "Get Started", href: "/about" },
  },
];

const features = [
  {
    icon: Scissors,
    title: "Expert Stylists",
    description: "Highly trained professionals with years of experience",
  },
  {
    icon: Sparkles,
    title: "Premium Products",
    description: "Only the finest hair care products and tools",
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Book appointments online 24/7 with instant confirmation",
  },
  {
    icon: ShoppingBag,
    title: "Online Store",
    description: "Shop professional-grade products from home",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <div className="min-h-screen -mt-16">
      {/* Hero Section with 3D Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated 3D Background */}
        <HeroScene colorScheme={slide.colorScheme} />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900/80 -z-10" />

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-6 px-6 py-3 glass rounded-full"
              >
                <span className="text-primary-300 font-semibold text-sm flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 animate-spin-slow" />
                  {slide.subtitle}
                </span>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${currentSlide}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 animate-gradient bg-gradient-to-r from-white via-primary-300 to-white bg-size-200 bg-clip-text text-transparent"
              >
                {slide.title}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`description-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl sm:text-2xl text-dark-200 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                {slide.description}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`buttons-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href={slide.cta.href}>
                  <Button size="md" className="group flex items-center">
                    <span>{slide.cta.text}</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="md"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Explore Services
                  </Button>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="flex items-center justify-center gap-3 mt-12">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "w-12 bg-primary-500"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full mx-auto"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="pt-8 pb-12 bg-white dark:bg-dark-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-green-100 to-primary-100 dark:from-green-950 dark:to-primary-950 rounded-full border border-green-200 dark:border-green-800 shadow-lg shadow-green-500/20"
            >
              <span className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">
                Our Commitment
              </span>
            </motion.div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold mb-5 bg-gradient-to-r from-green-600 via-primary-600 to-green-700 bg-clip-text text-transparent leading-tight whitespace-nowrap">
              Why Choose Halo Hair Lounge
            </h2>

            <p className="text-lg sm:text-xl text-dark-600 dark:text-dark-400 leading-relaxed max-w-3xl mx-auto">
              Experience the perfect blend of luxury, expertise, and innovation
              at our premier salon
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: idx * 0.15,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    y: -8,
                    rotateY: 3,
                    rotateX: 3,
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  style={{
                    perspective: 1000,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="relative group cursor-pointer">
                    {/* 3D Shadow Layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-primary-800/20 rounded-2xl blur-xl transform translate-y-4 group-hover:translate-y-6 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-primary-800/10 rounded-2xl blur-2xl transform translate-y-6 group-hover:translate-y-8 transition-transform duration-300" />

                    {/* Main Card */}
                    <motion.div
                      className="relative bg-gradient-to-br from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 rounded-2xl p-5 border border-dark-200/20 dark:border-dark-700/30 shadow-2xl overflow-hidden"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: "translateZ(50px)",
                      }}
                    >
                      {/* Animated Background Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>

                      {/* Icon and Title Row */}
                      <div className="flex items-center gap-3 mb-3 relative">
                        {/* Icon Container with 3D Effect */}
                        <motion.div
                          className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-lg flex-shrink-0"
                          style={{
                            transformStyle: "preserve-3d",
                            transform: "translateZ(75px)",
                          }}
                          whileHover={{
                            scale: 1.1,
                            rotate: [0, -5, 5, 0],
                            transition: { duration: 0.5 },
                          }}
                        >
                          {/* Icon Glow */}
                          <div className="absolute inset-0 bg-primary-400 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                          <Icon className="w-6 h-6 text-white relative z-10 drop-shadow-lg" />
                        </motion.div>

                        {/* Title */}
                        <h3
                          className="relative text-lg font-bold bg-gradient-to-r from-dark-900 to-primary-700 dark:from-white dark:to-primary-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300"
                          style={{
                            transformStyle: "preserve-3d",
                            transform: "translateZ(25px)",
                          }}
                        >
                          {feature.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p
                        className="relative text-sm text-dark-600 dark:text-dark-400 leading-relaxed"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: "translateZ(15px)",
                        }}
                      >
                        {feature.description}
                      </p>

                      {/* Bottom Accent Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-600 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-16 pb-32 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-80 h-80 bg-green-400 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Accent Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-xl"
            >
              <span className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Book Now & Get Started
              </span>
            </motion.div>

            {/* Main Heading with Enhanced Typography */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight"
            >
              <span className="inline-block bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Ready for Your
              </span>
              <br />
              <span className="inline-block bg-gradient-to-r from-green-200 via-white to-green-200 bg-clip-text text-transparent drop-shadow-2xl">
                Transformation?
              </span>
            </motion.h2>

            {/* Subtitle with enhanced styling */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl lg:text-2xl text-green-50 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Book your appointment today and experience the Halo difference
              <span className="block mt-2 text-base text-green-100/80">
                Premium styling • Expert care • Personalized service
              </span>
            </motion.p>

            {/* Enhanced CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.5,
                type: "spring",
                stiffness: 200,
              }}
            >
              <Link href="/book">
                <Button
                  size="lg"
                  variant="secondary"
                  className="group shadow-2xl hover:shadow-green-500/50 transition-all duration-300 text-lg px-10 py-6"
                >
                  <Calendar className="w-6 h-6 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  Book Your Appointment
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-8 text-green-100/80 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <span>Expert Stylists</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <span>Premium Products</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xl">✓</span>
                <span>Flexible Scheduling</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
