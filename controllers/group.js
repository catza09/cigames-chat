module.exports = function (Users, async, Message, FriendResult, Group) {
  return {
    SetRouting: function (router) {
      router.get('/group/:name', this.groupPage);
      router.post('/group/:name', this.groupPostPage);
      router.get('/logout', this.logout);
    },

    groupPage: function (req, res) {
      const name = req.params.name;
      //afisarea notificarilor de prietenie
      async.parallel(
        [
          function (callback) {
            Users.findOne({ 'username': req.user.username })
              .populate('request.userId')
              .exec((err, result) => {
                callback(err, result);
              });
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
                },
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
          //functie pentru cautarea mesajelor din bazade date pentru acel group
          function (callback) {
            Group.find({})
              .populate('sender')
              .exec((err, result) => {
<<<<<<< HEAD
=======
                //   console.log(result);
>>>>>>> 242922975f9107402854034588ed5f13e6147d24
                callback(err, result);
              });
          }
        ],
        (err, results) => {
          const result1 = results[0];
          const result2 = results[1];
          const result3 = results[2];

          res.render('groupchat/group', {
            title: 'Cigames Chat - Group',
            user: req.user,
            groupName: name,
            data: result1,
            chat: result2,
            groupMsg: result3

          });
        }
      );
    },
    groupPostPage: function (req, res) {
      FriendResult.PostRequest(req, res, '/group/' + req.params.name);

      //trimiterea datelor catre baza de date pentru grup
      async.parallel([
        function (callback) {
          if (req.body.message) {
            const group = new Group();
            group.sender = req.user._id;
            group.body = req.body.message;
            group.name = req.body.groupName;
            group.createdAt = new Date();
            group.save((err, msg) => {

              callback(err, msg);
            });
          }
        }
      ], (err, results) => {
        res.redirect('/group/' + req.params.name);
      })
    },
    logout: function (req, res) {
      req.logout();
      req.session.destroy((err) => {
        res.redirect('/');
      });
    }
  };
};
