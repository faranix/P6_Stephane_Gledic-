const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');


router.post('/signup', userCtrl.userSignup);
router.post('/login', userCtrl.userLogin);


module.exports = router;