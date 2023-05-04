const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        owner: {
            type: String,
            required: false,
        },
        owner_id: {
            type: String,
            required: false,
        },
        price: {
            type: String,
            required: false,
        },
        tags: {
            type: String,
            required: false,
        },
        photo: {
            url: [String],
            required: false,
        },
        isScrap: {
            type: Boolean,
            required: false,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
