const crypto = require('crypto');
const User = require('./../models/userModel');
const catchAsync = require('../helpers/catchAsync');
const AppError = require('../helpers/appError');
const sendEmail = require('../helpers/email');

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email

    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/resetPassword/${resetToken}`;

    const message = `Forgot password confirm to ${resetURL}`;
    try {
        await sendEmail({
            email: req.body.email,
            subject: 'Your password reset token valid 10 min',
            message
        });

        res.status(200);
        res.redirect('/');
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }



});

exports.resetPassword = catchAsync(async (req, res, next) => {

    //get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    // !token not expired and there is user set new password

    if (!user) {
        return next(new AppError('token is invalid or has expired', 400))
    }

    user.password = user.encryptPassword(req.body.newpassword);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.redirect(200, "/");

});