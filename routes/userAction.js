const nodemailer = require("nodemailer")
const {google} = require("googleapis");


const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URL);
oAuth2Client.setCredentials({refresh_token:process.env.REFRESH_TOKEN})

 async function sendMail(to,subject,text,html) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'sanjaydeveloper919@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'Sanjay Developer <sanjaydeveloper919@gmail.com>',
      to,
      subject,
      text,
      html:`<h3>${html}</h3>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
// sendMail()
//   .then((result) => console.log('Email sent...', result))
//   .catch((error) => console.log(error.message));


function generateOTP(length) {
    const chars = '0123456789'; // Characters allowed in the OTP
    let otp = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      otp += chars[randomIndex];
    }
    
    return otp;
  }
module.exports = {sendMail,generateOTP};