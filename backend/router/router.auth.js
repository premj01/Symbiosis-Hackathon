const express = require('express');
const router = express.Router();

const { register, validOTP, signIn } = require('../middleware/authMiddleware')


router.post("/register", register);
router.post("/signin", signIn);
router.post("/register/otp", validOTP);

module.exports = router;