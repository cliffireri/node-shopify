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
                            error: error
                        })
                    })
                }
            })
        }
    })
})

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email}).exec().then(user => {
        if(user.length < 1){
            return res.status(401).json({message: "Auth failed"})
        }

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({message: "Auth failed"})
            }
            if(result){
                return res.status(200).json({message: 'Auth successful'})
            }else{
                return res.status(401).json({message: "Auth failed"})
            }
        })

    }).catch(error => {
        res.status(500).json({error: error})
    })
})

router.delete('/:userId', (req, res, next) => {
    const uid = req.params.userId
    User.remove({_id:uid}).exec().then((result) => {
        res.status(200).json({
            message: "Deleted successfully"
        })
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    })
})

router.get('/', (req, res, next) => {
    User.find().select('_id email').exec().then(result => {
        res.status(200).json({users: result});
    }).catch(error => {
        res.status(500).json({error: error})
    })
})

module.exports = router;