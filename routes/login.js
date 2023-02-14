const express = require("express");
const router = express.Router();
const User = require("../models/User")

const uid2 = require("uid2"); // Package qui sert à créer des string aléatoires
const SHA256 = require("crypto-js/sha256"); // Sert à encripter une string
const encBase64 = require("crypto-js/enc-base64"); // Sert à transformer l'encryptage en string

router.post("/user/login", async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        const userLogin = await User.findOne({
            email: email
        })

        if (!userLogin) {
            res.status(401).json({
                message: "User not found"
            })
        }



        const hash2 = SHA256(userLogin.salt + password).toString(encBase64);

        if (hash2 === userLogin.hash) {
            res.json(userLogin);
        } else {
            res.json(undefined);
        }

    } catch (error) {
        res.json({
            error: error.message
        })

    }


});

module.exports = router;