const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { userModel, tempUser } = require('../model/user.model')
const getOTP = require('../utils/OTPGenerator')
const { v4: uuidv4 } = require('uuid');
const sendMail = require('../utils/OTP.mail')
const { secretKey } = require('../config/config')
const isEmailValid = require('../utils/validateMail');



const varifyUser = async (req, res, next) => {
  try {
    const { SecCode } = req.body;

    if (!SecCode) {
      return res.status(404).json({ message: "You need to SignIn...", status: false });
    }

    jwt.verify(SecCode, secretKey, async (err, decode) => {

      if (err) {
        return res.status(404).json({ message: 'Something is wrong here... please login again', status: false })
      }

      const fetchedUserInfo = await userModel.findOne({ mail: decode.mail, uid: decode.uid });

      if (fetchedUserInfo) {
        next();
      } else {
        return res.status(404).json({ message: "You need to SignIn...", status: false });
      }

    })

  } catch (error) {
    console.log(error);

  }
}

const register = async (req, res, next) => {

  try {
    const { username, mail, password } = req.body

    if (!await isEmailValid(mail)) {
      return res.status(401).json({ message: 'Invalid Mail' })
    }

    let checkUserPresence;
    if (username && mail && password) {
      checkUserPresence = await tempUser.findOneAndDelete({ mail: mail });

      if (checkUserPresence) {
        console.log("I just deleted you");
      }
    }
    else {
      return res.status(401).json({ message: "Halva samje ho kya f***" });
    }

    const otp = getOTP();
    const UniqueID = uuidv4();

    const isMailSent = await sendMail({ receversMail: mail, userOTP: otp, headLine: 'Varify using OTP' });
    if (isMailSent) {

      bcrypt.genSalt(12, function (err, salt) {

        bcrypt.hash(password, salt, async function (err, hash) {
          const user = new tempUser({
            userName: username,
            mail: mail,
            password: hash,
            otp: otp,
            uniqueid: UniqueID,
            expiry: new Date(new Date().getTime() + 10 * 60000)

          })
          const savedObject = await user.save();
          console.log("temp user created Successfully :" + user.mail);

          jwt.sign({ mail: mail, uid: UniqueID }, secretKey, { expiresIn: '10m' }, function (err, token) {
            if (err) {
              console.log("JWT error" + err);
              return res.json({ message: "Internal Server Error" })
            }

            return res.status(200).json({ message: "Your OTP has been sent on " + mail, SecCode: token });
          });
        });
      });

    } else {
      return res.status(500).json({ message: "Failed to send OTP" });
    }

  } catch (error) {
    console.log(error);
    console.log("Temparary user not created : ");
  }

}



const validOTP = async (req, res, next) => {

  try {
    const { SecCode, otp } = req.body;

    if (!(SecCode && otp)) {
      return res.status(401).json({ message: 'Bro I am not your type !!!' })
    }

    jwt.verify(SecCode, secretKey, async function (err, decoded) {

      if (err) {
        return res.status(401).json({ message: 'Oops..Your OTP has been expired!!' });
      }

      const isUserAlreadyExist = await userModel.findOne({ mail: decoded.mail });
      if (isUserAlreadyExist) {
        return res.status(400).json({ message: 'user already exists' });
      }

      const userRecord = await tempUser.findOne({ mail: decoded.mail, uniqueid: decoded.uid });

      if (!userRecord) {
        return res.status(404).json({ message: 'Suspicious activity detected : can you plz do one more atempt' });
      }

      const UniqueID = uuidv4();

      if (otp === userRecord.otp) {
        const user = new userModel({
          userName: userRecord.userName,
          mail: userRecord.mail,
          password: userRecord.password,
          expiry: new Date(new Date().getTime() + 120 * 60000),
          uid: UniqueID,
        })
        const savedRecoed = await user.save();

        jwt.sign({ mail: savedRecoed.mail, uid: savedRecoed.uid }, secretKey, { expiresIn: '120m' }, function (err, token) {
          if (err) {
            console.log("JWT error" + err);
            return res.status(500).json({ message: "Internal Server Error" })
          }

          return res.status(200).json({ redirect: "/", message: 'Varification Successful', SecCode: token });
        });


      } else {
        return res.status(400).json({ message: 'Incorrect OTP' });
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Currently Service unavalilable...Please Contact for any kind of help" })
  }

}

const signIn = async (req, res, next) => {

  try {
    const { mail, password } = req.body;

    if (!(mail && password)) {
      return res.status(404).json({ message: 'Chill bro we have Highlevel of Security', code: '01000110 01110101 01100011 01101011 00100000 01111001 01101111 01110101' })
    }

    const UserInfoExist = await userModel.findOne({ mail: mail });

    if (UserInfoExist) {
      bcrypt.compare(password, UserInfoExist.password).then(async (isMatched) => {
        if (!isMatched) {
          return res.status(401).json({ message: "Wrong Password" });
        } else {

          const UniqueID = uuidv4();

          const updatedUser = await userModel.findByIdAndUpdate(UserInfoExist._id, { uid: UniqueID, expiry: new Date(new Date().getTime() + 120 * 60000) }, { new: true, runValidators: true });

          jwt.sign({ mail: UserInfoExist.mail, uid: updatedUser.uid }, secretKey, { expiresIn: '120m' }, (err, token) => {

            if (err) {
              console.log("JWT error" + err);
              return res.status(500).json({ message: "Internal Server Error" })
            }

            return res.status(200).json(
              {
                username: UserInfoExist.userName,
                mail: UserInfoExist.mail,
                expiry: UserInfoExist.expiry.toString(),
                SecCode: token,
                redirect: "/",
                message: 'SignIn Successful',
                status: true,
              })
          })
        }

      })

    } else {
      return res.status(404).json({ message: 'User not exist !!', status: false })
    }


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error!?' });
  }
}

const signOut = (req, res, next) => {

}


module.exports = { register, validOTP, signIn, varifyUser };