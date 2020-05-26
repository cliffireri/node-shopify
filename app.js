const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/uploads',express.static('uploads'));

mongoose.connect('mongodb+srv://node-rest-shop:'+ process.env.MONGO_ATLAS_PW +'@node-rest-shop-rvos6.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const productRouter = require('./api/routes/products')
const orderRouter = require('./api/routes/orders')
const userRouter = require('./api/routes/user')

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-COntrol-Allow-Methods','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','POST,GET,PATCH,PUT,DELETE');
        return res.status(200).json({});
    }
    next()
})

app.use('/products', productRouter);

app.use('/orders', orderRouter);

app.use('/users', userRouter);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app