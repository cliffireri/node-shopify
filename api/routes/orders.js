const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order')

const router = express.Router();

router.get('/', (req,res,next) => {
    Order.find().select('quantity product _id').exec().then( orders => {
        console.log(res);
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
})

router.post('/', (req,res,next) => {
    const order = new Order({
        _id:mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'okay post order created',
            order: result
        })
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        })
    })
})

router.get('/:orderId', (req,res,next) => {
    const order_id = req.params.orderId;
    Order.findById(order_id).select('name _id').exec().then(order=>{
        console.log(order);
        res.status(200).json({
            _id: order._id,
            name: order.name
        })
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        })
    })
})

router.patch('/:orderId', (req,res,next) => {
    const order_id = req.params.orderId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName = ops.propValue];
    }
    Order.update({_id:order_id}, {$set: updateOps}).exec().then(order => {
        console.log(order);
        res.status(200).json({
            _id: order._id,
            name: order.name
        })
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    })
})

router.delete('/:orderId', (req,res,next) => {
    const order_id = req.params.orderId;
    Order.remove({_id:order_id}).exec().then(order => {
        res.status(200).json({
            message: 'Order deleted successfully'
        })
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        })
    })
})



module.exports = router

