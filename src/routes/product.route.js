const express = require('express');
const { autheticate } = require('../controllers/auth.controller');
const {
  addProduct,
  deleteProductById,
  getAllProducts,
  updateProductById,
} = require('../controllers/product.controller');

const productRouter = express.Router();

productRouter.get('/product', autheticate, getAllProducts);
productRouter.post('/product', autheticate, addProduct);
productRouter.patch('/product/:id', autheticate, updateProductById);
productRouter.delete('/product/:id', autheticate, deleteProductById);

module.exports = productRouter;
