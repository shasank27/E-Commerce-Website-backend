const express = require("express");
const router = express.Router();
const { getUserbyID, pushOrderInPurchaseList } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
    getOrderbyID,
    createOrder,
    getAllOrders,
    getOrderStatus,
    updateOrderStatus,
} = require("../controllers/order");
const { updateStock } = require("../controllers/product");

//param
router.param("/userid", getUserbyID);
router.param("/orderid", getOrderbyID);

//routes
router.post(
    "/order/create/:userid",
    isSignedIn,
    isAuthenticated,
    pushOrderInPurchaseList,
    updateStock,
    createOrder,
);

router.post(
    "/order/all/:userid",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    getAllOrders,
);

//get
router.get(
    "/order/status/:userid",
    isSignedIn,
    isAuthenticated,
    getOrderStatus,
);
router.put(
    "/order/:orderid/status/:userid",
    isSignedIn,
    isAuthenticated,
    updateOrderStatus,
);

module.exports = router;
