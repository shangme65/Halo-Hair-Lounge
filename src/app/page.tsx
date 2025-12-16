"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Calendar,
  ShoppingBag,
  Scissors,
  ArrowRight,
  Star,
  CheckCircle2,
  Quote,
  ChevronDown,
  BadgeCheck,
  CheckCircle,
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

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Regular Client",
    verified: true,
    rating: 4.9,
    text: "Absolutely amazing experience! The stylists are incredibly talented and truly listen to what you want. My hair has never looked better.",
    ringColor: "from-blue-400 to-blue-600",
    image: "/uploads/testimonials/user1.jpg",
  },
  {
    name: "Michael Chen",
    role: "Happy Customer",
    verified: true,
    rating: 5.0,
    text: "I've been coming here for over two years and they never disappoint. Professional service, premium products, and results that exceed expectations every single time.",
    ringColor: "from-green-400 to-green-600",
    image: "/uploads/testimonials/user2.jpg",
  },
  {
    name: "Emma Williams",
    role: "Loyal Client",
    verified: true,
    rating: 4.8,
    text: "The best salon experience I've ever had! From the consultation to the final styling, everything was perfect. The team is friendly, skilled, and really passionate about hair care.",
    ringColor: "from-purple-400 to-purple-600",
    image: "/uploads/testimonials/user3.jpg",
  },
  {
    name: "James Rodriguez",
    role: "Satisfied Customer",
    verified: true,
    rating: 4.9,
    text: "Outstanding service from start to finish! My stylist took the time to understand exactly what I wanted and delivered beyond my expectations.",
    ringColor: "from-orange-400 to-orange-600",
    image: "/uploads/testimonials/user4.jpg",
  },
  {
    name: "Olivia Martinez",
    role: "Beauty Enthusiast",
    verified: true,
    rating: 5.0,
    text: "I was nervous about trying a new salon, but Halo Hair Lounge exceeded all my expectations. The consultation was thorough, and the results were stunning.",
    ringColor: "from-pink-400 to-pink-600",
    image: "/uploads/testimonials/user5.jpg",
  },
  {
    name: "David Thompson",
    role: "Professional Client",
    verified: true,
    rating: 4.7,
    text: "Best hair care experience in the city! The attention to detail is remarkable, and they use only top-tier products. Worth every penny!",
    ringColor: "from-teal-400 to-teal-600",
    image: "/uploads/testimonials/user6.jpg",
  },
  {
    name: "Sophia Anderson",
    role: "Regular Visitor",
    verified: true,
    rating: 4.9,
    text: "I've tried many salons over the years, but none compare to Halo. The stylists are true artists who genuinely care about their craft.",
    ringColor: "from-indigo-400 to-indigo-600",
    image: "/uploads/testimonials/user7.jpg",
  },
  {
    name: "Ryan Mitchell",
    role: "First-Time Client",
    verified: true,
    rating: 5.0,
    text: "Incredible transformation! I came in with damaged hair and left with healthy, vibrant locks. The team's expertise in hair restoration is unmatched.",
    ringColor: "from-red-400 to-red-600",
    image: "/uploads/testimonials/user8.jpg",
  },
  {
    name: "Isabella Garcia",
    role: "Bridal Client",
    verified: true,
    rating: 5.0,
    text: "They made me feel like a princess on my wedding day! The bridal styling was absolutely perfect, and it lasted all day and night.",
    ringColor: "from-yellow-400 to-yellow-600",
    image: "/uploads/testimonials/user9.jpg",
  },
  {
    name: "Daniel Lee",
    role: "Corporate Client",
    verified: true,
    rating: 4.8,
    text: "As someone who values professionalism and quality, I'm impressed by Halo's consistency. Every appointment is punctual, every service is excellent.",
    ringColor: "from-cyan-400 to-cyan-600",
    image: "/uploads/testimonials/user10.jpg",
  },
];

