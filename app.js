require("dotenv").config();
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
const path = require("path");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
// Import the passport configurations
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("./models/userModel");
app.use(
  session({
    secret: "your_secret_key_here", // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and use sessions to persist login state
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "front-end", "build")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
const corsOptions = { origin: "http://localhost:3000" };
app.use(cors(corsOptions));

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.URL+"/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists based on the Google ID
        const user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists, update token and return
          const token = jwt.sign(
            {
              id: user._id,
              name: user.name,
            },
            process.env.JWT_USER_SECRET,
            { expiresIn: "1h" }
          );

          return done(null, { profile, token });
        } else {
          // User doesn't exist, create a new one
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            verification: true,
          });

          await newUser.save();

          // User is created, generate and return the token
          const token = jwt.sign(
            {
              id: newUser._id,
              name: newUser.name,
            },
            process.env.JWT_USER_SECRET,
            { expiresIn: "1h" }
          );

          return done(null, { profile, token });
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

app.use("/api", userRouter);
app.use("/api/admin", adminRouter);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const userProfile = req.user.profile;
    const jwtToken = req.user.token;

    // Successful authentication, send the token as part of the response
    res.redirect(`/storeToken?token=${jwtToken}`);
  }
);


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "front-end", "build", "index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
