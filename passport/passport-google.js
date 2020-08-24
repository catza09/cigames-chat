"use strict";

const passport = require('passport');
const User = require('../models/userModel');
const secret = require("../secret/secretFile");
//const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;


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
  new GoogleStrategy(
    {
      clientID: secret.google.clientID,
      clientSecret: secret.google.clientSecret,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      //check email
      User.findOne({ google: profile.id }, (err, user) => {
        //check email if user exists
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User();
          newUser.google = profile.id;
          newUser.fullname = profile.displayName;
          newUser.username = profile.displayName;
          newUser.email = profile.emails[0].value;
          newUser.userImage = profile.photos[0].value;

          newUser.save((err) => {
            if (err) {
              return done(err);
            }
            return done(null, newUser);
          });
        }
      });
    }
  )
);
