const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      owner: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      tags: {
        type: String,
        required: true,
      },
      isScrap: {
        type: Boolean,
        required: true,
      },
    },
    { timestamps: true }
  );
  
  const Product = mongoose.model("Product", productSchema);
  
  module.exports = Product;