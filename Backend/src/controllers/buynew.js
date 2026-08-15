const axios = require("axios");
const User = require("../models/user");
const fetchWardrobe = require("../controllers/wardrobeService");



const buyNewRecommendation = async (req, res) => {
  try {
    const userId = req.result._id;

    // 1️⃣ Fetch wardrobe from DB
    const wardrobe = await fetchWardrobe(userId);

    // 2️⃣ Get user skin tone
    const user = await User.findById(userId).select("skinTone");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const skinTone = user.skinTone;

    // 3️⃣ Color suggestions based on skin tone
    const colorSuggestions = {
      fair: {
        tops: [
          { color: "Navy Blue", url: "https://www.amazon.in/s?k=navy+blue+tshirt+men" },
          { color: "Emerald Green", url: "https://www.amazon.in/s?k=emerald+green+shirt" }
        ],
        bottoms: [
          { color: "Black", url: "https://www.amazon.in/s?k=black+jeans+men" },
          { color: "Dark Blue", url: "https://www.amazon.in/s?k=dark+blue+jeans+men" }
        ],
        shoes: [
          { color: "White", url: "https://www.amazon.in/s?k=white+sneakers+men" },
          { color: "Brown", url: "https://www.amazon.in/s?k=brown+casual+shoes+men" }
        ]
      },

      medium: {
        tops: [
          { color: "Olive Green", url: "https://www.amazon.in/s?k=olive+green+tshirt+men" },
          { color: "Maroon", url: "https://www.amazon.in/s?k=maroon+shirt+men" }
        ],
        bottoms: [
          { color: "Beige", url: "https://www.amazon.in/s?k=beige+chinos+men" },
          { color: "Dark Grey", url: "https://www.amazon.in/s?k=dark+grey+pants+men" }
        ],
        shoes: [
          { color: "Tan", url: "https://www.amazon.in/s?k=tan+shoes+men" },
          { color: "White", url: "https://www.amazon.in/s?k=white+sneakers+men" }
        ]
      },

      dark: {
        tops: [
          { color: "Mustard Yellow", url: "https://www.amazon.in/s?k=mustard+yellow+tshirt+men" },
          { color: "Sky Blue", url: "https://www.amazon.in/s?k=sky+blue+shirt+men" }
        ],
        bottoms: [
          { color: "Light Grey", url: "https://www.amazon.in/s?k=light+grey+jeans+men" },
          { color: "Khaki", url: "https://www.amazon.in/s?k=khaki+pants+men" }
        ],
        shoes: [
          { color: "White", url: "https://www.amazon.in/s?k=white+sneakers+men" },
          { color: "Black", url: "https://www.amazon.in/s?k=black+casual+shoes+men" }
        ]
      }
    };

    const recommendations = colorSuggestions[skinTone] || {};

    // 4️⃣ Send response
    res.json({
      message: "Buy recommendations generated",
      skinTone,
      wardrobe,
      recommendations
    });

  } catch (error) {
    console.error("Buy recommendation error:", error.message);

    res.status(500).json({
      error: "Failed to generate recommendations"
    });
  }
};
module.exports = buyNewRecommendation;
