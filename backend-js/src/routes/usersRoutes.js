const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/all_users', usersController.allUsers);
router.post('/login_users', usersController.loginUsers);
router.post('/register_users', usersController.registerUsers);

module.exports = router;
