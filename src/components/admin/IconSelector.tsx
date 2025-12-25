"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  Home,
  Search,
  Menu,
  Settings,
  Bell,
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Image,
  Video,
  Music,
  Camera,
  File,
  Folder,
  Download,
  Upload,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Tag,
  Percent,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  X,
  Edit,
  Trash2,
  Save,
  Copy,
  Clipboard,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  LogIn,
  LogOut,
  UserPlus,
  UserMinus,
  UserCheck,
  Users2,
  Building,
  Briefcase,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin,
  Map,
  Navigation,
  Compass,
  Globe,
  Wifi,
  WifiOff,
  Bluetooth,
  Battery,
  BatteryCharging,
  Power,
  Zap as Lightning,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Umbrella,
  Wind,
  Snowflake,
  Droplet,
  Flame,
  Thermometer,
  Coffee,
  Pizza,
  Beer,
  Wine,
  Utensils,
  IceCream,
  Apple,
  Banana,
  Cherry,
  Candy,
  Cake,
  Cookie,
  Croissant,
  Fish,
  Sandwich,
  Salad,
  Soup,
  Drumstick,
  Popcorn,
  Martini,
  Leaf,
  Flower,
  Flower2,
  Bug,
  Squirrel,
  Dog,
  Cat,
  Rabbit,
  Fish as FishIcon,
  Bird,
  Turtle,
  Heart as HeartIcon,
  Brain,
  Bone,
  Ear,
  Eye as EyeIcon,
  Fingerprint,
  Footprints,
  Hand,
  Activity,
  Pill,
  Stethoscope,
  Syringe,
  Thermometer as Temp,
  Bandage,
  Baby,
  Glasses,
  Shirt,
  Watch,
  Footprints as Shoe,
  Umbrella as Rain,
  Bike,
  Car,
  Plane,
  Train,
  Truck,
  Bus,
  Rocket,
  Ship,
  Anchor,
  Mountain,
  Tent,
  Flame as Fire,
  Book,
  BookOpen,
  Bookmark,
  Pen,
  PenTool,
  Highlighter,
  Eraser,
  Ruler,
  Scissors as Cut,
  Paperclip,
  Link,
  Link2,
  Archive,
  Inbox,
  Mail as Envelope,
  Send as SendIcon,
  Trash,
  Trash2 as Delete,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  CheckCircle,
  XCircle,
  MinusCircle,
  PlusCircle,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Flag,
  Star as StarIcon,
  Heart as Love,
  Bookmark as Mark,
  Share,
  Share2,
  ThumbsUp as Like,
  ThumbsDown,
  MessageCircle,
  AtSign,
  Hash,
  DollarSign as Money,
  Percent as Percentage,
  Award as Trophy2,
  Medal,
  TrendingUp as Up,
  TrendingDown,
  BarChart,
  BarChart2,
  BarChart3,
  PieChart,
  LineChart,
  Activity as Chart,
  Layers as Stack,
  Grid,
  List,
  Table,
  Columns,
  Rows,
  Layout,
  Sidebar,
  Maximize,
  Minimize,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  RotateCw,
  RotateCcw,
  Repeat,
  Shuffle,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Radio,
  Tv,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Watch as Clock2,
  Speaker,
  Headphones,
  Printer,
  Keyboard,
  Mouse,
  Cpu,
  HardDrive,
  Database,
  Server,
  CloudUpload,
  CloudDownload,
  Terminal,
  Code,
  Braces,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Github,
  Chrome,
  Figma,
  Framer,
  Slack,
  Trello,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitch,
  Package as Box2,
  Truck as Delivery,
  ShoppingBag as Bag,
  Gift as Present,
  Tag as Label,
} from "lucide-react";

