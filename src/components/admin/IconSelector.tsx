"use client";

import { useState } from "react";
import {
  Heart,
  Award,
  Clock,
  Users,
  Scissors,
  Sparkles,
  Calendar,
  ShoppingBag,
  Star,
  Zap,
  Trophy,
  Gift,
  Crown,
  Gem,
  Palette,
  Smile,
  ThumbsUp,
  Check,
  Shield,
  Target,
  TrendingUp,
  Layers,
  Box,
  Package,
  X,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

// Extended icon library
const iconLibrary = [
  { name: "Heart", icon: Heart },
  { name: "Award", icon: Award },
  { name: "Clock", icon: Clock },
  { name: "Users", icon: Users },
  { name: "Scissors", icon: Scissors },
  { name: "Sparkles", icon: Sparkles },
  { name: "Calendar", icon: Calendar },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Star", icon: Star },
  { name: "Zap", icon: Zap },
  { name: "Trophy", icon: Trophy },
  { name: "Gift", icon: Gift },
  { name: "Crown", icon: Crown },
  { name: "Gem", icon: Gem },
  { name: "Palette", icon: Palette },
  { name: "Smile", icon: Smile },
  { name: "ThumbsUp", icon: ThumbsUp },
  { name: "Check", icon: Check },
  { name: "Shield", icon: Shield },
  { name: "Target", icon: Target },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Layers", icon: Layers },
  { name: "Box", icon: Box },
  { name: "Package", icon: Package },
];

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function IconSelector({
  value,
  onChange,
  className = "",
}: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"library" | "url">("library");
  const [customUrl, setCustomUrl] = useState(
    value.startsWith("http") ? value : ""
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Check if current value is a URL
  const isUrl = value.startsWith("http");

  // Get current icon component
  const getCurrentIcon = () => {
    if (isUrl) {
      return null;
    }
    const iconOption = iconLibrary.find((opt) => opt.name === value);
    return iconOption ? iconOption.icon : Heart;
  };

  const CurrentIcon = getCurrentIcon();

  // Filter icons based on search
  const filteredIcons = iconLibrary.filter((icon) =>
    icon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleUrlSubmit = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setIsOpen(false);
      setCustomUrl("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Current Selection Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-white hover:border-primary-500 focus:ring-2 focus:ring-primary-500 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {isUrl ? (
            <>
              <img
                src={value}
                alt="Custom icon"
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-xs truncate max-w-[120px]">{value}</span>
            </>
          ) : CurrentIcon ? (
            <>
              <CurrentIcon className="w-5 h-5" />
              <span>{value}</span>
            </>
          ) : (
            <span className="text-gray-400">Select icon</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-full left-0 mt-2 w-full md:w-96 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg shadow-2xl z-50 overflow-hidden">
            {/* Mode Tabs */}
            <div className="flex border-b border-gray-200 dark:border-dark-700">
              <button
                type="button"
                onClick={() => setMode("library")}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  mode === "library"
                    ? "bg-primary-500 text-white"
                    : "bg-gray-50 dark:bg-dark-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Icon Library
              </button>
              <button
                type="button"
                onClick={() => setMode("url")}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  mode === "url"
                    ? "bg-primary-500 text-white"
                    : "bg-gray-50 dark:bg-dark-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800"
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                Custom URL
              </button>
            </div>

            {/* Library Mode */}
            {mode === "library" && (
              <div className="p-3">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 mb-3 text-sm border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />

                {/* Icon Grid */}
                <div className="max-h-80 overflow-y-auto">
                  <div className="grid grid-cols-4 gap-2">
                    {filteredIcons.map((iconOption) => {
                      const IconComp = iconOption.icon;
                      const isSelected = value === iconOption.name;

                      return (
                        <button
                          key={iconOption.name}
                          type="button"
                          onClick={() => handleIconSelect(iconOption.name)}
                          className={`p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                            isSelected
                              ? "bg-primary-500 text-white shadow-md scale-105"
                              : "bg-gray-50 dark:bg-dark-900 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-dark-700 hover:scale-105"
                          }`}
                        >
                          <IconComp className="w-6 h-6" />
                          <span className="text-[10px] text-center leading-tight">
                            {iconOption.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {filteredIcons.length === 0 && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                      No icons found
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* URL Mode */}
            {mode === "url" && (
              <div className="p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/icon.png"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-dark-700 rounded-lg bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-4">
                  Enter a direct URL to an image (PNG, SVG, JPG, etc.)
                </p>

                {/* Preview */}
                {customUrl && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-dark-900 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preview:
                    </p>
                    <div className="flex justify-center">
                      <img
                        src={customUrl}
                        alt="Preview"
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='8' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'%3E%3C/line%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={!customUrl.trim()}
                  className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Use This URL
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Helper function to render icon in other components
export function renderIcon(iconValue: string, className: string = "w-6 h-6") {
  // Check if it's a URL
  if (iconValue.startsWith("http")) {
    return (
      <img
        src={iconValue}
        alt="Icon"
        className={className}
        style={{ objectFit: "contain" }}
      />
    );
  }

  // Otherwise, render from library
  const iconOption = iconLibrary.find((opt) => opt.name === iconValue);
  if (iconOption) {
    const IconComp = iconOption.icon;
    return <IconComp className={className} />;
  }

  // Fallback
  return <Heart className={className} />;
}
