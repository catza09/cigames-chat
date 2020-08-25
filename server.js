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
const socketIO = require('socket.io');
const compression = require('compression');
const helmet = require('helmet');

const { Users } = require('./helpers/UsersClass');
const { Global } = require('./helpers/GlobalClass');

const container = require('./container');

dotenv.config({ path: './env/config.env' });

container.resolve(function (
  users,
  _,
  admin,
  home,
  group,
  results,
  privatechat,
  profile,
  interests,
  news
) {
  //conectare baza de date
  mongoose.Promise = global.Promise;
  // const DB = process.env.DATABASE.replace(
  //   '<PASSWORD>',
  //   process.env.DATABASE_PASSWORD
  // );

  const DB = process.env.DATABASE_URI;
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successfull'));

  //setare Express si socket.io
  const app = SetupExpress();
  function SetupExpress() {
    const app = express();
    const server = http.createServer(app);
    const io = socketIO(server);
    server.listen(process.env.PORT || 3000, function () {
      console.log('Listening on port 3000');
    });
    ConfigureExpress(app);
    //middleware
    app.use(compression());
    app.use(helmet());

    require('./socket/groupchat')(io, Users);
    require('./socket/friend')(io);
    require('./socket/globalroom')(io, Global, _);
    require('./socket/privatemessage')(io);

    //setare router
    const router = require('express-promise-router')();
    users.SetRouting(router);
    admin.SetRouting(router);
    home.SetRouting(router);
    group.SetRouting(router);
    results.SetRouting(router);
    privatechat.SetRouting(router);
    profile.SetRouting(router);
    interests.SetRouting(router);
    news.SetRouting(router);
    app.use(router);

    app.use(function (req, res) {
      res.render('404');
    });
  }

  //configurare express sesiuni si logare cu passport
  function ConfigureExpress(app) {
    require('./passport/passport-local');
    require('./passport/passport-facebook');
    require('./passport/passport-google');
    app.use(express.static('public'));
    app.use('/group/', express.static('./public/uploads'));
    app.use('/chat/', express.static('./public/uploads'));
    app.use('/', express.static('./public/uploads'));
    app.use(cookieParser());
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(
      session({
        secret: process.env.SECRET_SESSION_KEY,
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
      })
    );
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    //variabile globale express
    app.locals._ = _;

  }
});
