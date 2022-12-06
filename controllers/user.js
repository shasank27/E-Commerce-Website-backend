const Order = require("../models/order");
var User = require("../models/user");

exports.getUserbyID = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            res.status(400).json({
                error: "Couldn't find the USER",
            });
        }
        req.profile = user;
        next();
    });
};

exports.getAllUser = (req, res) => {
    User.find({}, (err, obj) => {
        if (err) {
            return res.status(400).json({
                error: "Couldn't find any records",
            });
        }
        return res.send(obj);
    });
};

exports.getUser = (req, res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        (err, obj) => {
            if (err || !obj) {
                return res
                    .status(400)
                    .json({ error: "User couldn't be updates" });
            }
            res.send("User Updated");
        },
    );
};

exports.userPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate("user", "_id name")
        .exec((err, obj) => {
            if (err) {
                return res
                    .status(400)
                    .json({ error: "No records/orders found" });
            }
            return res.json(obj);
        });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = [];
    req.body.order.purchases.forEach(element => {
        purchases.push({
            _id: element._id,
            name: element.name,
            description: element.description,
            category: element.category,
            quantity: element.quantity,
            amount: req.body.order.amount,
            transaction: req.body.order.transaction_id,
        });
    });
    next();
};