const faqs = [
  {
    question: "How do I book an appointment?",
    answer:
      "You can easily book an appointment through our online booking system available 24/7. Simply click the 'Book Appointment' button, select your preferred service, choose your stylist, and pick a convenient time slot. You'll receive instant confirmation via email.",
  },
  {
    question: "What services do you offer?",
    answer:
      "We offer a comprehensive range of hair services including haircuts, coloring, styling, scalp treatments, chemical straightening, keratin treatments, and specialized hair loss treatments. Each service is performed by our expert stylists using premium products.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "We understand that plans change. You can cancel or reschedule your appointment up to 24 hours before your scheduled time without any charges. Cancellations made less than 24 hours in advance may incur a cancellation fee.",
  },
  {
    question: "Do you use professional-grade products?",
    answer:
      "Yes, we exclusively use premium, professional-grade products from leading brands in the hair care industry. All our products are carefully selected to ensure the best results and maintain the health of your hair.",
  },
  {
    question: "How long does a typical appointment take?",
    answer:
      "The duration varies depending on the service. A basic haircut takes about 45-60 minutes, while color services can take 2-3 hours. Complex treatments like keratin or chemical straightening may take 3-4 hours. We'll provide an estimated time when you book.",
  },
  {
    question: "Do you offer consultations?",
    answer:
      "Absolutely! We offer complimentary consultations for all new clients and for any major style changes. During the consultation, our stylists will discuss your hair goals, assess your hair type, and recommend the best treatments and styles for you.",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 2) % testimonials.length);
    }, 5000);

    return () => clearInterval(testimonialTimer);
  }, [isPaused]);

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

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-block mb-3 px-3 py-1.5 bg-primary-500/10 backdrop-blur-sm rounded-full border border-primary-500/20 shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{
                boxShadow: "0 4px 15px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)"
              }}
            >
              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider drop-shadow-sm">
                Client Reviews
              </span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-3">
              Our Client <span className="text-green-500">Reviews</span>
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Real stories from our satisfied clients
            </p>
          </motion.div>

          {/* Carousel Testimonials */}
          <div className="relative max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="wait">
                {[currentTestimonialIndex, currentTestimonialIndex + 1].map(
                  (idx, position) => {
                    const testimonial = testimonials[idx % testimonials.length];
                    return (
                      <motion.div
                        key={`${idx}-${position}`}
                        initial={{ opacity: 0, x: position === 0 ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: position === 0 ? -50 : 50 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 relative group cursor-pointer"
                        style={{
                          boxShadow:
                            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 30px -5px rgba(0, 0, 0, 0.15)",
                        }}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onClick={() => setIsPaused(!isPaused)}
                      >
                        {/* Rating Badge - Top Right */}
                        <div className="absolute top-4 right-4">
                          <div
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${testimonial.ringColor} text-white shadow-lg`}
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span className="text-sm font-bold">
                              {testimonial.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        {/* User Info Section */}
                        <div className="flex items-start gap-4 mb-4">
                          {/* Profile Image with Colored Ring */}
                          <div className="relative flex-shrink-0">
                            <div
                              className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonial.ringColor} p-0.5`}
                            >
                              <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                                <Image
                                  src={testimonial.image}
                                  alt={testimonial.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to initial letter if image fails
                                    e.currentTarget.style.display = "none";
                                    const parent =
                                      e.currentTarget.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `<div class="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-white font-bold text-xl">${testimonial.name.charAt(
                                        0
                                      )}</div>`;
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Name and Role */}
                          <div className="flex-1 pt-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900 text-base">
                                {testimonial.name}
                              </h4>
                              {testimonial.verified && (
                                <div className="relative">
                                  <svg
                                    viewBox="0 0 22 22"
                                    className="w-5 h-5"
                                    fill="none"
                                  >
                                    <path
                                      d="M11 0L13.09 2.26L16.18 2.63L16.54 5.72L18.8 7.8L16.54 9.88L16.18 12.97L13.09 13.34L11 15.6L8.91 13.34L5.82 12.97L5.46 9.88L3.2 7.8L5.46 5.72L5.82 2.63L8.91 2.26L11 0Z"
                                      fill="#22c55e"
                                      transform="translate(0, 3.2) scale(1)"
                                    />
                                    <path
                                      d="M8.5 11L10 12.5L13.5 9"
                                      stroke="white"
                                      strokeWidth="1.5"
                                      strokeLinecap="square"
                                      strokeLinejoin="miter"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>

                        {/* Testimonial Text */}
                        <p className="text-gray-700 leading-relaxed text-sm">
                          "{testimonial.text}"
                        </p>
                      </motion.div>
                    );
                  }
                )}
              </AnimatePresence>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(testimonials.length / 2) }).map(
                (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index * 2)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentTestimonialIndex === index * 2 ||
                      currentTestimonialIndex === index * 2 + 1
                        ? "bg-primary-600 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-semibold mb-3"
            >
              Got Questions?
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Frequently Asked <span className="text-green-500">Questions</span>
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our services and booking process
            </p>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-green-300 transition-all duration-300 hover:shadow-xl">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-3 flex items-start justify-between text-left hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                          openFaq === index
                            ? "bg-green-500 text-white scale-110"
                            : "bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`font-semibold pr-8 transition-colors ${
                          openFaq === index ? "text-green-600" : "text-gray-900"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 flex-shrink-0 ml-4 transition-all duration-300 ${
                        openFaq === index
                          ? "rotate-180 text-green-500"
                          : "text-gray-400 group-hover:text-green-500"
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-3 ml-12"
                        >
                          <div className="text-gray-600 leading-relaxed border-l-4 border-green-400 pl-4 bg-gradient-to-r from-green-50 to-transparent py-2 rounded-r-lg">
                            {faq.answer}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Help CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-6"
          >
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
            >
              Contact Us
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-12 pb-12 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
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
              className="inline-block mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-xl"
            >
              <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Book Now & Get Started
              </span>
            </motion.div>

            {/* Main Heading with Enhanced Typography */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight"
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
              className="text-base sm:text-lg lg:text-xl text-green-50 mb-8 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Book your appointment today and experience the Halo difference
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
                  className="group shadow-2xl hover:shadow-green-500/50 transition-all duration-300 text-base px-6 py-3"
                >
                  <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  Book Your Appointment
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex flex-wrap justify-center gap-6 text-green-100/80 text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Expert Stylists</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Premium Products</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Flexible Scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Premium Styling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Expert Care</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Personalized Service</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
