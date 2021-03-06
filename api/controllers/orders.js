const Order = require('../models/order')
const Product = require('../models/product')
const mongoose = require('mongoose');

exports.get_all_orders = (req, res, next) => {
    Order.find().select('quantity product _id').populate('product').exec().then(orders => {
        res.status(200).json({
            count: orders.length,
            orders: orders.map(order => {
                return {
                    _id: order._id,
                    product: order.product,
                    quantity: order.quantity,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/orders/${order._id}`
                    }
                }
            })
        })
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    })
}

exports.add_new_order = (req, res, next) => {
    Product.findById(req.body.productId).then(result => {
        if(!result){
            res.status(404).json({
                message: 'Product not found'
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save()
    }).then(result => {
        res.status(201).json({
            message: 'Order created',
            order: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: `${process.env.APP_URL}/orders/${result._id}`
            }
        })
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    })
}

exports.get_one_order = (req, res, next) => {
    const order_id = req.params.orderId;
    Order.findById(order_id).select('quantity product _id').populate('product').exec().then(order => {
        if(!order){
            res.status(404).json({
                message: 'Order not found'
            })
        }
        res.status(200).json({
            _id: order._id,
            quantity: order.quantity,
            product: order.product,
            request: {
                type: 'GET',
                url: `${process.env.APP_URL}/orders/${order._id}`
            }
        })
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    })
}

exports.delete_order = (req, res, next) => {
    const order_id = req.params.orderId;
    Order.remove({ _id: order_id }).exec().then(order => {
        res.status(200).json({
            message: 'Order deleted successfully',
            request: {
                type: 'POST',
                url: `${process.env.APP_URL}/orders`,
                body: {
                    productId: 'ID',
                    quantity: 'Number'
                }
            }
        })
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    })
}