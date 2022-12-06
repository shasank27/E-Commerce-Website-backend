const express = require("express");
const router = express.Router();
const { getUserbyID } = require("../controllers/user");
const {
    getCategorybyID,
    createCategory,
    getAllCategory,
    getCategory,
    updateCategory,
    removeCategory,
} = require("../controllers/category");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userid", getUserbyID);
router.param("categoryid", getCategorybyID);

router.post(
    "/category/create/:userid",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createCategory,
);

//read
router.get("/category/:categoryid", getCategory);
router.get("/categories", getAllCategory);

//delete
router.put(
    "/category/:categoryid/:userid",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory,
);

router.delete(
    "/category/:categoryid/:userid",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    removeCategory,
);

module.exports = router;
