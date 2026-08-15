import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronRight,
  ShoppingBag,
  Shirt,
  Footprints,
  Layers,
  Heart,
  ExternalLink,
  Palette,
  User,
  ArrowRight,
  Star,
  Award,
  TrendingUp,
  Check,
  ShoppingCart,
  RefreshCw
} from 'lucide-react';

// Types
type SkinTone = 'fair' | 'wheatish' | 'dark';

interface ColorRecommendation {
  color: string;
  hex: string;
  reason: string;
}

interface SkinToneRecommendations {
  title: string;
  description: string;
  tops: ColorRecommendation[];
  bottoms: ColorRecommendation[];
  shoes: ColorRecommendation[];
}

// Skin tone definitions with visual elements
const SKIN_TONES = [
  { 
    id: 'fair' as SkinTone, 
    label: 'Fair', 
    gradient: 'from-amber-100 to-rose-100',
    border: 'border-amber-200',
    bg: 'bg-gradient-to-br from-amber-50 to-rose-50',
    description: 'Light skin with cool or pink undertones'
  },
  { 
    id: 'wheatish' as SkinTone, 
    label: 'Wheatish', 
    gradient: 'from-amber-200 to-orange-200',
    border: 'border-amber-300',
    bg: 'bg-gradient-to-br from-amber-100 to-orange-100',
    description: 'Medium skin with warm, golden undertones'
  },
  { 
    id: 'dark' as SkinTone, 
    label: 'Dark', 
    gradient: 'from-amber-800 to-stone-800',
    border: 'border-amber-700',
    bg: 'bg-gradient-to-br from-amber-900 to-stone-900',
    description: 'Rich, deep skin with warm undertones'
  },
];

// Color recommendations for each skin tone
const RECOMMENDATIONS: Record<SkinTone, SkinToneRecommendations> = {
  fair: {
    title: "For Fair Skin Tone",
    description: "Soft, pastel colors that enhance your natural glow",
    tops: [
      { color: "Pastel Pink", hex: "#FFD1DC", reason: "Adds warmth and softness to your complexion" },
      { color: "Lavender", hex: "#E6E6FA", reason: "Creates an elegant, ethereal look" },
      { color: "Powder Blue", hex: "#B6D0E2", reason: "Enhances your natural cool undertones" },
      { color: "Mint Green", hex: "#98FB98", reason: "Fresh and vibrant choice" },
      { color: "Soft Gray", hex: "#D3D3D3", reason: "Neutral and sophisticated" }
    ],
    bottoms: [
      { color: "Navy Blue", hex: "#000080", reason: "Classic contrast that grounds your outfit" },
      { color: "Light Denim", hex: "#5D8AA8", reason: "Casual and universally flattering" },
      { color: "Beige", hex: "#F5F5DC", reason: "Natural and versatile" },
      { color: "Charcoal", hex: "#36454F", reason: "Modern and sleek" }
    ],
    shoes: [
      { color: "Nude", hex: "#E3BC9A", reason: "Elongates legs, seamless look" },
      { color: "White", hex: "#FFFFFF", reason: "Clean and fresh" },
      { color: "Light Brown", hex: "#C4A484", reason: "Warm and classic" },
      { color: "Silver", hex: "#C0C0C0", reason: "Adds subtle shimmer" }
    ]
  },
  wheatish: {
    title: "For Wheatish Skin Tone",
    description: "Rich, warm earth tones that complement your golden undertones",
    tops: [
      { color: "Burgundy", hex: "#800020", reason: "Rich and elegant, deepens your complexion" },
      { color: "Olive Green", hex: "#808000", reason: "Natural and earthy" },
      { color: "Mustard", hex: "#FFDB58", reason: "Warm and vibrant" },
      { color: "Terracotta", hex: "#E2725B", reason: "Earth tones that pop" },
      { color: "Cream", hex: "#FFFDD0", reason: "Soft and flattering" }
    ],
    bottoms: [
      { color: "Brown", hex: "#8B4513", reason: "Rich and grounding" },
      { color: "Dark Denim", hex: "#2C3E50", reason: "Versatile classic" },
      { color: "Khaki", hex: "#C3B091", reason: "Natural complement" },
      { color: "Burgundy", hex: "#800020", reason: "Rich accent color" }
    ],
    shoes: [
      { color: "Tan", hex: "#D2B48C", reason: "Natural and warm" },
      { color: "Brown", hex: "#8B4513", reason: "Classic and versatile" },
      { color: "Olive", hex: "#808000", reason: "Unique statement" },
      { color: "Burgundy", hex: "#800020", reason: "Rich and sophisticated" }
    ]
  },
  dark: {
    title: "For Dark Skin Tone",
    description: "Bold, vibrant colors that create stunning contrast",
    tops: [
      { color: "Royal Blue", hex: "#4169E1", reason: "Stunning contrast that pops" },
      { color: "Emerald Green", hex: "#50C878", reason: "Rich and regal" },
      { color: "Red", hex: "#FF0000", reason: "Bold and powerful" },
      { color: "White", hex: "#FFFFFF", reason: "Clean, crisp contrast" },
      { color: "Yellow", hex: "#FFFF00", reason: "Bright and energetic" }
    ],
    bottoms: [
      { color: "Black", hex: "#000000", reason: "Sleek and classic" },
      { color: "Dark Denim", hex: "#1C2E4A", reason: "Perfect everyday" },
      { color: "Navy", hex: "#000080", reason: "Sophisticated choice" },
      { color: "Gray", hex: "#808080", reason: "Modern neutral" }
    ],
    shoes: [
      { color: "Black", hex: "#000000", reason: "Always stylish" },
      { color: "White", hex: "#FFFFFF", reason: "Bold contrast" },
      { color: "Red", hex: "#FF0000", reason: "Statement piece" },
      { color: "Royal Blue", hex: "#4169E1", reason: "Pop of color" }
    ]
  }
};

