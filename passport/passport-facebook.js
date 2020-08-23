'use strict';

const passport = require('passport');
const User = require('../models/userModel');
const FacebookStrategy = require('passport-facebook').Strategy;


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

//middleware
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.SECRET_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.SECRET_FACEBOOK_CLIENT_SECRET,
      profileFields: ['email', 'displayName', 'photos'],
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      passReqToCallback: true,
    },
    (req, token, refreshToken, profile, done) => {
      //check email
      User.findOne({ facebook: profile.id }, (err, user) => {
        //check email if user exists
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User();
          newUser.facebook = profile.id;
          newUser.fullname = profile.displayName;
          newUser.username = profile.displayName;
          newUser.email = profile._json.email;
          newUser.userImage =
            'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          newUser.fbTokens.push({ token: token });
          newUser.save((err) => {
            return done(null, user);
          });
        }
      });
    }
  )
);
