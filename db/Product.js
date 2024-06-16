const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    id: Number,
    image: String,
    title: String,
    category: String,
    userId: String,
    price: Number,
    totalprice: Number
})

module.exports = mongoose.model("Product", productSchema)