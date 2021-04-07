// === Import des dependances ou fichiers === //
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Creations des differents routes
router.post('/signup', userCtrl.userSignup);
router.post('/login', userCtrl.userLogin);


module.exports = router;