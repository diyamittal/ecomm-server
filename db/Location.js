const mongoose = require("mongoose")

const locationSchema = new mongoose.Schema({
    Houseno: String,
    Steet: String,
    Landmark: String,
    City: String,
    State: String,
})

module.exports = mongoose.model("Location", locationSchema)