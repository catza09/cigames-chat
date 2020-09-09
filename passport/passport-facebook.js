"use strict";
const secret = require("../secret/secretFile");
const passport = require('passport');
const User = require('../models/userModel');
const FacebookStrategy = require('passport-facebook').Strategy;


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//middleware
passport.use(
  new FacebookStrategy(
    {
      clientID: secret.facebook.clientID,
      clientSecret: secret.facebook.clientSecret,
      profileFields: ['id', 'email', 'displayName', 'picture.type(large)'],
      callbackURL: 'https://cigames-chat.herokuapp.com/auth/facebook/callback',
      passReqToCallback: true,
    },
    (req, token, refreshToken, profile, done) => {
      //check email
      console.log(profile);
      process.nextTick(function () {
        User.findOne({ 'facebook': profile.id }, function (err, user) {
          //check email if user exists
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.userImage = profile.photos[0].value;
            newUser.fbTokens = token;
            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      })
    }
  )
);
