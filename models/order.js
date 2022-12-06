const mongoose = require("mongoose");
const { stringify } = require("uuid");
const { ObjectId } = mongoose.Schema;

const productCartSchema = mongoose.Schema(
    {
        product: {
            type: ObjectId,
            ref: "Product",
        },
        name: {
            type: String,
        },
        count: {
            type: Number,
        },
        price: {
            type: Number,
        },
    },
    {
        timestamps: true,
    },
);

const ProductCart = mongoose.model("ProductCart", productCartSchema);

const orderSchema = mongoose.Schema(
    {
        products: [productCartSchema],
        transactionid: {},
        amount: {
            type: Number,
        },
        address: String,
        status: {
            type: String,
            default: "Recieved",
            enum: ["Processed, Received, Delivered, Cancelled, Shipped"],
        },
        updated: Date,
        user: {
            type: ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    },
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { ProductCart, Order };
