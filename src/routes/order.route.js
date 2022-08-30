const express = require('express');
const { autheticate } = require('../controllers/auth.controller');
const {
  placeOrder,
  cancelOrder,
  getAllOrders,
  updateOrderById,
} = require('../controllers/order.controller');

const orderRouter = express.Router();

orderRouter.get('/order', autheticate, getAllOrders);
orderRouter.post('/order', autheticate, placeOrder);
orderRouter.patch('/order/:id', autheticate, updateOrderById);
orderRouter.patch('/order/cancel/:id', autheticate, cancelOrder);
//orderRouter.delete('/order/:id', autheticate, deleteOrderById);

module.exports = orderRouter;
