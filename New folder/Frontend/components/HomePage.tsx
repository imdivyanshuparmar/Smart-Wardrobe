import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Plus, 
  Sparkles, 
  CheckCircle, 
  XCircle,
  Grid,
  Layers,
  Shirt,
  Footprints,
  User,
  X,
  Image as ImageIcon,
  Trash2,
  ChevronDown,
  Moon,
  Sun,
  Cloud,
  Star,
  Award,
  TrendingUp,
  Clock,
  Calendar,
  Heart,
  Filter,
  Search,
  Menu,
  Bell,
  Settings,
  LogOut,
  Home,
  Compass,
  ShoppingBag,
  UserCircle,
  ShoppingCart,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

// Clothing item interface matching your API response
interface ClothingItem {
  id: string;
  type: string;
  color: string;
  imageUrl: string;
  laundry?: boolean;
  occasion?: string;
}

interface CategorizedClothes {
  tops: ClothingItem[];
  bottoms: ClothingItem[];
  shoes: ClothingItem[];
}

interface UploadFormData {
  name: string;
  category: 'top' | 'bottom' | 'shoes';
  occasion: 'casual' | 'formal' | 'semiFormal' | 'daily';
  color: string;
  images: File[];
  imagePreviews: string[];
}

interface UserData {
  name: string;
  emailId: string;
  _id: string;
  skinTone?: string;
}

// Updated recommendation interfaces
interface RecommendationItem {
  id: string;
  type: string;
  color: string;
  imageUrl?: string;
}

interface OutfitSuggestion {
  top: RecommendationItem;
  bottom: RecommendationItem;
  shoe: RecommendationItem;
  score: number;
  colorCombination?: string;
  occasion?: string;
}

interface Recommendations {
  formal: OutfitSuggestion | null;
  semiFormal: OutfitSuggestion | null;
  casual: OutfitSuggestion | null;
  daily: OutfitSuggestion | null;
}

type OutfitCategory = 'formal' | 'semiFormal' | 'casual' | 'daily';
type OccasionType = 'casual' | 'formal' | 'semiFormal' | 'daily';

