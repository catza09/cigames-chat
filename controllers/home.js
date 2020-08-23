module.exports = function (async, Game, _, Users, Message, FriendResult) {
  return {
    SetRouting: function (router) {
      router.get('/home', this.homePage);
      router.post('/home', this.postHomePage);

      router.get('/logout', this.logout);
    },

    homePage: function (req, res) {
      async.parallel(
        [
          function (callback) {
            Game.find({}, (err, result) => {
              callback(err, result);
            })
          },
          function (callback) {
            Game.aggregate(
              [
                {
                  $group: {
                    _id: "$gameType",
                  }
                }
              ],
              (err, newResult) => {
                callback(err, newResult);
              }
            );
          },
          function (callback) {
            Users.findOne({ 'username': req.user.username })
              .populate('request.userId')
              .exec((err, result) => {
                callback(err, result);
              })
          },
          function (callback) {
            const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i");
            Message.aggregate(
              [
                {
                  $match: {
                    $or: [
                      { "senderName": nameRegex },
                      { "receiverName": nameRegex }
                    ]
                  }
                },
                { $sort: { "createdAt": -1 } },
                {
                  $group: {
                    "_id": {
                      "last_message_between": {
                        $cond: [
                          {
                            $gt: [
                              { $substr: ["$senderName", 0, 1] },
                              { $substr: ["$receiverName", 0, 1] }]
                          },

                          { $concat: ["$senderName", " and ", "$receiverName"] },
                          { $concat: ["$receiverName", " and ", "$senderName"] }
                        ]
                      }
                    },
                    "body": { $first: "$$ROOT" }
                  }
                }
              ], function (err, newResult) {
                const arr = [
                  { path: 'body.sender', model: 'User' },
                  { path: 'body.receiver', model: 'User' }];
                Message.populate(newResult, arr, (err, newResult1) => {
                  // console.log(newResult1[0].body.sender);
                  callback(err, newResult1);
                });
              }
            );
          },

        ],

        (err, results) => {
          //afisarea salilor cate trei pe pagina si notificarilor
          const docSala = results[0];
          const gameType = results[1];
          const dateHome = results[2];
          const chat = results[3];
          const dataChunk = [];
          const chunkSize = 3;
          for (let i = 0; i < docSala.length; i += chunkSize) {
            dataChunk.push(docSala.slice(i, i + chunkSize));
          }
          const gameSort = _.sortBy(gameType, '_id');
          res.render('home', {
            title: "Cigames Chat - Home",
            user: req.user,
            chunks: dataChunk,
            gameType: gameSort,
            data: dateHome,
            chat: chat
          });
        }
      );
    },
    //salvarea in baza de date a utilizatorilor abonati la canal
    postHomePage: function (req, res) {
      async.parallel(
        [
          function (callback) {
            Game.updateOne(
              {
                '_id': req.body.id,
                'subscribers.username': { $ne: req.user.username },
              },
              {
                $push: {
                  subscribers: {
                    username: req.user.username,
                    email: req.user.email,
                  },
                },
              },
              (err, count) => {
                callback(err, count);
              }
            );
          },

        ],
        (err, results) => {
          res.redirect("/home");
        }
      );

      FriendResult.PostRequest(req, res, '/home');
    },
    logout: function (req, res) {
      req.logout();
      req.session.destroy((err) => {
        res.redirect("/");
      });
    },
  };
};
