var nodemailer = require("nodemailer");
let { mailid, mailpass } = require('../config/config');

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailid,
    pass: mailpass,
  },
});

const sendMail = async ({ receversMail, subject, userOTP, headLine, body }) => {

  return new Promise((resolve, reject) => {


    let content = body || `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
            /* text-align: center; */
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            border: 2px solid #4CAF50;
            display: inline-block;
            padding: 10px 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
        }
        a {
            color: #4CAF50;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: white;">${headLine}</h1>
        </div>
        <div class="content">
            <p>Hi there!</p>
            <p>Thank you for using our Product. Your One-Time Password (OTP) is:</p>
            <center><div class="otp">${userOTP}</div></center>
            <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} VishwaTech, CORP. All rights reserved.</p>
            <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
        </div>
    </div>
</body>
</html>
`;

    let mailOptions = {
      from: mailid,
      to: receversMail,
      subject: subject || "OTP Varification",
      html: content,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(false);
      } else {
        console.log("Email sent to : " + receversMail + info.response);
        resolve(true);
      }
    });
  })

}

// sendMail({ userOTP: Math.floor(Math.random() * 900000) + 100000, headLine: "Registration OTP" });

module.exports = sendMail;

