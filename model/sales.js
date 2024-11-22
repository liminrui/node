const mongoose = require('mongoose')
const Schema = mongoose.Schema

//_id: 1, year: 2017, item: "A", quantity: { "2017Q1": 500, "2017Q2": 500 }
const saleSchema = new Schema({
    _id: Number,
    year: Number,
    item: String,
    quantity: Object
})

const SaleModel = new mongoose.model('sale', saleSchema)

module.exports = SaleModel