// Store configurations
const STORES = [
  { id: 'amazon', name: 'Amazon', icon: '🛒', color: 'from-orange-500 to-amber-600' },
  { id: 'myntra', name: 'Myntra', icon: '👕', color: 'from-pink-500 to-rose-600' },
  { id: 'flipkart', name: 'Flipkart', icon: '📱', color: 'from-blue-500 to-indigo-600' },
  { id: 'ajio', name: 'Ajio', icon: '🛍️', color: 'from-purple-500 to-violet-600' }
];

const Buy: React.FC = () => {
  const [selectedSkinTone, setSelectedSkinTone] = useState<SkinTone | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleSkinToneSelect = (tone: SkinTone) => {
    setSelectedSkinTone(tone);
    setShowRecommendations(true);
  };

  const navigateToStore = (site: string, item: string, color: string) => {
    const searchTerm = encodeURIComponent(`${color} ${item}`);
    const urls: Record<string, string> = {
      amazon: `https://www.amazon.com/s?k=${searchTerm}`,
      myntra: `https://www.myntra.com/${searchTerm}`,
      flipkart: `https://www.flipkart.com/search?q=${searchTerm}`,
      ajio: `https://www.ajio.com/search/?text=${searchTerm}`
    };
    window.open(urls[site] || `https://www.google.com/search?q=${searchTerm}`, '_blank');
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-light">AI-Powered Color Analysis</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-300">
                Color Palette
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 font-light">
              Personalized color recommendations based on your skin tone. 
              Discover colors that make you shine.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                { value: '3', label: 'Skin Tones', icon: <User className="w-5 h-5" /> },
                { value: '20+', label: 'Colors', icon: <Palette className="w-5 h-5" /> },
                { value: '4', label: 'Stores', icon: <ShoppingBag className="w-5 h-5" /> }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-light mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider flex items-center justify-center gap-1">
                    {stat.icon}
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Skin Tone Selection */}
        <section className="mb-20">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-light text-gray-900 mb-4"
            >
              Choose Your Skin Tone
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-gray-500 max-w-2xl mx-auto"
            >
              Select your skin tone to get personalized color recommendations that complement your natural beauty
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {SKIN_TONES.map((tone) => (
              <motion.button
                key={tone.id}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSkinToneSelect(tone.id)}
                className={`relative group overflow-hidden rounded-2xl transition-all duration-300 ${
                  selectedSkinTone === tone.id 
                    ? 'ring-4 ring-blue-500 shadow-2xl' 
                    : 'hover:shadow-xl'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tone.gradient} opacity-90`} />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                
                <div className="relative p-8">
                  {/* Visual Indicator */}
                  <div className={`w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-lg bg-gradient-to-br ${tone.gradient}`} />
                  
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {tone.label}
                  </h3>
                  
                  <p className="text-xs text-gray-600 mb-4">
                    {tone.description}
                  </p>

                  {/* Color Preview Dots */}
                  <div className="flex justify-center gap-2">
                    {RECOMMENDATIONS[tone.id].tops.slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>

                  {/* Selected Indicator */}
                  {selectedSkinTone === tone.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* Recommendations */}
        <AnimatePresence mode="wait">
          {showRecommendations && selectedSkinTone && (
            <motion.section
              key={selectedSkinTone}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={staggerContainer}
              className="mt-20"
            >
              {/* Header */}
              <motion.div 
                variants={fadeInUp}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Personalized For You</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
                  {RECOMMENDATIONS[selectedSkinTone].title}
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto">
                  {RECOMMENDATIONS[selectedSkinTone].description}
                </p>
              </motion.div>

              {/* Categories */}
              <div className="space-y-12">
                {/* Tops Category */}
                <motion.div variants={fadeInUp}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                      <Shirt className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-gray-800">Top Wear</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {RECOMMENDATIONS[selectedSkinTone].tops.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        onHoverStart={() => setHoveredCard(`top-${index}`)}
                        onHoverEnd={() => setHoveredCard(null)}
                        className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        {/* Color Preview Strip */}
                        <div 
                          className="h-24 relative overflow-hidden"
                          style={{ backgroundColor: item.hex }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <div className="absolute bottom-3 left-3 text-white text-sm font-medium drop-shadow-lg">
                            {item.color}
                          </div>
                        </div>

                        <div className="p-6">
                          <p className="text-sm text-gray-600 mb-4">
                            {item.reason}
                          </p>

                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Shop at
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {STORES.map((store) => (
                                <button
                                  key={store.id}
                                  onClick={() => navigateToStore(store.id, 'shirt', item.color)}
                                  className="flex-1 min-w-[80px] px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center justify-center gap-1"
                                >
                                  <span>{store.icon}</span>
                                  <span className="hidden sm:inline">{store.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Hover Effect */}
                        <div 
                          className={`absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none transition-opacity duration-300 ${
                            hoveredCard === `top-${index}` ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Bottoms Category */}
                <motion.div variants={fadeInUp}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-gray-800">Bottom Wear</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {RECOMMENDATIONS[selectedSkinTone].bottoms.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        onHoverStart={() => setHoveredCard(`bottom-${index}`)}
                        onHoverEnd={() => setHoveredCard(null)}
                        className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div 
                          className="h-24 relative overflow-hidden"
                          style={{ backgroundColor: item.hex }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <div className="absolute bottom-3 left-3 text-white text-sm font-medium drop-shadow-lg">
                            {item.color}
                          </div>
                        </div>

                        <div className="p-6">
                          <p className="text-sm text-gray-600 mb-4">
                            {item.reason}
                          </p>

                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Shop at
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {STORES.map((store) => (
                                <button
                                  key={store.id}
                                  onClick={() => navigateToStore(store.id, 'pants', item.color)}
                                  className="flex-1 min-w-[80px] px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center justify-center gap-1"
                                >
                                  <span>{store.icon}</span>
                                  <span className="hidden sm:inline">{store.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div 
                          className={`absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none transition-opacity duration-300 ${
                            hoveredCard === `bottom-${index}` ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Shoes Category */}
                <motion.div variants={fadeInUp}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                      <Footprints className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-gray-800">Footwear</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {RECOMMENDATIONS[selectedSkinTone].shoes.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeInUp}
                        onHoverStart={() => setHoveredCard(`shoe-${index}`)}
                        onHoverEnd={() => setHoveredCard(null)}
                        className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        <div 
                          className="h-24 relative overflow-hidden"
                          style={{ backgroundColor: item.hex }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <div className="absolute bottom-3 left-3 text-white text-sm font-medium drop-shadow-lg">
                            {item.color}
                          </div>
                        </div>

                        <div className="p-6">
                          <p className="text-sm text-gray-600 mb-4">
                            {item.reason}
                          </p>

                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Shop at
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {STORES.map((store) => (
                                <button
                                  key={store.id}
                                  onClick={() => navigateToStore(store.id, 'shoes', item.color)}
                                  className="flex-1 min-w-[80px] px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center justify-center gap-1"
                                >
                                  <span>{store.icon}</span>
                                  <span className="hidden sm:inline">{store.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div 
                          className={`absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none transition-opacity duration-300 ${
                            hoveredCard === `shoe-${index}` ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Quick Shop Section */}
              <motion.div 
                variants={fadeInUp}
                className="mt-16 p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200"
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-light text-gray-900 mb-2">
                    Shop Your Complete Palette
                  </h3>
                  <p className="text-gray-500">
                    Browse all recommended colors across top fashion stores
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {STORES.map((store) => (
                    <motion.button
                      key={store.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigateToStore(
                        store.id, 
                        'fashion', 
                        RECOMMENDATIONS[selectedSkinTone].tops.map(t => t.color).join(' ')
                      )}
                      className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${store.color} p-4 text-white shadow-lg`}
                    >
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                      <div className="relative flex items-center gap-3">
                        <span className="text-2xl">{store.icon}</span>
                        <div className="flex-1 text-left">
                          <h4 className="font-medium">{store.name}</h4>
                          <span className="text-xs opacity-90 flex items-center gap-1">
                            Shop Now <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!showRecommendations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex p-6 bg-white rounded-full shadow-xl mb-6">
              <Palette className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-light text-gray-800 mb-2">
              Select Your Skin Tone
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Choose your skin tone above to get personalized color recommendations and shop instantly
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-light text-gray-800">StyleDNA</span>
              </div>
              <p className="text-sm text-gray-500 max-w-md">
                Personalized fashion recommendations based on your unique skin tone. 
                Discover colors that make you shine.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['About Us', 'How It Works', 'Color Guide', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Stores</h4>
              <ul className="space-y-2">
                {STORES.map((store) => (
                  <li key={store.id}>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      {store.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              © 2024 StyleDNA. All rights reserved. | Designed for perfect style matching
            </p>
          </div>
        </div>
      </footer>

      {/* Animations CSS */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Buy;