// Color options with name and display color
const colorOptions = [
  { name: 'Black', hex: '#000000', category: 'dark', emoji: '⚫' },
  { name: 'White', hex: '#FFFFFF', category: 'light', emoji: '⚪' },
  { name: 'Red', hex: '#FF0000', category: 'bright', emoji: '🔴' },
  { name: 'Blue', hex: '#0000FF', category: 'dark', emoji: '🔵' },
  { name: 'Green', hex: '#008000', category: 'dark', emoji: '🟢' },
  { name: 'Yellow', hex: '#FFFF00', category: 'bright', emoji: '🟡' },
  { name: 'Purple', hex: '#800080', category: 'dark', emoji: '🟣' },
  { name: 'Orange', hex: '#FFA500', category: 'bright', emoji: '🟠' },
  { name: 'Pink', hex: '#FFC0CB', category: 'bright', emoji: '🌸' },
  { name: 'Brown', hex: '#8B4513', category: 'dark', emoji: '🟤' },
  { name: 'Gray', hex: '#808080', category: 'neutral', emoji: '⚙️' },
  { name: 'Navy', hex: '#000080', category: 'dark', emoji: '⚓' },
  { name: 'Maroon', hex: '#800000', category: 'dark', emoji: '🍷' },
  { name: 'Teal', hex: '#008080', category: 'dark', emoji: '🐚' },
  { name: 'Olive', hex: '#808000', category: 'dark', emoji: '🫒' },
  { name: 'Coral', hex: '#FF7F50', category: 'bright', emoji: '🪸' },
  { name: 'Lavender', hex: '#E6E6FA', category: 'light', emoji: '💜' },
  { name: 'Turquoise', hex: '#40E0D0', category: 'bright', emoji: '💎' },
  { name: 'Beige', hex: '#F5F5DC', category: 'neutral', emoji: '🏖️' },
  { name: 'Cream', hex: '#FFFDD0', category: 'light', emoji: '🍦' },
  { name: 'Magenta', hex: '#FF00FF', category: 'bright', emoji: '🎨' },
  { name: 'Cyan', hex: '#00FFFF', category: 'bright', emoji: '💧' },
  { name: 'Indigo', hex: '#4B0082', category: 'dark', emoji: '🪁' },
  { name: 'Violet', hex: '#EE82EE', category: 'bright', emoji: '🔮' },
  { name: 'Gold', hex: '#FFD700', category: 'bright', emoji: '🥇' },
  { name: 'Silver', hex: '#C0C0C0', category: 'neutral', emoji: '🥈' },
  { name: 'Bronze', hex: '#CD7F32', category: 'neutral', emoji: '🥉' },
  { name: 'Peach', hex: '#FFE5B4', category: 'light', emoji: '🍑' },
  { name: 'Mint', hex: '#98FB98', category: 'light', emoji: '🌿' },
  { name: 'Salmon', hex: '#FA8072', category: 'bright', emoji: '🐟' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [clothes, setClothes] = useState<CategorizedClothes>({
    tops: [],
    bottoms: [],
    shoes: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    name: '',
    category: 'top',
    occasion: 'casual',
    color: 'Black',
    images: [],
    imagePreviews: [],
  });
  const [uploading, setUploading] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [colorSearchTerm, setColorSearchTerm] = useState('');
  const [selectedColorCategory, setSelectedColorCategory] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    open: false,
    message: '',
    type: 'success',
  });

  // Laundry state
  const [updatingLaundry, setUpdatingLaundry] = useState<string | null>(null);

  // Recommendation state
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [selectedOutfitCategory, setSelectedOutfitCategory] = useState<OutfitCategory | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showLaundryOnly, setShowLaundryOnly] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchClothes();
  }, []);

  const fetchUserData = async () => {
    try {
      setUserLoading(true);
      const response = await axiosClient.get('/user/check');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      showSnackbar('Failed to load user data', 'error');
    } finally {
      setUserLoading(false);
    }
  };

  const fetchClothes = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/wardrobe/Allwardrobe');
      
      const data = response.data.data;
      
      setClothes({
        tops: data.tops || [],
        bottoms: data.bottoms || [],
        shoes: data.shoes || [],
      });
      
      console.log('Fetched clothes:', data);
    } catch (error) {
      console.error('Error fetching clothes:', error);
      showSnackbar('Failed to fetch clothes', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update laundry status
  const updateLaundryStatus = async (itemId: string, currentStatus: boolean = false) => {
    try {
      setUpdatingLaundry(itemId);
      
      const response = await axiosClient.patch(`/update/laundry/${itemId}`, {
        laundry: !currentStatus
      });

      if (response.data) {
        setClothes(prevClothes => {
          const updatedClothes = { ...prevClothes };
          
          updatedClothes.tops = prevClothes.tops.map(item => 
            item.id === itemId ? { ...item, laundry: !currentStatus } : item
          );
          
          updatedClothes.bottoms = prevClothes.bottoms.map(item => 
            item.id === itemId ? { ...item, laundry: !currentStatus } : item
          );
          
          updatedClothes.shoes = prevClothes.shoes.map(item => 
            item.id === itemId ? { ...item, laundry: !currentStatus } : item
          );
          
          return updatedClothes;
        });

        showSnackbar(
          `Item ${!currentStatus ? 'added to' : 'removed from'} laundry`, 
          'success'
        );
      }
    } catch (error) {
      console.error('Error updating laundry status:', error);
      showSnackbar('Failed to update laundry status', 'error');
    } finally {
      setUpdatingLaundry(null);
    }
  };

  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      
      const previews = files.map(file => URL.createObjectURL(file));
      
      setUploadForm({
        ...uploadForm,
        images: files,
        imagePreviews: previews,
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadForm.images];
    const newPreviews = [...uploadForm.imagePreviews];
    
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setUploadForm({
      ...uploadForm,
      images: newImages,
      imagePreviews: newPreviews,
    });
  };

  const handleUploadSubmit = async () => {
    if (!uploadForm.name || uploadForm.images.length === 0 || !uploadForm.color) {
      showSnackbar('Please fill all fields and select images', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('name', uploadForm.name);
    formData.append('category', uploadForm.category);
    formData.append('occasion', uploadForm.occasion);
    formData.append('color', uploadForm.color);
    
    uploadForm.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await axiosClient.post('/cloth/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Upload response:', response.data);
      showSnackbar('Clothes uploaded successfully!', 'success');
      setUploadDialogOpen(false);
      
      uploadForm.imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      
      setUploadForm({ 
        name: '', 
        category: 'top', 
        occasion: 'casual',
        color: 'Black',
        images: [], 
        imagePreviews: [] 
      });
      
      fetchClothes();
    } catch (error) {
      console.error('Error uploading clothes:', error);
      showSnackbar('Failed to upload clothes', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Function to calculate color harmony score
  const calculateColorScore = (color1: string, color2: string): number => {
    // Simple color harmony logic
    const neutralColors = ['Black', 'White', 'Gray', 'Beige', 'Cream', 'Silver', 'Brown'];
    const brightColors = ['Red', 'Yellow', 'Orange', 'Pink', 'Coral', 'Gold', 'Magenta'];
    const darkColors = ['Navy', 'Maroon', 'Purple', 'Green', 'Blue', 'Teal', 'Olive', 'Indigo', 'Violet'];
    const lightColors = ['White', 'Cream', 'Beige', 'Lavender', 'Mint', 'Peach', 'Silver'];

    if (color1 === color2) return 10; // Same color is always good
    
    if (neutralColors.includes(color1) || neutralColors.includes(color2)) return 8; // Neutrals go with anything
    
    if ((brightColors.includes(color1) && darkColors.includes(color2)) ||
        (brightColors.includes(color2) && darkColors.includes(color1))) return 9; // Bright + Dark is great
    
    if ((brightColors.includes(color1) && lightColors.includes(color2)) ||
        (brightColors.includes(color2) && lightColors.includes(color1))) return 7; // Bright + Light is good
    
    if ((darkColors.includes(color1) && darkColors.includes(color2))) return 6; // Dark + Dark is okay
    
    if ((brightColors.includes(color1) && brightColors.includes(color2))) return 5; // Bright + Bright might be too much
    
    return 7; // Default score
  };

  // Function to generate random outfit recommendations
  const generateRandomRecommendations = (): Recommendations => {
    const availableTops = clothes.tops.filter(item => !item.laundry);
    const availableBottoms = clothes.bottoms.filter(item => !item.laundry);
    const availableShoes = clothes.shoes.filter(item => !item.laundry);

    if (availableTops.length === 0 || availableBottoms.length === 0 || availableShoes.length === 0) {
      showSnackbar('Not enough items in wardrobe to generate recommendations', 'error');
      return {
        formal: null,
        semiFormal: null,
        casual: null,
        daily: null
      };
    }

    // Helper function to get random item from array
    const getRandomItem = <T,>(array: T[]): T => {
      return array[Math.floor(Math.random() * array.length)];
    };

    // Generate random outfits for each category
    const generateOutfit = (): OutfitSuggestion => {
      const top = getRandomItem(availableTops);
      const bottom = getRandomItem(availableBottoms);
      const shoe = getRandomItem(availableShoes);

      // Calculate overall score based on color combinations
      const topBottomScore = calculateColorScore(top.color, bottom.color);
      const topShoeScore = calculateColorScore(top.color, shoe.color);
      const bottomShoeScore = calculateColorScore(bottom.color, shoe.color);
      
      const overallScore = Math.round((topBottomScore + topShoeScore + bottomShoeScore) / 3);

      // Generate color combination description
      const colorCombination = `${top.color} + ${bottom.color} + ${shoe.color}`;

      return {
        top,
        bottom,
        shoe,
        score: overallScore,
        colorCombination
      };
    };

    // Generate unique outfits for each category
    const formal = generateOutfit();
    const semiFormal = generateOutfit();
    const casual = generateOutfit();
    const daily = generateOutfit();

    return {
      formal,
      semiFormal,
      casual,
      daily
    };
  };

  const handleRecommendation = async () => {
    try {
      setRecommendationsLoading(true);
      showSnackbar('Generating recommendations...', 'success');
      
      // First fetch the latest wardrobe data
      const response = await axiosClient.get('/wardrobe/Allwardrobe');
      const data = response.data.data;
      
      setClothes({
        tops: data.tops || [],
        bottoms: data.bottoms || [],
        shoes: data.shoes || [],
      });

      // Generate random recommendations based on current wardrobe
      const newRecommendations = generateRandomRecommendations();
      
      setRecommendations(newRecommendations);
      setShowRecommendations(true);
      
      // Check if any outfit is null
      const hasValidOutfits = Object.values(newRecommendations).some(outfit => outfit !== null);
      
      if (hasValidOutfits) {
        showSnackbar('Recommendations generated successfully!', 'success');
      } else {
        showSnackbar('Not enough items to generate recommendations', 'error');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      showSnackbar('Failed to generate recommendations', 'error');
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Function to regenerate recommendations
  const handleRegenerateRecommendations = () => {
    const newRecommendations = generateRandomRecommendations();
    setRecommendations(newRecommendations);
    showSnackbar('Recommendations refreshed!', 'success');
  };

  // Updated function to navigate to buy page
  const handleBuyNavigation = () => {
    navigate('/buy');
  };

  const handleViewOutfit = (category: OutfitCategory) => {
    setSelectedOutfitCategory(category);
  };

  const closeRecommendations = () => {
    setShowRecommendations(false);
    setSelectedOutfitCategory(null);
  };

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'tops': return <Shirt size={20} className="text-blue-600" />;
      case 'bottoms': return <Layers size={20} className="text-green-600" />;
      case 'shoes': return <Footprints size={20} className="text-purple-600" />;
      default: return <Grid size={20} className="text-gray-600" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch(category) {
      case 'tops': return 'Tops';
      case 'bottoms': return 'Bottoms';
      case 'shoes': return 'Shoes';
      default: return category;
    }
  };

  const getOutfitCategoryColor = (category: OutfitCategory) => {
    switch(category) {
      case 'formal': return 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-800 border-purple-200 hover:shadow-purple-200';
      case 'semiFormal': return 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border-blue-200 hover:shadow-blue-200';
      case 'casual': return 'bg-gradient-to-br from-green-50 to-green-100 text-green-800 border-green-200 hover:shadow-green-200';
      case 'daily': return 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-800 border-orange-200 hover:shadow-orange-200';
      default: return 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOutfitCategoryDisplay = (category: OutfitCategory) => {
    switch(category) {
      case 'formal': return 'Formal';
      case 'semiFormal': return 'Semi-Formal';
      case 'casual': return 'Casual';
      case 'daily': return 'Daily';
      default: return category;
    }
  };

  const getOutfitCategoryIcon = (category: OutfitCategory) => {
    switch(category) {
      case 'formal': return <Award size={20} className="text-purple-600" />;
      case 'semiFormal': return <Star size={20} className="text-blue-600" />;
      case 'casual': return <Sun size={20} className="text-green-600" />;
      case 'daily': return <Calendar size={20} className="text-orange-600" />;
      default: return <Sparkles size={20} />;
    }
  };

  // Helper function to get text color based on background
  const getTextColor = (backgroundColor: string) => {
    // Remove # if present and check if it's a hex color
    if (backgroundColor.startsWith('#')) {
      const hex = backgroundColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? 'text-gray-800' : 'text-white';
    }
    
    // For color names
    const darkColors = ['Black', 'Navy', 'Purple', 'Maroon', 'Brown', 'Green', 'Red', 'Blue', 'Indigo', 'Teal', 'Olive'];
    return darkColors.includes(backgroundColor) ? 'text-white' : 'text-gray-800';
  };

  // Get hex code for color name
  const getHexForColorName = (colorName: string): string => {
    const color = colorOptions.find(c => c.name === colorName);
    return color ? color.hex : '#000000';
  };

  // Get emoji for color name
  const getColorEmoji = (colorName: string): string => {
    const color = colorOptions.find(c => c.name === colorName);
    return color ? color.emoji : '🎨';
  };

  // Filter colors based on search term and category
  const filteredColors = colorOptions.filter(color => {
    const matchesSearch = color.name.toLowerCase().includes(colorSearchTerm.toLowerCase());
    const matchesCategory = selectedColorCategory ? color.category === selectedColorCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Filter clothes based on search, laundry, and color
  const getFilteredItems = (items: ClothingItem[]) => {
    return items.filter(item => {
      const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.color.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLaundry = showLaundryOnly ? item.laundry : true;
      const matchesColor = selectedColor ? item.color === selectedColor : true;
      return matchesSearch && matchesLaundry && matchesColor;
    });
  };

  const CategorySection = ({ 
    category 
  }: { 
    category: 'tops' | 'bottoms' | 'shoes';
  }) => {
    const items = clothes[category];
    const filteredItems = getFilteredItems(items);
    const title = getCategoryTitle(category);
    
    if (filteredItems.length === 0 && (searchTerm || showLaundryOnly || selectedColor)) {
      return null;
    }
    
    return (
      <div className="mb-12 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-md">
              {getCategoryIcon(category)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="flex justify-center mb-4">
              {getCategoryIcon(category)}
            </div>
            <p className="text-gray-500 text-lg">No {title.toLowerCase()} found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or upload new items!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={item.imageUrl} 
                    alt={item.type}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=📸';
                    }}
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Laundry Button */}
                  <button
                    onClick={() => updateLaundryStatus(item.id, item.laundry)}
                    disabled={updatingLaundry === item.id}
                    className={`absolute top-3 right-3 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                      item.laundry 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-white/90 text-gray-600 hover:bg-white backdrop-blur-sm'
                    } ${updatingLaundry === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={item.laundry ? 'Remove from laundry' : 'Add to laundry'}
                  >
                    {updatingLaundry === item.id ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
                    ) : (
                      <Moon size={20} />
                    )}
                  </button>

                  {/* Laundry Status Badge */}
                  {item.laundry && (
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg flex items-center gap-1">
                      <Moon size={14} />
                      <span>In Laundry</span>
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">
                      {item.type}
                    </h3>
                    <span className="ml-2 text-xs text-gray-400">
                      #{item.id.slice(-4)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-full ${getTextColor(item.color)}`}
                      style={{ 
                        backgroundColor: getHexForColorName(item.color),
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                    >
                      <span>{getColorEmoji(item.color)}</span>
                      <span>{item.color}</span>
                    </span>
                    
                    {item.occasion && (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {item.occasion}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const RecommendationCard = ({ 
    category, 
    outfit 
  }: { 
    category: OutfitCategory; 
    outfit: OutfitSuggestion | null;
  }) => {
    if (!outfit) return null;
    
    return (
      <div 
        className={`border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${getOutfitCategoryColor(category)}`}
        onClick={() => handleViewOutfit(category)}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {getOutfitCategoryIcon(category)}
              </div>
              <h3 className="text-lg font-semibold">{getOutfitCategoryDisplay(category)}</h3>
            </div>
            <span className="px-3 py-1.5 bg-white rounded-full text-sm font-medium shadow-sm">
              Score: {outfit.score}/10
            </span>
          </div>
          
          <div className="space-y-3">
            {/* Top */}
            <div className="flex items-center gap-3 p-2 bg-white/50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg overflow-hidden flex-shrink-0">
                {outfit.top?.imageUrl ? (
                  <img 
                    src={outfit.top.imageUrl} 
                    alt={outfit.top.type}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=👕';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Shirt size={24} className="text-blue-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{outfit.top?.type || 'N/A'}</p>
                {outfit.top?.color && (
                  <div className="flex items-center gap-1 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getHexForColorName(outfit.top.color) }}
                    />
                    <span className="text-xs text-gray-600">{outfit.top.color}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Bottom */}
            <div className="flex items-center gap-3 p-2 bg-white/50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg overflow-hidden flex-shrink-0">
                {outfit.bottom?.imageUrl ? (
                  <img 
                    src={outfit.bottom.imageUrl} 
                    alt={outfit.bottom.type}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=👖';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers size={24} className="text-green-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{outfit.bottom?.type || 'N/A'}</p>
                {outfit.bottom?.color && (
                  <div className="flex items-center gap-1 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getHexForColorName(outfit.bottom.color) }}
                    />
                    <span className="text-xs text-gray-600">{outfit.bottom.color}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Shoes */}
            <div className="flex items-center gap-3 p-2 bg-white/50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg overflow-hidden flex-shrink-0">
                {outfit.shoe?.imageUrl ? (
                  <img 
                    src={outfit.shoe.imageUrl} 
                    alt={outfit.shoe.type}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=👟';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Footprints size={24} className="text-purple-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{outfit.shoe?.type || 'N/A'}</p>
                {outfit.shoe?.color && (
                  <div className="flex items-center gap-1 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getHexForColorName(outfit.shoe.color) }}
                    />
                    <span className="text-xs text-gray-600">{outfit.shoe.color}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {outfit.colorCombination && (
            <div className="mt-4 pt-3 border-t border-current border-opacity-20">
              <p className="text-xs flex items-center gap-1">
                <span className="font-medium">Color Combo:</span>
                <span className="opacity-75">{outfit.colorCombination}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const OutfitDetailView = ({ 
    category, 
    outfit 
  }: { 
    category: OutfitCategory; 
    outfit: OutfitSuggestion | null;
  }) => {
    if (!outfit) return null;
    
    return (
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.05)' }}>
              {getOutfitCategoryIcon(category)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {getOutfitCategoryDisplay(category)} Outfit
              </h2>
              <p className="text-gray-500">Perfect for {category} occasions</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedOutfitCategory(null)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className={`p-6 rounded-xl mb-8 ${getOutfitCategoryColor(category)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award size={32} className="text-current" />
              <span className="text-xl font-semibold">Overall Score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">{outfit.score}</span>
              <span className="text-2xl opacity-75">/10</span>
            </div>
          </div>
          
          {outfit.colorCombination && (
            <div className="mt-4 pt-4 border-t border-current border-opacity-20">
              <p className="text-sm flex items-center gap-2">
                <span className="font-medium">Color Combination:</span>
                <span className="px-3 py-1 bg-white/50 rounded-full">
                  {outfit.colorCombination}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Card */}
          {outfit.top && (
            <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 relative group">
                {outfit.top.imageUrl ? (
                  <img 
                    src={outfit.top.imageUrl} 
                    alt={outfit.top.type}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <Shirt size={48} className="text-blue-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Top</h3>
                <p className="text-sm text-gray-600 mb-1">{outfit.top.type}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: getHexForColorName(outfit.top.color) }}
                    />
                    <span className="text-xs text-gray-600">{outfit.top.color}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    #{outfit.top.id.slice(-8)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Card */}
          {outfit.bottom && (
            <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 relative group">
                {outfit.bottom.imageUrl ? (
                  <img 
                    src={outfit.bottom.imageUrl} 
                    alt={outfit.bottom.type}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                    <Layers size={48} className="text-green-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Bottom</h3>
                <p className="text-sm text-gray-600 mb-1">{outfit.bottom.type}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: getHexForColorName(outfit.bottom.color) }}
                    />
                    <span className="text-xs text-gray-600">{outfit.bottom.color}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    ID: {outfit.bottom.id.slice(-8)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Shoes Card */}
          {outfit.shoe && (
            <div className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100 relative group">
                {outfit.shoe.imageUrl ? (
                  <img 
                    src={outfit.shoe.imageUrl} 
                    alt={outfit.shoe.type}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
                    <Footprints size={48} className="text-purple-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Shoes</h3>
                <p className="text-sm text-gray-600 mb-1">{outfit.shoe.type}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: getHexForColorName(outfit.shoe.color) }}
                    />
                    <span className="text-xs text-gray-600">{outfit.shoe.color}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    ID: {outfit.shoe.id.slice(-8)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={() => setSelectedOutfitCategory(null)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                <Shirt size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Clozzy<span className="text-blue-600"></span></h1>
                <p className="text-xs text-gray-500">Your Smart Wardrobe</p>
              </div>
            </div>

            {/* User Info */}
            {!userLoading && user && (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full">
                  <UserCircle size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.emailId}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Buy Button - Now navigates to /buy */}
                  <button
                    onClick={handleBuyNavigation}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-md hover:shadow-lg"
                    title="Go to buy recommendations"
                  >
                    <ShoppingCart size={20} />
                    <span className="hidden sm:inline">Buy</span>
                  </button>

                  {/* Outfit Recommendation Button */}
                  <button
                    onClick={handleRecommendation}
                    disabled={recommendationsLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {recommendationsLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        <span className="hidden sm:inline">Get Recommendations</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or color..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 bg-white border rounded-xl transition-all shadow-sm ${
                showFilters ? 'border-blue-500 text-blue-600' : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <Filter size={20} />
              <span>Filters</span>
              {Object.values({ showLaundryOnly, selectedColor }).filter(Boolean).length > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {Object.values({ showLaundryOnly, selectedColor }).filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-white rounded-xl border border-gray-200 shadow-lg animate-slideDown">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Filters</h3>
                <button
                  onClick={() => {
                    setShowLaundryOnly(false);
                    setSelectedColor(null);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Laundry Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <button
                    onClick={() => setShowLaundryOnly(!showLaundryOnly)}
                    className={`flex items-center gap-3 px-4 py-2.5 w-full border rounded-lg transition-all ${
                      showLaundryOnly 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Moon size={20} className={showLaundryOnly ? 'text-blue-600' : 'text-gray-400'} />
                    <span className="flex-1 text-left">Show only laundry items</span>
                    {showLaundryOnly && <CheckCircle size={18} className="text-blue-600" />}
                  </button>
                </div>

                {/* Color Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <select
                    value={selectedColor || ''}
                    onChange={(e) => setSelectedColor(e.target.value || null)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All colors</option>
                    {colorOptions.map(color => (
                      <option key={color.name} value={color.name}>
                        {color.emoji} {color.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shirt size={24} className="text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="mt-6 text-gray-500 text-lg">Loading your wardrobe...</p>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Shirt size={24} className="opacity-80" />
                  <span className="text-3xl font-bold">{clothes.tops.length}</span>
                </div>
                <p className="text-sm opacity-90">Tops</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Layers size={24} className="opacity-80" />
                  <span className="text-3xl font-bold">{clothes.bottoms.length}</span>
                </div>
                <p className="text-sm opacity-90">Bottoms</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Footprints size={24} className="opacity-80" />
                  <span className="text-3xl font-bold">{clothes.shoes.length}</span>
                </div>
                <p className="text-sm opacity-90">Shoes</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <Moon size={24} className="opacity-80" />
                  <span className="text-3xl font-bold">
                    {[...clothes.tops, ...clothes.bottoms, ...clothes.shoes].filter(item => item.laundry).length}
                  </span>
                </div>
                <p className="text-sm opacity-90">In Laundry</p>
              </div>
            </div>

            {/* Categories */}
            <CategorySection category="tops" />
            <CategorySection category="bottoms" />
            <CategorySection category="shoes" />

            {/* Empty State */}
            {Object.values(clothes).every(arr => arr.length === 0) && (
              <div className="text-center py-20">
                <div className="inline-flex p-6 bg-white rounded-full shadow-xl mb-6">
                  <ShoppingBag size={48} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Your wardrobe is empty</h3>
                <p className="text-gray-500 mb-8">Start by adding your first clothing item</p>
                <button
                  onClick={handleUploadClick}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                >
                  <Plus size={20} />
                  <span>Add Your First Item</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={handleUploadClick}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-110 flex items-center justify-center group z-40"
      >
        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Upload Dialog */}
      {uploadDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Upload size={24} />
                  </div>
                  <h2 className="text-xl font-semibold">Upload New Clothes</h2>
                </div>
                <button
                  onClick={() => {
                    uploadForm.imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
                    setUploadDialogOpen(false);
                    setUploadForm({ 
                      name: '', 
                      category: 'top', 
                      occasion: 'casual',
                      color: 'Black',
                      images: [], 
                      imagePreviews: [] 
                    });
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clothing Name/Type *
                  </label>
                  <input
                    type="text"
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., T-shirt, Jeans, Sneakers"
                    required
                  />
                </div>

                {/* Category and Occasion */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ 
                        ...uploadForm, 
                        category: e.target.value as 'top' | 'bottom' | 'shoes' 
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="top">👕 Top</option>
                      <option value="bottom">👖 Bottom</option>
                      <option value="shoes">👟 Shoes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion/Type *
                    </label>
                    <select
                      value={uploadForm.occasion}
                      onChange={(e) => setUploadForm({ 
                        ...uploadForm, 
                        occasion: e.target.value as OccasionType 
                      })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="casual">😎 Casual</option>
                      <option value="formal">💼 Formal</option>
                      <option value="semiFormal">✨ Semi-Formal</option>
                      <option value="daily">📅 Daily</option>
                    </select>
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color *
                  </label>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowColorDropdown(!showColorDropdown)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                          style={{ backgroundColor: getHexForColorName(uploadForm.color) }}
                        />
                        <span className="font-medium">{uploadForm.color}</span>
                      </div>
                      <ChevronDown size={20} className={`transform transition-transform ${showColorDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showColorDropdown && (
                      <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-96 overflow-hidden animate-slideDown">
                        {/* Search */}
                        <div className="p-3 border-b">
                          <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search colors..."
                              value={colorSearchTerm}
                              onChange={(e) => setColorSearchTerm(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        
                        {/* Category Filters */}
                        <div className="flex gap-1 p-3 border-b overflow-x-auto">
                          {['all', 'light', 'dark', 'bright', 'neutral'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedColorCategory(cat === 'all' ? null : cat)}
                              className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
                                (cat === 'all' && selectedColorCategory === null) || selectedColorCategory === cat
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                          ))}
                        </div>

                        {/* Color Grid */}
                        <div className="p-3 grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                          {filteredColors.map((color) => (
                            <button
                              key={color.name}
                              type="button"
                              onClick={() => {
                                setUploadForm({ ...uploadForm, color: color.name });
                                setShowColorDropdown(false);
                                setColorSearchTerm('');
                                setSelectedColorCategory(null);
                              }}
                              className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${
                                uploadForm.color === color.name 
                                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div 
                                className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-sm"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="text-xs font-medium text-center">
                                {color.emoji} {color.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images *
                  </label>
                  <label className="flex flex-col items-center justify-center gap-3 w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 cursor-pointer transition-colors bg-gray-50 hover:bg-blue-50 group">
                    <div className="p-4 bg-white rounded-full shadow-md group-hover:scale-110 transition-transform">
                      <ImageIcon size={32} className="text-blue-500" />
                    </div>
                    <span className="text-gray-600 font-medium">Click to select images</span>
                    <span className="text-xs text-gray-400">PNG, JPG, JPEG up to 10MB each (Max 10)</span>
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {/* Image Previews */}
                {uploadForm.imagePreviews.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Selected Images ({uploadForm.imagePreviews.length})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {uploadForm.imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-xl border-2 border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                          <p className="mt-2 text-xs text-gray-500 truncate">
                            {uploadForm.images[index].name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 p-6 bg-gray-50 rounded-b-2xl border-t">
              <button
                onClick={() => {
                  uploadForm.imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
                  setUploadDialogOpen(false);
                  setUploadForm({ 
                    name: '', 
                    category: 'top', 
                    occasion: 'casual',
                    color: 'Black',
                    images: [], 
                    imagePreviews: [] 
                  });
                }}
                className="px-6 py-3 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                disabled={uploading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Modal */}
      {showRecommendations && recommendations && !selectedOutfitCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl sticky top-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Outfit Recommendations</h2>
                    <p className="text-sm opacity-90">Random outfits from your wardrobe</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRegenerateRecommendations}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    title="Generate new recommendations"
                  >
                    <RefreshCw size={20} />
                  </button>
                  <button
                    onClick={closeRecommendations}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6 flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" />
                Click on any outfit to view detailed recommendations
              </p>
              
              {Object.values(recommendations).some(outfit => outfit !== null) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.formal && (
                    <RecommendationCard category="formal" outfit={recommendations.formal} />
                  )}
                  {recommendations.semiFormal && (
                    <RecommendationCard category="semiFormal" outfit={recommendations.semiFormal} />
                  )}
                  {recommendations.casual && (
                    <RecommendationCard category="casual" outfit={recommendations.casual} />
                  )}
                  {recommendations.daily && (
                    <RecommendationCard category="daily" outfit={recommendations.daily} />
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                    <Sparkles size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No recommendations available</p>
                  <p className="text-gray-400 text-sm mt-2">
                    You need at least one top, bottom, and shoes to generate recommendations
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Outfit Detail Modal */}
      {selectedOutfitCategory && recommendations && recommendations[selectedOutfitCategory] && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <OutfitDetailView 
            category={selectedOutfitCategory} 
            outfit={recommendations[selectedOutfitCategory]} 
          />
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${
          snackbar.type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'
        } text-white z-50 animate-slideUp`}>
          {snackbar.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span className="font-medium">{snackbar.message}</span>
        </div>
      )}

      {/* Add custom CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomePage;