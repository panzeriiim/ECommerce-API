const Inventory = require('../models/inventory.model');
const Product = require('../models/product.model');
const AppError = require('../errors/appError');
const asyncWrapper = require('../utils/asyncWrapper');

exports.getAllInventories = asyncWrapper(async (req, res) => {
  const Inventorys = await Inventory.find();
  res.json({
    status: 'success',
    Inventorys,
  });
});
exports.getAnInventory = asyncWrapper(async (req, res) => {
  const result = await Inventory.find({ productId: req.params.id });
  res.json({
    status: 'success',
    Inventory: result,
  });
});
exports.addProductToInventory = asyncWrapper(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const existProd = await Product.findById(productId);
  if (!existProd)
    return next(
      new AppError(
        'Can not add this product to inventory. This product have not created yet',
        400
      )
    );
  const existInventory = await Inventory.findOne({ productId });
  if (existInventory) {
    existInventory.quantity += quantity;
    await existInventory.save();
    res.status(200).json({
      status: 'success',
      Inventory: existInventory,
    });
  } else {
    const newInventory = await Inventory.create({ productId, quantity });
    res.status(201).json({
      status: 'success',
      Inventory: newInventory,
    });
  }
});
exports.createInventory = asyncWrapper(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const newInventory = await Inventory.create({ productId, quantity });
  res.status(201).json({
    status: 'success',
    Inventory: newInventory,
  });
});
exports.deleteInventoryById = asyncWrapper(async (req, res, next) => {
  const deletedInventory = await Inventory.findByIdAndDelete(req.params.id);
  res.json({
    status: 'success',
    deletedInventory,
  });
});
exports.updateInventoryById = asyncWrapper(async (req, res) => {
  const updatedInventory = await Inventory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.json({
    status: 'success',
    updatedInventory,
  });
});
