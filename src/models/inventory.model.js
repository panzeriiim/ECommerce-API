const { Schema, model } = require('mongoose');

const inventorySchema = new Schema(
  {
    productId: Schema.Types.ObjectId,
    quantity: Number,
  },
  { timestamps: true }
);

module.exports = model('Inventory', inventorySchema);
