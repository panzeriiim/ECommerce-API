const { Schema, model } = require('mongoose');

const cartSchema = new Schema({
  userId: Schema.Types.ObjectId,
  productList: [
    {
      productId: Schema.Types.ObjectId,
      quantity: Number,
    },
  ],
  status: {
    type: String,
    default: 'active',
  },
});
module.exports = model('Cart', cartSchema);
