const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();
app.use(cors());
const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI);
app.use(express.json());
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase = require("crypto-js/enc-base64");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const offerRouter = require("./routes/offer");
const payRouter = require("./routes/pay");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dfq0pxmkj",
    api_key: "181681133975499",
    api_secret: "A2tjQnvaDLL1XJjnqGX2rOjGT7s",
    secure: true,

});

app.use(signupRouter)
app.use(loginRouter)
app.use(offerRouter)
app.use(payRouter)


app.get("/", (req, res) => {
    res.json({
        message: " ENFIIIINN"
    })
})

app.listen(process.env.PORT, () => {
    console.log("server has starded");

});