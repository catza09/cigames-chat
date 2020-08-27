const nodemailer = require('nodemailer');

const sendEmail = async options => {
    //transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            password: process.env.EMAIL_PASSWORD
        }

    });
    //email options
    const mailOptions = {
        from: 'Support Cigames<support@cigames.ro>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        //html

    };
    //send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;