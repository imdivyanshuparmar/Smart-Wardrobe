const express = require("express");
const Buyrouter = express.Router();

const buyNewRecommendation = require("../controllers/buynew");
const userMiddleware = require("../middleware/userMiddleware");

Buyrouter.get("/buyrecom", userMiddleware, buyNewRecommendation);

module.exports = Buyrouter;
