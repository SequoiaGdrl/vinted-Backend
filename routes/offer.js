const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const Offer = require("../models/Offer");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const convertToBase64 = (file) => {
    return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
}

router.post("/offer/publish", fileUpload(), isAuthenticated, async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            brand,
            size,
            condition,
            color,
            city
        } = req.body

        const tabDetail = [{
                brand
            },
            {
                size
            },
            {
                condition
            },
            {
                color
            },
            {
                city
            }
        ]


        const imgUpload = await cloudinary.uploader.upload(
            convertToBase64(req.files.picture), {
                folder: "/vinted/offers",
            }
        );
        if (title.length > 50) {
            return res.json({
                message: "error : this name has too much characters"
            })
        };

        if (description.length > 500) {
            return res.json({
                message: "error : this description has too much characters "
            });

        };

        if (price > 10000) {
            return res.json({
                message: "error : this price is too much expensive"
            })
        }



        const newOffer = new Offer({
            product_name: title,
            product_description: description,
            product_price: price,
            product_details: tabDetail,
            product_image: imgUpload,
            owner: req.user

        });
        await newOffer.save();
        res.json(newOffer)







    } catch (error) {
        res.status(400).json({
            error: error.message
        })

    }

});

router.delete("/offer/delete", async (req, res) => {
    try {

        await Offer.findByIdAndDelete(req.query.id);

        res.json({
            message: "this offer has been deleted"
        })

    } catch (error) {
        res.status(400).json({
            error: error.message
        })

    }

});

router.get("/offers", async (req, res) => {

    try {



        const {
            title,
            priceMin,
            priceMax,
            sort,
            page
        } = req.query;

        const filters = {}

        if (title) {
            filters.product_name = title
        };

        if (priceMin && priceMax) {
            filters.product_price = {
                $gte: priceMin,
                $lte: priceMax
            }
        } else if (priceMax) {
            filters.product_price = {
                $lte: Number(priceMax)
            }
        } else if (priceMin) {
            filters.product_price = {
                $gte: Number(priceMin)
            }
        };

        let order = 0;
        if (sort === "price_desc") {
            order = -1
        };
        if (sort === "price_asc") {
            order = 1
        };

        const nbOfferPerPage = 1;
        let pageRequire = 1

        if (page) {
            pageRequire = Number(page)
        };

        const skip = (pageRequire - 1) * nbOfferPerPage;

        const offers = await Offer.find(filters).sort({
            product_price: order
        }).skip(skip).limit(nbOfferPerPage).populate("owner", "account");

        const count = await Offer.countDocuments(filters);

        const response = {
            count: count,
            offers: offers
        };


        res.json(response);

    } catch (error) {
        res.status(400).json({
            error: error.message
        })

    }

});

router.get("/offer/:id", async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id).populate("owner", "account")

        res.json(
            offer
        );

    } catch (error) {
        res.status(400).json({
            error: error.message
        })

    };
});


module.exports = router;