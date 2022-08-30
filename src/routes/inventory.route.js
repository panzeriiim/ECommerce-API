const express = require('express');
const { autheticate } = require('../controllers/auth.controller');
const {
  addProductToInventory,
  deleteInventoryById,
  getAllInventories,
  updateInventoryById,
} = require('../controllers/inventory.controller');

const InventoryRouter = express.Router();

InventoryRouter.get('/inventory', autheticate, getAllInventories);
InventoryRouter.post('/inventory', autheticate, addProductToInventory);
InventoryRouter.patch('/inventory/:id', autheticate, updateInventoryById);
InventoryRouter.delete('/inventory/:id', autheticate, deleteInventoryById);

module.exports = InventoryRouter;
