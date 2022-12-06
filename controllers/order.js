const { ProductCart, Order } = require("../models/order");

exports.getOrderbyID = (req, res, next, id) => {
    Order.populate("products.product", "name price")
        .findById(id)
        .exec((err, obj) => {
            if (err) {
                return res
                    .status(400)
                    .json({ error: "Couldn't find the order" });
            }
            req.order = obj;
            return res.json(obj);
        });
    next();
};

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, obj) => {
        if (err) {
            res.status(400).json({ error: "Couldn't place your order" });
        }
        res.json(obj);
    });
};

exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name")
        .exec((err, objs) => {
            if (err) {
                return res
                    .status(400)
                    .json({ error: "Couldn't get any orders" });
            }
            res.json({ objs });
        });
};

exports.getOrderStatus = (req, res) => {
    return res.json(Order.schema.path("status").enumValues);
};
exports.updateOrderStatus = (req, res) => {
    Order.update(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res
                    .status(400)
                    .json({ error: "Couldn't get any orders" });
            }
            res.json(order);
        },
    );
};
