const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const dotenv = require('dotenv');

const container = require('./container');

dotenv.config({ path: './config.env' });

container.resolve(function (users, _) {
  mongoose.Promise = global.Promise;
  const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection successfull'));

  const app = SetupExpress();
  function SetupExpress() {
    const app = express();
    const server = http.createServer(app);
    server.listen(3000, function () {
      console.log('Listening on port 3000');
    });
    ConfigureExpress(app);

    //setare router
    const router = require('express-promise-router')();
    users.SetRouting(router);
    app.use(router);
  }

  function ConfigureExpress(app) {
    require('./passport/passport-local');
    app.use(express.static('public'));
    app.use(cookieParser());
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(
      session({
        secret: 'thisisasecretkey',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
      })
    );
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.locals._ = _;
  }
});
