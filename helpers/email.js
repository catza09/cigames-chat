const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

const sendEmail = async options => {
    //transporter
    const transporter = nodemailer.createTransport(smtpTransport({

        secure: true,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,

        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }

    }));
    //email options
    const mailOptions = {
        from: 'Support Cigames<support@cigames.ro>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        //html

    };
    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('Server is ready to take our messages');
        }
    });

    //send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;