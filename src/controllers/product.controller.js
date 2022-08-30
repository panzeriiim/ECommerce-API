const Product = require('../models/product.model');
const asyncWrapper = require('../utils/asyncWrapper');

exports.getAllProducts = asyncWrapper(async (req, res) => {
  const products = await Product.find();
  res.json({
    status: 'success',
    products,
  });
});
exports.addProduct = asyncWrapper(async (req, res) => {
  const newProd = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    product: newProd,
  });
});
exports.deleteProductById = asyncWrapper(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: 'success',
    deletedProduct,
  });
});
exports.updateProductById = asyncWrapper(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.json({
    status: 'success',
    updatedProduct,
  });
});
