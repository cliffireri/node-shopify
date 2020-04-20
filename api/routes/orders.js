const express = require('express');

const router = express.Router();

router.get('/', (req,res,next) => {
    res.status(200).json({
        message: 'okay orders'
    })
})

router.post('/', (req,res,next) => {
    const order = {
        order_id: req.body.order_id,
        order_name: req.body.order_name
    }
    res.status(201).json({
        message: 'okay post order created',
        order: order
    })
})

router.get('/:orderId', (req,res,next) => {
    res.status(200).json({
        message: 'Got your order',
        id: req.params.orderId
    })
})

router.patch('/:orderId', (req,res,next) => {
    res.status(200).json({
        message: 'Got your order update',
        id: req.params.orderId
    })
})

router.delete('/:orderId', (req,res,next) => {
    res.status(200).json({
        message: 'Delete your order',
        id: req.params.orderId
    })
})



module.exports = router

