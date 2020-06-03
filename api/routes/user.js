const express = require('express')

const router = express.Router();


const UsersController = require('../controllers/users')

router.post('/signup', UsersController.user_signup)

router.post('/login', UsersController.user_login)

router.delete('/:userId', UsersController.user_delete)

router.get('/', UsersController.get_users_all)

module.exports = router;