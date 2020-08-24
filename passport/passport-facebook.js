<<<<<<< HEAD
"use strict";
const secret = require("../secret/secretFile");
const passport = require('passport');
const User = require('../models/userModel');
=======
'use strict';

const passport = require('passport');
const User = require('../models/userModel');
const secret = require("../secret/secretFile");
>>>>>>> 242922975f9107402854034588ed5f13e6147d24
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
      clientID: secret.facebook.clientID,
      clientSecret: secret.facebook.clientSecret,
<<<<<<< HEAD
      profileFields: ["email", "displayName", "photos"],
      callbackURL: "http://localhost:3000/auth/facebook/callback",
=======
      profileFields: ['email', 'displayName', 'photos'],
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
>>>>>>> 242922975f9107402854034588ed5f13e6147d24
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
<<<<<<< HEAD
            "https://graph.facebook.com/" + profile.id + "/picture?type=large";
=======
            'https://graph.facebook.com/' + profile.id + '/picture?type=large';
>>>>>>> 242922975f9107402854034588ed5f13e6147d24
          newUser.fbTokens.push({ token: token });
          newUser.save((err) => {
            return done(null, user);
          });
        }
      });
    }
  )
);
