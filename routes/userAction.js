const nodemailer = require("nodemailer")
const {google} = require("googleapis");

const CLIENT_ID = '503438361782-5pfko3j6hr21sjj6kcoo6c8pjkno2tkd.apps.googleusercontent.com'
const  CLIENT_SECRET = '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';
const  REDIRECT_URL = 'https://developers.google.com/oauthplayground'
const  REFRESH_TOKEN = '1//04-7H0smXx74QCgYIARAAGAQSNwF-L9IrLq7nDFC7hM4NDLEy1Cdd94-w2w-I4zK2M2Z4lebtQ4ezUSODZdrOP5kaWJfsA5EN1Vk'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URL);
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

 async function sendMail(to,subject,text,html) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'sanjaydeveloper919@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'Sanjay Developer <sanjaydeveloper919@gmail.com>',
      to,
      subject,
      text,
      html:`<h1>${html}</h1>`,
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