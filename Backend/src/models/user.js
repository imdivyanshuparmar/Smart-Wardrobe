const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    emailId: {
       type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase:true,
        immutable: true,
    },

    password: {
      type: String,
      required: true
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other"
    },

    height: {
      type: Number
    },

    bodyType: {
      type: String,
      enum: ["Athletic", "Slim", "Heavy"]
    },

    skinTone: {
      type: String,
      enum: ["Fair","Wheatish","dark"]
    },

    // avatarSettings: {
    //   skinColor: String,
    //   bodyShape: String,
    //   hairStyle: String
    // },

    // clothes: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Clothing"
    //   }
    // ],

  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);