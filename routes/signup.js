const express = require("express");
const router = express.Router();
const User = require("../models/User")

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const convertToBase64 = (file) => {
    return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post("/user/signup", fileUpload(), async (req, res) => {
    try {

        const {
            username,
            email,
            password,
            newsletter
        } = req.body

        const salt = uid2(16);
        const hash = SHA256(salt + password).toString(encBase64);
        const token = uid2(16);
        console.log(email);
        if (!username) {
            return res.status(400).json({
                message: "error : username is not inform"
            })
        }


        const user = await User.findOne({
            email: email
        })

        if (user) {

            return res.status(400).json({
                message: "error : email already exist"
            })

        }

        const avatar = await cloudinary.uploader.upload(
            convertToBase64(req.files.avatar), {
                folder: "/vinted/users",
            })

        const newUser = new User({
            account: {
                username: username,
                avatar: avatar,
            },
            email: email,
            password: password,
            newsletter: newsletter,
            token: token,
            salt: salt,
            hash: hash
        });

        await newUser.save()


        const response = {
            account: newUser.account,
            newsletter: newUser.newsletter,
            token: newUser.token
        }
        res.json(response)

    } catch (error) {
        res.status(400).json({
            error: error.message
        })

    }

});

module.exports = router;