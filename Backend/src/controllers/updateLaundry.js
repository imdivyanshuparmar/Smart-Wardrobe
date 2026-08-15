const express = require("express");
const Laundaryrouter = express.Router();

const Clothing = require("../models/Clothing");
const userMiddleware = require("../middleware/userMiddleware");

// Update laundry status
Laundaryrouter.patch("/laundry/:id", userMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { laundry } = req.body;

    if (typeof laundry !== "boolean") {
      return res.status(400).json({
        message: "Laundry value must be true or false",
      });
    }

    const item = await Clothing.findByIdAndUpdate(
      id,
      { laundry: laundry },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        message: "Clothing item not found",
      });
    }

    res.status(200).json({
      message: "Laundry status updated successfully",
      item,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = Laundaryrouter;
