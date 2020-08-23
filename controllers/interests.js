const path = require('path');
const fs = require('fs');
module.exports = function (async, Users, Message, FriendResult) {
    return {
        SetRouting: function (router) {
            router.get('/settings/interests', this.getInterestPage);
            router.post('/settings/interests', this.postInterestPage);

        },

        getInterestPage: function (req, res) {
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

                ],
                (err, results) => {
                    const result1 = results[0];
                    const result2 = results[1];


                    res.render('user/interest', {
                        title: 'Cigames Chat - Interests',
                        user: req.user,
                        data: result1,
                        chat: result2,

                    });
                }
            );

        },

        postInterestPage: function (req, res) {
            FriendResult.PostRequest(req, res, '/settings/interests');

            async.parallel([
                function (callback) {
                    if (req.body.favGame) {
                        Users.updateOne({
                            '_id': req.user._id,
                            'favGame.gameName': { $ne: req.body.favGame }
                        },
                            {
                                $push: {
                                    favGame: {
                                        gameName: req.body.favGame
                                    }
                                }
                            }, (err, result1) => {

                                callback(err, result1);
                            }
                        )
                    }

                }

            ], (err, results) => {
                res.redirect('/settings/interests');
            });

            async.parallel([

                function (callback) {
                    if (req.body.favGameType) {
                        Users.updateOne({
                            '_id': req.user._id,
                            'favGameType.gameType': { $ne: req.body.favGameType }
                        },
                            {
                                $push: {
                                    favGameType: {
                                        gameType: req.body.favGameType
                                    }
                                }
                            }, (err, result2) => {

                                callback(err, result2);
                            }
                        )
                    }

                }

            ], (err, results) => {
                res.redirect('/settings/interests');
            });
        }

    }
}

