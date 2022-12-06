const Product = require("../models/product");
const formidable = require("formidable");
const fs = require("fs");

exports.getProductbyID = (req, res, next, id) => {
    Product.populate("category")
        .findById(id)
        .exec((err, product) => {
            if (err || !product) {
                res.status(400).json({
                    error: "Couldn't find the USER",
                });
            }
            req.product = product;
            next();
        });
};

exports.createProduct = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res
                .status(400)
                .json({ error: "Couldn't store into the DB" });
        }

        const { name, description, price, category, stock } = fields;
        if (!name || !description || !price || !category || !stock) {
            return res
                .status(400)
                .json({ error: "All fields must be provided" });
        }

        let product = new Product(fields);

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({ error: "Size too big!" });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        product.save((err, obj) => {
            if (err || !obj) {
                res.status(400).json({
                    error: "Couldn't save into the DataBase",
                });
            }
            res.json(obj);
        });
    });
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.deleteProduct = (req, res) => {
    var product = req.product;
    product.remove((err, obj) => {
        if (err || !obj) {
            res.status(400).json({
                error: "Couldn't delete the product",
            });
        }
        res.send(obj);
    });
};

exports.updateProduct = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res
                .status(400)
                .json({ error: "Couldn't update into the DB" });
        }

        let product = req.product;
        product = _.extend(product, fields);

        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({ error: "Size too big!" });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        product.save((err, obj) => {
            if (err || !obj) {
                res.status(400).json({
                    error: "Couldn't update the product into the DataBase",
                });
            }
            res.json(obj);
        });
    });
};

exports.getAllProducts = (req, res) => {
    var limit = req.query.limit ? parseInt(req.query.limit) : 8;
    var sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
        .limit(limit)
        .populate("category")
        .sort([[sortBy, "asc"]])
        .select("-photo")
        .exec((err, obj) => {
            if (err) {
                return res.status(400).json({ error: "No products found" });
            }
            return res.json(obj);
        });
};

exports.updateStock = (req, res) => {
    let myOperations = req.body.order.product.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } },
            },
        };
    });
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res
                .status(400)
                .json({ error: "BulkWrite Operation failed" });
        }
        return products;
    });
};

exports.getAllUniqueCategories = (req, res) => {
    Product.unique("cataegory", {}, (err, obj) => {
        if (err) {
            return res
                .status(400)
                .json({ error: "Couldn't get any categories :(" });
        }
        return res.json(obj);
    });
};
