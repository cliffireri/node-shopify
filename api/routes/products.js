const express = require('express');
const router = express.Router();
const Product = require('../models/product')
const mongoose = require('mongoose')
const multer = require('multer');
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(null,false)
    }
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
 
router.get('/', (req, res, next) => {
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
})
router.post('/', upload.single('productImage'),(req, res, next) => {
    console.log(req.file)
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
})

router.get('/:productId', (req, res, next) => {
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
})

router.patch('/:productId', (req, res, next) => {
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
})

router.delete('/:productId', (req, res, next) => {
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
})

module.exports = router