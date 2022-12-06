const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserbyID } = require("../controllers/user");
const {
    getProductbyID,
    createProduct,
    getProduct,
    photo,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getAllUniqueCategories,
} = require("../controllers/product");

router.param("userid", getUserbyID);
router.param("productid", getProductbyID);

//something routes
router.post(
    "/product/create/:userid",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createProduct,
);

//read routes
router.get("/product/:productid", getProduct);
router.get("/product/photo/:productid", photo);

//delete routes
router.delete(
    "/product/:userid/:productid",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteProduct,
);

//updates routes
router.put(
    "/product/:userid/:productid",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct,
);

router.get("/products", getAllProducts);
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
