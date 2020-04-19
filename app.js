const express = require('express');

const app = express();

const expressRouter = require('./api/routes/products')

const orderRouter = require('./api/routes/orders')

app.use('/products', expressRouter);

app.use('/orders', orderRouter);

module.exports = app