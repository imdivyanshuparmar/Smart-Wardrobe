const axios = require("axios");

const userMiddleware = require("../middleware/userMiddleware");
const Clothing = require("../models/Clothing");
const detectColor = async (req,res)=>{
 try{

   const userId = req.result._id;

   const clothes = await Clothing.find({userId});

   if(clothes.length === 0){
      return res.json({message:"No clothes found"});
   }

   const results = [];

   for(const item of clothes){

      const response = await axios.post(
        "http://localhost:8000/detect-color",
        {imageUrl:item.imageUrl}
      );

      console.log(result)
      results.push({

        name:item.name,
        category:item.category,
        imageUrl:item.imageUrl,
        detectedColor:response.data

      });
      console.log(result)

   }

   res.json(results);

 }catch(err){

   res.status(500).json({error:err.message});

 }

}

module.exports = detectColor;