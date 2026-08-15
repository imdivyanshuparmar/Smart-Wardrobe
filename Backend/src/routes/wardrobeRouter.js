const express = require("express");
const Wardroberouter = express.Router();

const userMiddleware = require("../middleware/userMiddleware");

const {getWardrobe,deleteWardrobe} = require("../controllers/Wardrobe");

Wardroberouter.get("/Allwardrobe", userMiddleware, getWardrobe);
Wardroberouter.delete("/deletewardrobe/:id", userMiddleware, deleteWardrobe);

module.exports = Wardroberouter;