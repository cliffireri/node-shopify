const express = require('express');
const router = express.Router();
const Product = require('../models/product')
const mongoose = require('mongoose')

router.get('/', (req, res, next) => {
   Product.find().exec().then((products => {
       console.log(products)
       res.status(200).json({
           products: products
       })
   })).catch(error => {
       console.log(error)
       res.status(500).json({
           error: error
       })
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
        if(response){
            res.status(200).json(response)
        }else{
            res.status(404).json({
                message: "No product with that id was found"
            })
        }
        
    }).catch(error => {
        console.log(error)
        res.status(500).json({error: error})
    })
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value
    }
    Product.update({_id:id}, {$set: updateOps }).exec().then(result => {
        console.log(result)
        res.status(200).json(result)
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id:id}).exec().then(result => {
        console.log(result)
        res.status(200).json(result)
    }).catch(error => {
        console.log(500)
        res.status(500).json({
            error: error
        })
    })
})

module.exports = router