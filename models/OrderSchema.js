const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
    {
        owner_id: {
            type: String,
            required: true,
        },
        product_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
