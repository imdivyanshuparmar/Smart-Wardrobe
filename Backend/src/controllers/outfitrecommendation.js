const express = require("express");
const outfitrecommendation = express.Router();
const axios = require("axios");
const User = require("../models/user");
const userMiddleware = require("../middleware/userMiddleware");
const fetchWardrobe = require("../controllers/wardrobeService");


outfitrecommendation.get(
  "/recommend-outfits",
  userMiddleware,
  async (req, res) => {
    try {
      const userId = req.result._id;

      // 1️⃣ Fetch full user details from User collection
      const user = await User.findById(userId).select("skinTone"); // assuming User model is imported

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // 2️⃣ Fetch wardrobe from MongoDB
      const wardrobe = await fetchWardrobe(userId);

      console.log("User Skin Tone Sent To Python:", user.skinTone);
      console.log("Wardrobe Sent To Python:", wardrobe);


      // 3️⃣ Send data to Python FastAPI
      const response = await axios.post(
        "http://127.0.0.1:8000/recommend",
        {
          user: {
            skinTone: user.skinTone // send skinTone along
          },
          wardrobe: wardrobe
        }
      );

      res.json(response.data);

    } catch (error) {
      console.error(
        "Recommendation Error:",
        error.response?.data || error.message
      );

      res.status(500).json({
        error: "Failed to get outfit recommendation"
      });
    }
  }
);

module.exports = outfitrecommendation;
