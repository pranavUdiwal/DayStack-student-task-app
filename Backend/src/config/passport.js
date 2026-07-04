const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/auth/google/callback` : '/api/auth/google/callback',
      passReqToCallback: true,
      proxy: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error('No email found from Google account'), null);
        }
        const email = profile.emails[0].value;
        const name = profile.displayName || 'Google User';

        let user = await User.findOne({ email });

        if (!user) {
          // Create a random robust password for OAuth users
          const randomPassword = Math.random().toString(36).slice(-10) + 'A1!';
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          user = await User.create({
            name,
            email,
            password: hashedPassword,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Passport requires serialize/deserialize even if we just use it for a single OAuth transaction
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
