const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order')
const Product = require('../models/product')
const checkAuth = require('../middleware/check-auth')
const OrdersController = require('../controllers/orders')

const router = express.Router();

router.get('/', checkAuth,OrdersController.get_all_orders)

router.post('/', checkAuth,OrdersController.add_new_order)

router.get('/:orderId',checkAuth,OrdersController.get_one_order)

// router.patch('/:orderId', (req, res, next) => {
//     const order_id = req.params.orderId;
//     const updateOps = {};
//     for (const ops of req.body) {
//         updateOps[ops.propName = ops.propValue];
//     }
//     Order.update({ _id: order_id }, { $set: updateOps }).exec().then(order => {
//         console.log(order);
//         res.status(200).json({
//             _id: order._id,
//             name: order.name
//         })
//     }).catch(error => {
//         res.status(500).json({
//             error: error
//         })
//     })
// })

router.delete('/:orderId',checkAuth,OrdersController.delete_order)



module.exports = router

