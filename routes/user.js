const express = require("express");
const router = express.Router();
const {
    getUserbyID,
    getUser,
    getAllUser,
    updateUser,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userid", getUserbyID);

router.get("/user/:userid", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userid", isSignedIn, isAuthenticated, updateUser);
// router.post("/user/getAllUsers", getAllUser);

module.exports = router;
