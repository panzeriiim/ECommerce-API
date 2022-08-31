const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Inventory = require('../models/inventory.model');
const asyncWrapper = require('../utils/asyncWrapper');
const AppError = require('../errors/appError');

exports.getAllOrders = asyncWrapper(async (req, res) => {
  const Orders = await Order.find();
  res.json({
    status: 'success',
    Orders,
  });
});
exports.placeOrder = asyncWrapper(async (req, res, next) => {
  const { id: userId } = req.user;
  const { cartId, productList } = req.body;
  const cart = await Cart.findById(cartId);
  const inventories = await Promise.all(
    productList.map((prod) => Inventory.findOne({ productId: prod.productId }))
  ); // get all inventories needed for the order
  const maxProductQuantity = process.env.MAX_PRODUCT_QUANTITY_PER_USER;
  inventories.forEach((inventory, index) => {
    if (productList[index].quantity > maxProductQuantity)
      throw new AppError(
        `Sorry! Each user only purchase up to ${maxProductQuantity}`,
        400
      );
    if (inventory.quantity < productList[index].quantity)
      throw new AppError(
        'Our product quantity is not enough for your purchase',
        400
      );
    inventory.quantity -= productList[index].quantity;
  });
  Promise.all(inventories.map((inv) => inv.save()));
  const newOrder = await Order.create({ ...req.body, userId });
  const cartUpdateProdList = cart.productList.filter((prod) => {
    const indexProd = productList.findIndex(
      (deleteProd) =>
        deleteProd.productId.toString() === prod.productId.toString() //loop through product list in user cart. Find if the current product is already added to the order or not
    );
    return indexProd === -1;  // if not we will keep it and filter will add it to cartUpdateProdList
  });
  cart.productList = cartUpdateProdList;
  req.user.orderList.push(newOrder.id);
  await req.user.save();
  await cart.save();
  res.status(201).json({
    status: 'success',
    Order: newOrder,
  });
});
exports.cancelOrder = asyncWrapper(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: orderId } = req.params;
  const deleteOrder = await Order.findOne({ userId, _id: orderId }); 
  if (!deleteOrder) return next(new AppError('the order is not exist', 404));
  const inventories = await Promise.all(
    deleteOrder.productList.map((prod) =>
      Inventory.findOne({ productId: prod.productId })
    )
  ); // get all inventories needed for cacel order process
  inventories.forEach((inventory, index) => {
    inventory.quantity += deleteOrder.productList[index].quantity;
  });
  deleteOrder.status = 'cancelled';
  await deleteOrder.save();
  Promise.all(inventories.map((inv) => inv.save()));
  res.json({
    status: 'success',
    deleteOrder,
  });
});
exports.updateOrderById = asyncWrapper(async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({
    status: 'success',
    updatedOrder,
  });
});
