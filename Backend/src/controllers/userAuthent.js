const User =  require("../models/user")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const register = async (req, res) => {
  try {

    const { name, emailId, password, gender, height, bodyType, skinTone,  } = req.body;

    // 1️⃣ Check required fields
    if (!name || !emailId || !password) {
      return res.status(400).json({
        message: "Name, EmailId and Password are required"
      });
    }

    // 2️⃣ Check if email already exists
    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await User.create({
      name,
      emailId,
      password: hashedPassword,
      gender,
      height,
      bodyType,
      skinTone,
    });

    // 5️⃣ Create JWT token
    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    // 6️⃣ Safe response data
    const reply = {
      _id: user._id,
      name: user.name,
      emailId: user.emailId,
      gender: user.gender,
      height: user.height,
      bodyType: user.bodyType,
      skinTone: user.skinTone,
    };

    // 7️⃣ Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    });

    // 8️⃣ Send response
    res.status(201).json({
      user: reply,
      message: "User Registered Successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Server Error: " + err.message
    });
  }
};
const login = async (req,res)=>{

    try{
        const {emailId, password} = req.body;

        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({emailId});

        const match = await bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Invalid Credentials");

        const reply = {
            name: user.name,
            emailId: user.emailId,
            _id: user._id,
            role:user.role,
        }

        const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(201).json({
            user:reply,
            message:"Loggin Successfully"
        })
    }
    catch(err){
        res.status(401).send("Error: "+err);
    }
}
// logOut feature
// const logout = async(req,res)=>{

//     try{
//         const {token} = req.cookies;
//         const payload = jwt.decode(token);


//         await redisClient.set(`token:${token}`,'Blocked');
//         await redisClient.expireAt(`token:${token}`,payload.exp);
//     //    Token add kar dung Redis ke blockList
//     //    Cookies ko clear kar dena.....

//     res.cookie("token",null,{expires: new Date(Date.now())});
//     res.send("Logged Out Succesfully");

//     }
//     catch(err){
//        res.status(503).send("Error: "+err);
//     }
// }
// const deleteProfile = async(req,res)=>{
  
//     try{
//        const userId = req.result._id;
      
//     // userSchema delete
//     await User.findByIdAndDelete(userId);

//     // Submission se bhi delete karo...
    
//     // await Submission.deleteMany({userId});
    
//     res.status(200).send("Deleted Successfully");

//     }
//     catch(err){
      
//         res.status(500).send("Internal Server Error");
//     }
// }
module.exports = {register, login};
