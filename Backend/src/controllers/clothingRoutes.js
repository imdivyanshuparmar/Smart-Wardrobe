const express = require("express");
const Uploadrouter = express.Router();

const upload = require("../middleware/upload");
const Clothing = require("../models/Clothing");
const userMiddleware = require("../middleware/userMiddleware");
const cloudinary = require("../config/cloudinary");

Uploadrouter.post(
  "/upload",
  userMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {

      const userId = req.result._id;
      const { name, category, occasion, color } = req.body;

      const clothes = [];

      for (const file of req.files) {

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          transformation: [
            {
              width: 400,
              height: 400,
              crop: "crop",
              gravity: "center"
            }
          ]
        });

        const imageUrl = result.secure_url;

        const cloth = {
          userId,
          name,
          category,
          occasion,
          dominantColor: color,   // color coming from frontend
          imageUrl,
          colors: []              // optional (empty)
        };

        clothes.push(cloth);
      }

      const savedClothes = await Clothing.insertMany(clothes);

      res.json({
        message: "Clothes uploaded successfully",
        data: savedClothes
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Upload failed",
        details: err.message
      });
    }
  }
);

module.exports = Uploadrouter;