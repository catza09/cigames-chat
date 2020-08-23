module.exports = function (async, Game, Users) {
  return {
    SetRouting: function (router) {
      router.get('/results', this.getResults);
      router.post('/results', this.postResults);
      router.get('/members', this.viewMembers);
      router.post('/members', this.searchMembers);
    },

    getResults: function (req, res) {
      res.redirect('/home');
    },

    //interogarea in baza de date

    postResults: function (req, res) {
      async.parallel(
        [
          function (callback) {
            const regex = new RegExp(req.body.gameType, 'gi');
            Game.find(
              { $or: [{ gameType: regex }, { name: regex }] },
              (err, result) => {
                callback(err, result);
              }
            );
          },
        ],
        (err, results) => {
          const docSala = results[0];
          const dataChunk = [];
          const chunkSize = 3;
          for (let i = 0; i < docSala.length; i += chunkSize) {
            dataChunk.push(docSala.slice(i, i + chunkSize));
          }
          res.render('results', {
            title: 'Cigames Chat - Results',
            user: req.user,
            chunks: dataChunk,
          });
        }
      );
    },

    viewMembers: function (req, res) {
      async.parallel(
        [
          function (callback) {
            Users.find({},
              (err, result) => {
                callback(err, result);
              }
            );
          },
        ],
        (err, results) => {
          const docSala = results[0];
          const dataChunk = [];
          const chunkSize = 4;
          for (let i = 0; i < docSala.length; i += chunkSize) {
            dataChunk.push(docSala.slice(i, i + chunkSize));
          }
          res.render('members', {
            title: 'Cigames Chat - Members',
            user: req.user,
            chunks: dataChunk,
          });
        })
    },
    searchMembers: function (req, res) {
      async.parallel(
        [
          function (callback) {
            const regex = new RegExp(req.body.username, 'gi');
            Users.find({ 'username': regex },
              (err, result) => {
                callback(err, result);
              }
            );
          },
        ],
        (err, results) => {
          const docSala = results[0];
          const dataChunk = [];
          const chunkSize = 4;
          for (let i = 0; i < docSala.length; i += chunkSize) {
            dataChunk.push(docSala.slice(i, i + chunkSize));
          }
          res.render('members', {
            title: 'Cigames Chat - Members',
            user: req.user,
            chunks: dataChunk,
          });
        })
    }
  };
};
