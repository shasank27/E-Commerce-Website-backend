const express = require("express");
const router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check } = require("express-validator");

router.post(
    "/signup",
    [check("password").isLength({ min: 5 }), check("email").isEmail()],
    signup,
);

router.post(
    "/signin",
    [check("password").isLength({ min: 1 }), check("email").isEmail()],
    signin,
);

router.get("/signout", signout);

//test
router.get("/testroute", isSignedIn, (req, res) => {
    res.send("A protected route");
});

module.exports = router;
