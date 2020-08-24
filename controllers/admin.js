module.exports = function (formidable, Game) {
  return {
    SetRouting: function (router) {
      router.get('/dashboard', this.adminPage);

      router.post('/uploadFile', this.uploadFile);
      router.post('/dashboard', this.adminPostPage);
    },
    adminPage: function (req, res) {
      res.render('admin/dashboard');
    },
    //save data to db
    adminPostPage: function (req, res) {
      const newGame = new Game();
      newGame.name = req.body.game;
      newGame.type = req.body.type;
      newGame.image = req.body.upload;
      newGame.save((err) => {
        res.render('admin/dashboard');
      });
    },
    uploadFile: function (req, res) {
      const form = formidable.IncomingForm();
      //form.uploadDir = path.join(__dirname,'../public/uploads');

      form.on('file', (field, file) => {
        //fs.rename(file.path,path.join(form.uploadDir, file.name), (err)=>{
        //if(err) throw err;
        //console.log('File renamed successfully');
        //  })
      });
      form.on('error', (err) => {
        //console.log('err');
      });
      form.on('end', () => {
        //  console.log('File upload is successfull');
      });
      form.parse(req);
    },
  };
};
