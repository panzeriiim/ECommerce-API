const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    brand: String,
    code: String,
    price: Number,
    description: String,
    releaseDate: Date,
    weight_g: Number,
    specs: [
      {
        key: String,
        value: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
