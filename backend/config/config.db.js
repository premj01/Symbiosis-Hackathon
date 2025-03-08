const mongoose = require('mongoose');
const { db } = require('../config/config')

const ConnectDB = () => {
  try {
    mongoose.connect(db).then(() => {
      console.log("Connected to DB successfully");
    })
  } catch (error) {
    console.log(error);
  }
}

module.exports = ConnectDB;