const Clothing = require("../models/Clothing");

const fetchWardrobe = require("../controllers/wardrobeService");

const getWardrobe = async (req, res) => {
  try {

    const userId = req.result._id;

    const wardrobe = await fetchWardrobe(userId);

    if (
      wardrobe.tops.length === 0 &&
      wardrobe.bottoms.length === 0 &&
      wardrobe.shoes.length === 0
    ) {
      return res.json({
        message: "No clothes found",
        data: wardrobe
      });
    }

    res.json({
      message: "Wardrobe fetched successfully",
      data: wardrobe
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteWardrobe = async (req, res) => {
  try {

    const { id } = req.params;
    const userId = req.result._id;

    const cloth = await Clothing.findOneAndDelete({
      _id: id,
      userId: userId
    });

    if (!cloth) {
      return res.status(404).json({
        message: "Clothing item not found"
      });
    }

    res.json({
      message: "Clothing deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {getWardrobe,deleteWardrobe};