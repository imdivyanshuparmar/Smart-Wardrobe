// recommendationService.js

const skinToneColorMap = {
  fair: {
    tops: ["pastel blue", "soft pink", "lavender", "navy", "emerald", "baby blue"],
    bottoms: ["dark wash denim", "charcoal", "olive", "burgundy", "black"],
    shoes: ["tan", "brown", "black", "nude", "white"],
    tips: [
      "Pastel shades and soft colors complement fair skin beautifully",
      "Avoid very light colors that can wash you out",
      "Jewel tones like emerald and sapphire create stunning contrast"
    ]
  },
  whitish: {
    tops: ["coral", "turquoise", "olive green", "mustard", "teal", "burgundy"],
    bottoms: ["khaki", "brown", "beige", "forest green", "navy"],
    shoes: ["brown", "tan", "black", "olive", "navy"],
    tips: [
      "Warm earth tones and rich browns look great on whitish skin",
      "Bold colors like coral and turquoise pop beautifully",
      "Olive green and mustard yellow are your go-to colors"
    ]
  },
  dark: {
    tops: ["white", "royal blue", "magenta", "yellow", "emerald", "red", "purple"],
    bottoms: ["light wash denim", "gray", "cream", "burgundy", "black"],
    shoes: ["white", "black", "bright colors", "metallic", "red"],
    tips: [
      "Bright, vibrant colors create amazing contrast",
      "White and pastels look stunning on darker skin tones",
      "Royal blue, magenta, and emerald green are perfect choices"
    ]
  }
};

const generateBuyLinks = (category, color, style) => {
  const searchQuery = encodeURIComponent(`${color} ${style} ${category}`);
  
  return {
    amazon: `https://www.amazon.in/s?k=${searchQuery}`,
    myntra: `https://www.myntra.com/${category}?rawQuery=${searchQuery}`,
    flipkart: `https://www.flipkart.com/search?q=${searchQuery}`,
    ajio: `https://www.ajio.com/search/?text=${searchQuery}`,
    tatacliq: `https://www.tatacliq.com/search/?searchCategory=all&text=${searchQuery}`,
    // Add more e-commerce sites
    meesho: `https://www.meesho.com/search?q=${searchQuery}`,
    snapdeal: `https://www.snapdeal.com/search?keyword=${searchQuery}`
  };
};

const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRecommendationsBySkinTone = (skinTone, wardrobe = {}) => {
  // Normalize skin tone input
  let normalizedTone = skinTone?.toLowerCase() || "fair";
  
  // Map variations to our three categories
  if (normalizedTone.includes("white") || normalizedTone === "whitish") {
    normalizedTone = "whitish";
  } else if (normalizedTone.includes("dark") || normalizedTone === "dark") {
    normalizedTone = "dark";
  } else {
    normalizedTone = "fair"; // default to fair
  }

  const colorMap = skinToneColorMap[normalizedTone];

  // Analyze existing wardrobe to suggest complementary items
  const existingColors = {
    tops: wardrobe.tops?.map(item => item.color?.toLowerCase()) || [],
    bottoms: wardrobe.bottoms?.map(item => item.color?.toLowerCase()) || [],
    shoes: wardrobe.shoes?.map(item => item.color?.toLowerCase()) || []
  };

  const recommendations = [];

  // Top recommendations - suggest colors not already in wardrobe
  const availableTopColors = colorMap.tops.filter(
    color => !existingColors.tops.some(existing => color.includes(existing))
  );
  
  recommendations.push({
    category: "tops",
    color: getRandomItem(availableTopColors.length > 0 ? availableTopColors : colorMap.tops),
    style: getRandomItem(["casual", "formal", "party wear", "traditional"]),
    reason: `This ${normalizedTone === 'fair' ? 'soft' : normalizedTone === 'whitish' ? 'warm' : 'vibrant'} color complements your ${normalizedTone} skin tone beautifully`,
    matchScore: 0.95,
    buyLinks: generateBuyLinks("tops", colorMap.tops[0], "trendy")
  });

  // Bottom recommendations
  const availableBottomColors = colorMap.bottoms.filter(
    color => !existingColors.bottoms.some(existing => color.includes(existing))
  );

  recommendations.push({
    category: "bottoms",
    color: getRandomItem(availableBottomColors.length > 0 ? availableBottomColors : colorMap.bottoms),
    style: getRandomItem(["jeans", "trousers", "chinos", "shorts"]),
    reason: `Creates perfect balance with your ${normalizedTone} complexion`,
    matchScore: 0.92,
    buyLinks: generateBuyLinks("bottoms", colorMap.bottoms[0], "comfortable")
  });

  // Shoe recommendations
  const availableShoeColors = colorMap.shoes.filter(
    color => !existingColors.shoes.some(existing => color.includes(existing))
  );

  recommendations.push({
    category: "shoes",
    color: getRandomItem(availableShoeColors.length > 0 ? availableShoeColors : colorMap.shoes),
    style: getRandomItem(["sneakers", "formal shoes", "sandals", "loafers"]),
    reason: `Completes your look perfectly for ${normalizedTone} skin tone`,
    matchScore: 0.88,
    buyLinks: generateBuyLinks("shoes", colorMap.shoes[0], "comfortable")
  });

  return recommendations;
};

module.exports = {
  getRecommendationsBySkinTone,
  skinToneColorMap
};