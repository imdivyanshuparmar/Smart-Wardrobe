const mongoose = require("mongoose");

const clothingSchema = new mongoose.Schema(
{
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  name:{
    type:String,
    required:true
  },

  category:{
    type:String,
    enum:["top","bottom","shoes"]
  },

  occasion:{
    type:String,
    enum:["casual","formal","semi-formal","daily"],
    default:"casual"
  },

  imageUrl:{
    type:String
  },

  selectedColor:{
    type:String   // color from frontend (#000000 etc)
  },

  dominantColor:{
    type:String
  },

  colors:[
    {
      color:String,
      percentage:Number
    }
  ],

  // NEW FIELD
  laundry:{
    type:Boolean,
    default:false
  }

},
{timestamps:true}
);

module.exports = mongoose.model("Clothing",clothingSchema);
