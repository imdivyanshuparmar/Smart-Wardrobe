const Clothing = require("../models/Clothing");

const fetchWardrobe = async (userId) => {
  const clothes = await Clothing.find({ userId }).select(
    "_id name category imageUrl dominantColor laundry"
  );

  const tops = [];
  const bottoms = [];
  const shoes = [];

  clothes.forEach((item) => {
    const cloth = {
      id: item._id.toString(),
      type: item.name,
      color: item.dominantColor,
      imageUrl: item.imageUrl,
      laundry: item.laundry ?? false
    };

    const category = (item.category || "").toLowerCase();

    if (category === "top") tops.push(cloth);
    if (category === "bottom") bottoms.push(cloth);
    if (category === "shoes") shoes.push(cloth);
  });

  // console.log("Fetched wardrobe:", { tops: tops.length, bottoms: bottoms.length, shoes: shoes.length });

  return { tops, bottoms, shoes };
};

module.exports = fetchWardrobe;
