const mongoose = require("mongoose")



// _id: {
//   type: String,
//   requied: true,
//   unique: true
// },

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  mail: {
    type: String,
    required: true,
    unique: true,

  },
  password: {
    type: String,
    required: true
  },
  userpoints: {
    type: Number,
    default: 0
  },
  userRank: {
    type: Number,
    default: 0
  },
  expiry: {
    type: Date,
    required: true
  },
  uid: {
    type: String
  }

}, {
  timestamps: true
})

const TempRegistrationUserSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  mail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    require: true
  },
  uniqueid: {
    type: String,
    require: true
  },
  expiry: {
    type: Date,
    require: true
  }
}, {
  timestamps: true
})

const userModel = mongoose.model('Usermodel', userSchema);
const tempUser = mongoose.model('Tempreguser', TempRegistrationUserSchema);

// const firstUser = async () => {
//   const tuser = new tempUser({
//     userName: "root",
//     mail: "root@root.com",
//     password: "root",
//     otp: '457843235454324542435',
//     uniqueid: '45njrjrnir-tetn0t5 -te5te5tet5rte greg',
//     expiry: new Date()
//   })
//   await tuser.save();
//   const u = new user({
//     userName: "root",
//     mail: "root@root.com",
//     password: "root",
//   })
//   await u.save();
//   console.log("success");

// }
// firstUser();

module.exports = { userModel, tempUser }