// Comprehensive icon library
const iconLibrary = [
  // Basic & UI
  { name: "Heart", icon: Heart },
  { name: "Star", icon: Star },
  { name: "Circle", icon: CheckCircle },
  { name: "Check", icon: Check },
  { name: "X", icon: X },
  { name: "Plus", icon: Plus },
  { name: "Minus", icon: Minus },
  { name: "Search", icon: Search },
  { name: "Menu", icon: Menu },
  { name: "Settings", icon: Settings },
  { name: "Bell", icon: Bell },
  { name: "User", icon: User },
  { name: "Users", icon: Users },
  { name: "Home", icon: Home },

  // Business & Salon
  { name: "Scissors", icon: Scissors },
  { name: "Sparkles", icon: Sparkles },
  { name: "Crown", icon: Crown },
  { name: "Gem", icon: Gem },
  { name: "Award", icon: Award },
  { name: "Trophy", icon: Trophy },
  { name: "Medal", icon: Medal },
  { name: "Target", icon: Target },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Building", icon: Building },
  { name: "Briefcase", icon: Briefcase },

  // Time & Calendar
  { name: "Clock", icon: Clock },
  { name: "Calendar", icon: Calendar },

  // Shopping & Commerce
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "CreditCard", icon: CreditCard },
  { name: "DollarSign", icon: DollarSign },
  { name: "Tag", icon: Tag },
  { name: "Percent", icon: Percent },
  { name: "Gift", icon: Gift },
  { name: "Package", icon: Package },

  // Communication
  { name: "Mail", icon: Mail },
  { name: "Phone", icon: Phone },
  { name: "MessageSquare", icon: MessageSquare },
  { name: "Send", icon: Send },
  { name: "MessageCircle", icon: MessageCircle },
  { name: "AtSign", icon: AtSign },

  // Media
  { name: "Image", icon: Image },
  { name: "Video", icon: Video },
  { name: "Music", icon: Music },
  { name: "Camera", icon: Camera },

  // Files
  { name: "File", icon: File },
  { name: "Folder", icon: Folder },
  { name: "Download", icon: Download },
  { name: "Upload", icon: Upload },
  { name: "Save", icon: Save },
  { name: "Copy", icon: Copy },
  { name: "Clipboard", icon: Clipboard },

  // Actions
  { name: "Edit", icon: Edit },
  { name: "Trash", icon: Trash2 },
  { name: "Eye", icon: Eye },
  { name: "EyeOff", icon: EyeOff },
  { name: "Lock", icon: Lock },
  { name: "Unlock", icon: Unlock },
  { name: "Share", icon: Share },
  { name: "Share2", icon: Share2 },

  // Arrows & Navigation
  { name: "ArrowRight", icon: ArrowRight },
  { name: "ArrowLeft", icon: ArrowLeft },
  { name: "ArrowUp", icon: ArrowUp },
  { name: "ArrowDown", icon: ArrowDown },
  { name: "ChevronRight", icon: ChevronRight },
  { name: "ChevronLeft", icon: ChevronLeft },
  { name: "ChevronUp", icon: ChevronUp },
  { name: "ChevronDown", icon: ChevronDown },

  // Status & Alerts
  { name: "AlertCircle", icon: AlertCircle },
  { name: "AlertTriangle", icon: AlertTriangle },
  { name: "Info", icon: Info },
  { name: "HelpCircle", icon: HelpCircle },
  { name: "CheckCircle", icon: CheckCircle },
  { name: "XCircle", icon: XCircle },

  // Design & Creative
  { name: "Palette", icon: Palette },
  { name: "Pen", icon: Pen },
  { name: "PenTool", icon: PenTool },
  { name: "Paintbrush", icon: Highlighter },

  // Social & Engagement
  { name: "ThumbsUp", icon: ThumbsUp },
  { name: "ThumbsDown", icon: ThumbsDown },
  { name: "Smile", icon: Smile },
  { name: "Bookmark", icon: Bookmark },
  { name: "Flag", icon: Flag },

  // Tech & Devices
  { name: "Monitor", icon: Monitor },
  { name: "Smartphone", icon: Smartphone },
  { name: "Tablet", icon: Tablet },
  { name: "Laptop", icon: Laptop },
  { name: "Watch", icon: Watch },
  { name: "Wifi", icon: Wifi },
  { name: "Bluetooth", icon: Bluetooth },

  // Weather & Nature
  { name: "Sun", icon: Sun },
  { name: "Moon", icon: Moon },
  { name: "Cloud", icon: Cloud },
  { name: "CloudRain", icon: CloudRain },
  { name: "Umbrella", icon: Umbrella },
  { name: "Wind", icon: Wind },
  { name: "Snowflake", icon: Snowflake },
  { name: "Droplet", icon: Droplet },
  { name: "Flame", icon: Flame },
  { name: "Leaf", icon: Leaf },
  { name: "Flower", icon: Flower },

  // Food & Drink
  { name: "Coffee", icon: Coffee },
  { name: "Pizza", icon: Pizza },
  { name: "Beer", icon: Beer },
  { name: "Wine", icon: Wine },
  { name: "Utensils", icon: Utensils },
  { name: "IceCream", icon: IceCream },

  // Layout & Organization
  { name: "Layers", icon: Layers },
  { name: "Grid", icon: Grid },
  { name: "List", icon: List },
  { name: "Table", icon: Table },
  { name: "Layout", icon: Layout },
  { name: "Sidebar", icon: Sidebar },

  // Charts & Data
  { name: "BarChart", icon: BarChart },
  { name: "PieChart", icon: PieChart },
  { name: "LineChart", icon: LineChart },
  { name: "Activity", icon: Activity },

  // Transportation
  { name: "Bike", icon: Bike },
  { name: "Car", icon: Car },
  { name: "Plane", icon: Plane },
  { name: "Train", icon: Train },
  { name: "Truck", icon: Truck },
  { name: "Rocket", icon: Rocket },

  // Location
  { name: "MapPin", icon: MapPin },
  { name: "Map", icon: Map },
  { name: "Navigation", icon: Navigation },
  { name: "Compass", icon: Compass },
  { name: "Globe", icon: Globe },

  // Security & Auth
  { name: "Shield", icon: Shield },
  { name: "LogIn", icon: LogIn },
  { name: "LogOut", icon: LogOut },
  { name: "UserPlus", icon: UserPlus },
  { name: "UserMinus", icon: UserMinus },
  { name: "UserCheck", icon: UserCheck },

  // Misc
  { name: "Box", icon: Box },
  { name: "Archive", icon: Archive },
  { name: "Inbox", icon: Inbox },
  { name: "Link", icon: Link },
  { name: "Paperclip", icon: Paperclip },
  { name: "Zap", icon: Zap },
  { name: "Battery", icon: Battery },
  { name: "Power", icon: Power },
  { name: "RefreshCw", icon: RefreshCw },
  { name: "Repeat", icon: Repeat },
  { name: "Shuffle", icon: Shuffle },
  { name: "Volume", icon: Volume },
  { name: "Mic", icon: Mic },
  { name: "Speaker", icon: Speaker },
  { name: "Headphones", icon: Headphones },
  { name: "Book", icon: Book },
  { name: "BookOpen", icon: BookOpen },
].sort((a, b) => a.name.localeCompare(b.name));

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
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

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
        ref={buttonRef}
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

      {/* Dropdown Panel using Portal */}
      {mounted &&
        isOpen &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-lg shadow-2xl z-[9999] overflow-hidden max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
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
                  <Image className="w-4 h-4" />
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
                  <Link className="w-4 h-4" />
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

                  {/* Icon count */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-1">
                    {filteredIcons.length} icon
                    {filteredIcons.length !== 1 ? "s" : ""} available
                  </p>

                  {/* Icon Grid */}
                  <div className="max-h-96 min-h-[300px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-5 gap-2">
                      {filteredIcons.map((iconOption) => {
                        const IconComp = iconOption.icon;
                        const isSelected = value === iconOption.name;

                        return (
                          <button
                            key={iconOption.name}
                            type="button"
                            onClick={() => handleIconSelect(iconOption.name)}
                            className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                              isSelected
                                ? "bg-primary-500 text-white shadow-md scale-105"
                                : "bg-gray-50 dark:bg-dark-900 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-dark-700 hover:scale-105"
                            }`}
                            title={iconOption.name}
                          >
                            <IconComp className="w-5 h-5" />
                            <span className="text-[9px] text-center leading-tight truncate max-w-full">
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
          </>,
          document.body
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

  // Fallback to Heart icon
  return <Heart className={className} />;
}
