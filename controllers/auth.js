const User = require("../models/user");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()[0].msg + errors.array()[0].param,
    });
  }
  var user = new User(req.body);
  user.save((err, man) => {
    if (err) {
      res.status(400).json({
        err: JSON.stringify(err),
      });
    }
    // res.json(man); to send the whole response
    res.json({
      //to send partial response
      name: man.name,
      email: man.email,
      id: man._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()[0].msg + errors.array()[0].param,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      res.status(400).json({
        error: "USER doesn't exists",
      });
    }

    if (!user.authenticate(password)) {
      res.status(400).json({
        error: "EMAIL and PASSWORD doesn't match",
      });
    }

    var token = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 9999 });
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.send("Hello there, trying to signout? Cool");
};

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middlewares

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role == 0) {
    res.status(403).json({
      error: "NOT ALLOWED, ACCESS DENIED",
    });
  }
  next();
};
