require("dotenv").config();
const Order = require("../models/OrderSchema");
const Product = require("../models/ProductSchema");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    const owner_id = req.user.id;
    let orders = await Order.find({ owner_id });

    if (orders == "") {
        res.status(200).json({ Note: "No orders to show" });
    } else if (orders) {
        let myPromise = new Promise(async (resolve) => {
            let allOrders = [];
            //   console.log(orders);
            //   orders.forEach( async (order) => {
            for (x in orders) {
                let product_id = x.product_id;
                const product = await Product.findOne({ product_id });
                allOrders.push(product);
            }
            //   console.log("After async" + allOrders);
            resolve(allOrders);
        });

        myPromise
            .then((allOrders) => {
                res.status(200).json({ allOrders });
                // console.log("in resolve" + allOrders + "  end");
            })
            .catch((error) => {
                console.log(`Handling error as we received ${error}`);
                res.status(400).json({ err: error });
            });
    } else {
        res.status(400).json({ err: "Unable to get orders" });
    }
});

router.post("/new", async (req, res) => {
    const { product_id } = req.body;

    const owner_id = req.user.id;

    let order = await Order.findOne({ product_id });

    if (order) {
        return res
            .status(400)
            .json({ Note: "Product is already in your cart" });
    }

    const newOrder = new Order({
        product_id,
        owner_id,
    });

    const savedProduct = await newOrder.save();

    if (savedProduct) {
        res.status(200).json({ Status: "Saved successfully", savedProduct });
    } else {
        res.status(400).json({ err: "Unable to add new product" });
    }
});

//delete order
router.delete("/delete", checkAuth, async (req, res) => {
    const { product_id } = req.body;
    const owner_id = req.user.id;
    const order = await Order.findOne({ product_id });
    if (order.owner_id == owner_id) {
        Order.deleteOne({ product_id })
            .then(() => {
                res.status(200).json({ Note: "Deleted Successfully" });
            })
            .catch((err) => {
                res.status(400).json({ err: "Unable to delete order", err });
            });
    }  else {
        res.status(400).json({ err: "Order does not belongs to you" });
    }
});

module.exports = router;
