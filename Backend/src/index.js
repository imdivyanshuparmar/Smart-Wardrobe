const express = require('express')
const app = express();
require('dotenv').config();
const cookieParser =  require('cookie-parser');
const main =  require('./config/db')
const detectColor = require("./controllers/detectColor");
const authRouter = require("./routes/userAuth")
const cors = require('cors');
const Uploadrouter = require("./controllers/clothingRoutes");
const userMiddleware = require("./middleware/userMiddleware")
const Wardroberouter = require("./routes/wardrobeRouter");
const outfitRouter = require("./controllers/outfitrecommendation")
const outfitrecommendation = require("./controllers/outfitrecommendation");
const Laundaryrouter = require("./controllers/updateLaundry");
const Buyrouter = require("./routes/buyRoute");
app.use(cors({ 
    origin: 'http://localhost:3000',
    credentials: true 
}))
app.use(express.json());
app.use(cookieParser());
app.use("/user",authRouter)
app.use("/cloth",Uploadrouter);
app.use("/wardrobe",Wardroberouter);
app.use("/outfit",outfitRouter);
app.use("/buy",Buyrouter)
app.use("/update",Laundaryrouter)
app.use("/re",outfitrecommendation);
app.use("/detect-color",userMiddleware,detectColor);
const InitalizeConnection = async ()=>{
    try{

        await Promise.all([main()]);
        console.log("DB Connected");
        
        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })

    }
    catch(err){
        console.log("Error: "+err);
    }
}


InitalizeConnection();

