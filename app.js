require('dotenv').config();
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const path = require('path');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

app.use(express.static(path.join(__dirname, 'front-end', 'build')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = { origin: 'http://localhost:3000' };
app.use(cors(corsOptions));

app.use(fileUpload({
  useTempFiles: true
}));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET
});

mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use('/api', userRouter);
app.use('/api/admin', adminRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'build', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
