const express = require('express');
const authController = require('./../controllers/authController');
const router = express.Router();
router.post('/forgotpassword', authController.forgotPassword);
//router.patch('/resetpassword', authController.resetPassword);

module.exports = router;