const Product = require('../models/product')
const mongoose = require('mongoose')

exports.get_products = (req, res, next) => {
    Product
    .find()
    .select('name price _id productImage')
    .exec()
    .then((products => {
        const response = {
            count: products.length,
            products: products.map(product => {
                return {
                    name: product.name,
                    price: product.price,
                    _id: product._id,
                    productImage: product.productImage,
                    request: {
                        type: 'GET',
                        url:`http://localhost:3000/products/${product._id}`
                    }
                }
            })
        }
        res.status(200).json(response)
    })).catch(error => {
        console.log(error)
        res.status(500).json({
            error: error
        })
    })
}

exports.create_product = (req, res, next) => {
    
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })

    product.save().then(result => {
        res.status(201).json({
            message: 'created a product successfully',
            createdProduct: {
                name: product.name,
                price: product.price,
                _id: product._id,
                productImage: product.productImage,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${product._id}`
                }
            }
        })
    }).catch(error => {
        res.status(500).json(error)
        console.log(error)
    })
}

exports.get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select('name price _id productImage').exec().then(response => {
        if (response) {
            res.status(200).json({
                product: {
                    name: response.name,
                    price: response.price,
                    _id:response._id,
                    productImage: response.productImage,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/${response._id}`
                    }
                },
            })
        } else {
            res.status(404).json({
                message: "No product with that id was found"
            })
        }

    }).catch(error => {
        console.log(error)
        res.status(500).json({ error: error })
    })
}

exports.update = (req, res, next) => {
    const id = req.params.productId
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.update({ _id: id }, { $set: updateOps }).exec().then(result => {
        console.log(result)
        res.status(200).json({
            product: {
                _id:result._id,
                name:result.name,
                price:result.price,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${result._id}`
                }
            }
        })
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    })
}

exports.delete = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id }).exec().then(result => {
        console.log(result)
        res.status(200).json({
            message: "Deleted successfully",
            request: {
                type: 'POST',
                url: `http://localhost:3000/products`,
                body: {
                    name,price
                }
            }
        })
    }).catch(error => {
        console.log(500)
        res.status(500).json({
            error: error
        })
    })
}