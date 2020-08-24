const dotenv = require('dotenv');
dotenv.config({ path: './env/config.env' });
module.exports = {
    facebook: {
        clientID: process.env.SECRET_FACEBOOK_CLIENT_ID,
        clientSecret: process.env.SECRET_FACEBOOK_CLIENT_SECRET,
    },

    google: {
        clientID:
            process.env.SECRET_GOOGLE_CLIENT_ID,
        clientSecret: process.env.SECRET_GOOGLE_CLIENT_SECRET,
    },
};