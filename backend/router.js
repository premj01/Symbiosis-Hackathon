const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    res.send('Hello hi prem  World');

  } catch (error) {
    res.send('Hello hi prem  World');
  }
});
