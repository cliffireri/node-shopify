const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message:'Serving get products'
    })
})
router.post('/', (req, res, next) => {
    res.status(201).json({
        message:'Serving post products'
    })
})

router.get('/:productId', (req,res,next) => {
    const id = req.params.productId;
    if(id === 'special'){
        res.status(200).json({
            message: 'Congrats on finnding the special id',
            id: id
        })
    }else{
        res.status(200).json({
            message: 'found the real you',
            id: id
        })
    }
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