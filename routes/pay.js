const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51MbR9WAMHww00EIPxQdlybjWqnb3RkSl5pjPVvXuLXZsb4uLzAjdDLuYohmAgZmXCkqNrRWYvO8LAE2iRM32eNbS003A8FxABW");
const router = express.Router();

router.post("/pay", async (req, res) => {

    const stripeToken = req.body.stripeToken;

    const response = await stripe.charges.create({
        amount: 2000,
        currency: "eur",
        description: "La description de l'objet acheté",

        source: stripeToken,
    });
    console.log(response.status);


    res.json(response);
});

module.exports = router;