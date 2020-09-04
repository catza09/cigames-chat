'use strict';

module.exports = function (_, passport, Users, validator) {
  return {
    SetRouting: function (router) {
      router.get('/', this.indexPage);
      router.get('/signup', this.getSignUp);
      router.get('/forgotpassword', this.getForgotPassword);
      router.get('/auth/facebook', this.getFacebookLogin);
      router.get('/auth/facebook/callback', this.facebookLogin);
      router.get('/auth/google', this.getGoogleLogin);
      router.get('/auth/google/callback', this.googleLogin);


      router.post(
        '/',
        [
          validator
            .check('email')
            .not()
            .isEmpty()
            .isEmail()
            .withMessage('Email is required.'),
          validator
            .check('password')
            .not()
            .isEmpty()
            .isLength({ min: 6 })
            .withMessage(
              'Password is required and must be at least 6 characters'
            ),
        ],
        this.postValidation,
        this.postLogin
      );
      router.post(
        '/signup',
        [
          validator
            .check('username')
            .not()
            .isEmpty()
            .isLength({ min: 5 })
            .withMessage(
              'Username is required and must be at least 5 characters.'
            ),
          validator
            .check('email')
            .not()
            .isEmpty()
            .isEmail()
            .withMessage('Email is required.'),
          validator
            .check('password')
            .not()
            .isEmpty()
            .isLength({ min: 6 })
            .withMessage(
              'Password is required and must be at least 6 characters'
            ),
        ],
        this.postValidation,
        this.postSignUp
      );

    },

    getForgotPassword: function (req, res) {
      const errors = req.flash('error');
      return res.render('forgotpassword', {
        title: 'Cigames Chat - Forgot Password',
        messages: errors,
        hasErrors: errors.length > 0,
      });
    },

    indexPage: function (req, res) {
      const errors = req.flash('error');
      return res.render('index', {
        title: 'Cigames Chat | Login',
        messages: errors,
        hasErrors: errors.length > 0,
      });
    },
    postLogin: passport.authenticate('local.login', {
      successRedirect: '/home',
      failureRedirect: '/',
      failureFlash: true,
    }),
    getSignUp: function (req, res) {
      const errors = req.flash('error');
      return res.render('signup', {
        title: 'Cigames Chat | SignUp',
        messages: errors,
        hasErrors: errors.length > 0,
      });
    },

    postValidation: function (req, res, next) {
      const err = validator.validationResult(req);
      const reqErrors = err.array();
      const errors = reqErrors.filter((e) => e.msg !== 'Invalid value');
      let messages = [];
      errors.forEach((error) => {
        messages.push(error.msg);
      });

      //req.flash('error', messages);
      return next();
    },

    postSignUp: passport.authenticate('local.signup', {
      successRedirect: '/home',
      failureRedirect: '/signup',
      failureFlash: true,
    }),

    getFacebookLogin: passport.authenticate('facebook', {
      scope: 'email',
    }),

    getGoogleLogin: passport.authenticate('google', {
      scope: ['profile', 'email'],
    }),

    facebookLogin: passport.authenticate('facebook', {
      successRedirect: '/home',
      failureRedirect: '/signup',
      //  failureFlash: true,
    }),

    googleLogin: passport.authenticate('google', {
      successRedirect: '/home',
      failureRedirect: '/signup',
      failureFlash: true,
    }),


  };
};
