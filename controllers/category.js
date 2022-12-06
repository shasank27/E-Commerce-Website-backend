const Category = require("../models/category");

exports.getCategorybyID = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            res.status(400).json({
                error: "Couldn't find the CATEGORY",
            });
        }
        req.category = category;
        next();
    });
};

exports.createCategory = (req, res) => {
    var category = new Category(req.body);
    category.save((err, obj) => {
        if (err || !obj) {
            res.status(400).json({
                error: "Couldn't save into the DATABASE",
            });
        }
        res.send(obj);
    });
};

exports.getCategory = (req, res) => {
    return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
    Category.find({}, (err, obj) => {
        if (err) {
            return res.status(400).json({
                error: "Couldn't find any records",
            });
        }
        return res.json(obj);
    });
};

exports.updateCategory = (req, res) => {
    category = req.category;
    category.name = req.body.name;

    category.save((err, updatedObj) => {
        if (err || !updatedObj) {
            res.status(400).json({
                error: "Couldn't save into the DATABASE",
            });
        }
        res.send(updatedObj);
    });
};

exports.removeCategory = (req, res) => {
    category = req.category;

    category.remove((err, obj) => {
        if (err || !obj) {
            res.status(400).json({
                error: "Couldn't delete the category",
            });
        }
        res.send(`${obj.name} deleted`);
    });
};
