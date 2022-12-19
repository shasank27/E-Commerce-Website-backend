const express = require("express");
const { makePayment } = require("../controllers/stripePayment");
const router = express.Router();

router.post("/payment/stripe", makePayment);

module.exports = router;
