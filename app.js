const express = require('express');
const userRoutes = require('./src/routes/user.route');
const productRoutes = require('./src/routes/product.route');
const inventoryRoutes = require('./src/routes/inventory.route');
const cartRoutes = require('./src/routes/cart.route');
const orderRoutes = require('./src/routes/order.route');

const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/v1', userRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', inventoryRoutes);
app.use('/api/v1', cartRoutes);
app.use('/api/v1', orderRoutes);
app.use(errorHandler);
module.exports = app;
