const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Inventory = require('../models/inventory.model');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../errors/appError');

exports.getAllCarts = asyncWrapper(async (req, res) => {
  const carts = await Cart.find();
  res.json({
    status: 'success',
    carts,
  });
});
exports.addToCart = asyncWrapper(async (req, res, next) => {
  const { id: userId } = req.user;
  const { productId, quantity } = req.body;
  if (!productId)
    return next(new AppError('There is no product selected', 400));
  const prod = await Product.findById(productId);
  if (!prod)
    return next(
      new AppError('Can not add to cart. This product is not exist', 400)
    );
  const prodInventory = await Inventory.findOne({ productId });
  if (quantity > prodInventory.quantity)
    return next(
      new AppError('our current stocks is not enough for your purchase', 400)
    );
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId });
  }
  const indexProd = cart.productList.findIndex(
    (el) => el.productId.toString() === productId
  );
  if (indexProd !== -1) {
    cart.productList[indexProd].quantity += quantity; // if product already in cart then we update the quantity in cart
  } else cart.productList.push({ productId, quantity });
  await cart.save();
  res.status(201).json({
    status: 'success',
    cart,
  });
});
exports.deleteCartById = asyncWrapper(async (req, res, next) => {
  const deletedCart = await Cart.findByIdAndDelete(req.params.id);
  res.json({
    status: 'success',
    deletedCart,
  });
});
exports.updateCartById = asyncWrapper(async (req, res) => {
  const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({
    status: 'success',
    updatedCart,
  });
});
