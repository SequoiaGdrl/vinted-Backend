const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/Vinted");
app.use(express.json());
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase = require("crypto-js/enc-base64");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const offerRouter = require("./routes/offer");
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



app.listen(3000, () => {
    console.log("server has starded");

});