"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  // Reset index when opening with new initial index
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
          );
          break;
        case "ArrowRight":
          setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
          );
          break;
      }
    },
    [isOpen, images.length, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Title */}
          {title && (
            <div className="absolute top-4 left-4 z-50">
              <h3 className="text-white text-lg font-semibold">{title}</h3>
              <p className="text-white/70 text-sm">
                {currentIndex + 1} of {images.length}
              </p>
            </div>
          )}

          {/* Zoom toggle */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 right-16 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Main image */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`relative ${
              isZoomed
                ? "w-full h-full cursor-zoom-out"
                : "w-[90vw] h-[80vh] max-w-5xl cursor-zoom-in"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <Image
              src={images[currentIndex]}
              alt={title || `Image ${currentIndex + 1}`}
              fill
              className={`${isZoomed ? "object-contain" : "object-contain"}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              priority
            />
          </motion.div>

          {/* Thumbnail navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 px-4 py-2 bg-black/50 rounded-full max-w-[90vw] overflow-x-auto">
              {images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    idx === currentIndex
                      ? "ring-2 ring-white scale-110"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Dot indicators for mobile */}
          {images.length > 1 && images.length <= 10 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 flex gap-2 md:hidden">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
