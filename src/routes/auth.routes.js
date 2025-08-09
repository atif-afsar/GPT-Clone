const express = require('express');
const {getRegisterController, postRegisterController, getLoginController, postLoginController} = require('../controllers/auth.controller');
const { get } = require('mongoose');

const router = express.Router();

router.get('/register', getRegisterController);
router.post('/register', postRegisterController);
router.get('/login',getLoginController);
router.post('/login', postLoginController);

module.exports = router;