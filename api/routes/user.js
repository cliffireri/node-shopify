const express = require('express')

const router = express.Router();

const mongoose = require('mongoose');

const User = require('../models/user')

const bcrypt = require('bcryptjs');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email}).exec().then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                error: "Email already exists"
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    res.status(500).json({
                        error: err
                    })
                }else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
                    })
                    user.save().then(result => {
                        res.status(200).json({
                            message: 'User created'
                        })
                    }).catch(error => {
                        res.status(500).json({
                            error: "an error occurred"
                        })
                    })
                }
            })
        }
    })
})

module.exports = router;