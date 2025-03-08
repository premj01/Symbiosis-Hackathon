const express = require('express');
const { varifyUser } = require('../middleware/authMiddleware');
const router = express.Router();


router.post("/prem", varifyUser, (req, res, next) => {
  res.json(req.body.city);
});

module.exports = router;