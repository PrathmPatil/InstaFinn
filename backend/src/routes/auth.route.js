const express = require('express');
const { register, login, getProfile, updateProfile, logout } = require('../controllers/auth.controller');
const userAuth = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', userAuth, getProfile);
router.put('/profile', userAuth, updateProfile);
router.post('/logout', userAuth, logout);

module.exports = router;
