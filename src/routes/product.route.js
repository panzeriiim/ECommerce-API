const express = require('express');
const {
  autheticate,
  restrictPermission,
} = require('../controllers/auth.controller');
const {
  addProduct,
  deleteProductById,
  getAllProducts,
  updateProductById,
} = require('../controllers/product.controller');

const productRouter = express.Router();

productRouter.get('/product', getAllProducts);
productRouter.post('/product', autheticate, restrictPermission, addProduct);
productRouter.patch(
  '/product/:id',
  autheticate,
  restrictPermission,
  updateProductById
);
productRouter.delete(
  '/product/:id',
  autheticate,
  restrictPermission,
  deleteProductById
);

module.exports = productRouter;
