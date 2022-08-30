const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    cartId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    status: {
      type: String,
      default: 'pending',
    },
    productList: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
      },
    ],
    payment: Object,
    shippingAddress: {
      country: String,
      city: String,
      district: String,
      houseAddress: String,
      zipCode: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
