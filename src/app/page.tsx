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
    colorScheme: "purple" as const,
    cta: { text: "Book Appointment", href: "/book" },
  },
  {
    title: "Discover Beauty",
    subtitle: "Innovative Hair Solutions",
    description: "From classic cuts to bold transformations",
    colorScheme: "gold" as const,
    cta: { text: "View Services", href: "/services" },
  },
  {
    title: "Shop Premium Products",
    subtitle: "Professional Quality At Home",
    description: "Exclusive hair care products for every need",
    colorScheme: "teal" as const,
    cta: { text: "Shop Now", href: "/store" },
  },
  {
    title: "Your Hair Journey",
    subtitle: "Starts Here Today",
    description: "Personalized consultations and expert care",
    colorScheme: "rose" as const,
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
    <div className="min-h-screen">
      {/* Hero Section with 3D Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated 3D Background */}
        <HeroScene colorScheme={slide.colorScheme} />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900/80 -z-10" />

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
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
                className="text-5xl sm:text-6xl lg:text-8xl font-display font-bold mb-6 animate-gradient bg-gradient-to-r from-white via-primary-300 to-white bg-size-200 bg-clip-text text-transparent"
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
      <section className="py-24 bg-white dark:bg-dark-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Why Choose Halo Hair Lounge
            </h2>
            <p className="text-xl text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              Experience the perfect blend of luxury, expertise, and innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="h-full text-center group">
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 mb-6 mx-auto"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-dark-600 dark:text-dark-400">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
              Ready for Your Transformation?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Book your appointment today and experience the Halo difference
            </p>
            <Link href="/book">
              <Button size="lg" variant="secondary" className="group">
                <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Book Your Appointment
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
