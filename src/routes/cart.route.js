const express = require('express');
const { autheticate } = require('../controllers/auth.controller');
const {
  addToCart,
  deleteCartById,
  getAllCarts,
  updateCartById,
} = require('../controllers/cart.controller');

const cartRouter = express.Router();

cartRouter.get('/cart', autheticate, getAllCarts);
cartRouter.post('/cart', autheticate, addToCart);
cartRouter.patch('/cart/:id', autheticate, updateCartById);
cartRouter.delete('/cart/:id', autheticate, deleteCartById);

module.exports = cartRouter;
