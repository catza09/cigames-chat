// module.exports = function (formidable, Game,) {
//   return {
//     SetRouting: function (router) {
//       router.get('/dashboard', this.adminPage);

//       router.post('/uploadFile', this.uploadFile);
//       router.post('/dashboard', this.adminPostPage);
//     },
//     adminPage: function (req, res) {
//       res.render('admin/dashboard');
//     },
//     //save data to db
//     adminPostPage: function (req, res) {
//       const newGame = new Game();
//       newGame.name = req.body.game;
//       newGame.type = req.body.type;
//       newGame.image = req.body.upload;
//       newGame.save((err) => {
//         res.render('admin/dashboard');
//       });
//     },
//     uploadFile: function (req, res) {
//       const form = formidable.IncomingForm();
//       //form.uploadDir = path.join(__dirname,'../public/uploads');

//       form.on('file', (field, file) => {
//         //fs.rename(file.path,path.join(form.uploadDir, file.name), (err)=>{
//         //if(err) throw err;
//         //console.log('File renamed successfully');
//         //  })
//       });
//       form.on('error', (err) => {
//         //console.log('err');
//       });
//       form.on('end', () => {
//         //  console.log('File upload is successfull');
//       });
//       form.parse(req);
//     },
//   };
// };

const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
const mongoose = require('mongoose');
const dotenv = require('dotenv');


AdminBro.registerAdapter(AdminBroMongoose);

dotenv.config({ path: './env/config.env' });
const Game = require('../models/gameModel');
const Message = require('../models/messageModel');
const Group = require('../models/groupmessage');
const User = require('../models/userModel');

const adminBro = new AdminBro({
  databases: [mongoose],
  resources: [{
    Message, Group, User,
    resource: Game,
    options: {
      parent: {
        name: 'Admin Game Room',
        icon: 'fas fa-cog'
      },
      properties: {
        description: { type: 'richtext' },
      },
    }
  }],
  rootPath: '/admin',
  branding: { companyName: 'Cigames Chat' }
});

const ADMIN = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
}


const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  cookieName: process.env.ADMIN_COOKIE_NAME,
  cookiePassword: process.env.ADMIN_COOKIE_PASS,

  authenticate: async (email, password) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      return ADMIN
    }
    return null
  }
})
module.exports = router