const express = require('express');
const authRouter =  express.Router();
const {register, login} = require('../controllers/userAuthent');
const userMiddleware = require("../middleware/userMiddleware");

// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
// authRouter.post('/logout', userMiddleware, logout);

authRouter.get('/check',userMiddleware,(req,res)=>{

    const reply = {
        name: req.result.name,
        emailId: req.result.emailId,
        _id:req.result._id,
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})
module.exports = authRouter;

