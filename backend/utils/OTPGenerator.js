let getOTP = (length = 0) => {
  if (length > 0) {

    let otp = '';
    while (otp.length < length) {
      let num = Math.floor(Math.random() * 10);
      if (num !== 0)
        otp += num.toString();
    }
    return otp
  } else {
    return (Math.floor(Math.random() * 900000) + 100000) + "";
  }
}


module.exports = getOTP;