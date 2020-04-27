const express = require('express');
const router = express.Router();
const Product = require('../models/product')
const mongoose = require('mongoose')

router.get('/', (req, res, next) => {
    res.status(200).json({
        message:'Serving get products'
    })
})
router.post('/', (req, res, next) => {
    const product = new Product({
        _id:mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    })

    product.save().then(result => {
        res.status(201).json({
            message:'Serving post products',
            createdProduct: product
        })
    }).catch(error => console.log(error))
})

router.get('/:productId', (req,res,next) => {
    const id = req.params.productId;
    Product.findById(id).exec().then(response => {
        res.status(200).json(response)
    }).catch(error => {
        console.log(error)
        res.status(500).json({error: error})
    })
})

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message:'Updated products'
    })
})

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message:'Deleted products'
    })
})

module.exports = router