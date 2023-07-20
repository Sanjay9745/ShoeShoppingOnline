const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Replace these with your actual Google client ID and secret
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // This function is called after successful authentication
    // Handle user data, e.g., save it to the database or create a session
    // The 'profile' object contains user information returned by Google
    return done(null, profile);
  }
));

module.exports = passport;
