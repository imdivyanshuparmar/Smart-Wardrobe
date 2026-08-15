const express = require("express");
const axios = require("axios");

const recommendation = express.Router();

app.use(express.json());


// API endpoint in Node
const fetchWardrobe = require("../controllers/wardrobeService");

recommendation .post(  "/recommend-outfits",
  userMiddleware,
  async (req, res) => {

    try {

      const userId = req.result._id;

      // get wardrobe
      const wardrobe = await fetchWardrobe(userId);

      // send wardrobe to FastAPI
      const response = await axios.post(
        "http://127.0.0.1:8000/recommend",
        wardrobe
      );

      res.json(response.data);

    } catch (error) {

      console.error(error.response?.data || error.message);

      res.status(500).json({
        error: "Failed to get outfit recommendation"
      });

    }

  }
);

module.exports = recommendation;