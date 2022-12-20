const express = require("express");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { processPayment, getToken } = require("../controllers/paypalPayment");
const { getUserbyID } = require("../controllers/user");
const router = express.Router();

router.param("userId", getUserbyID);

router.get(
  "/payment/paypal/gettoken/:userId",
  isSignedIn,
  isAuthenticated,
  getToken,
);

router.post(
  "/payment/paypal/:userId",
  isSignedIn,
  isAuthenticated,
  processPayment,
);

module.exports = router;
