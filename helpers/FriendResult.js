module.exports = function (async, Users, Message) {
    return {
        PostRequest: function (req, res, url) {
            async.parallel([
                function (callback) {

                    if (req.body.receiverName) {
                        Users.updateOne(
                            //verificare daca userul nu a mai primit cererea de prietenie sau a acceptat-o deja
                            {
                                'username': req.body.receiverName,
                                'request.userId': { $ne: req.user._id },
                                'friendsList.friendId': { $ne: req.user._id }
                            },
                            {
                                //adaugarea in array-ul request din model, datele sunt pentru receptorul cererii
                                $push: {
                                    request: {
                                        userId: req.user._id,
                                        username: req.user.username
                                    }
                                },
                                $inc: { totalRequest: 1 }
                            },
                            (err, count) => {
                                callback(err, count);
                            }
                        );
                    }
                },

                function (callback) {
                    if (req.body.receiverName) {
                        Users.updateOne(
                            {
                                //verificare daca exista deja o cerere trimisa
                                'username': req.user.username,
                                'sentRequest.username': { $ne: req.body.receiverName }
                            },
                            //adaugarea in array-ul sentRequest din model, datele sunt pentru emitatorul cererii
                            {
                                $push: {
                                    sentRequest: {
                                        username: req.body.receiverName
                                    }
                                }
                            },
                            (err, count) => {
                                callback(err, count);
                            }
                        );
                    }
                }
            ],
                (err, results) => {
                    res.redirect(url);
                }
            );

            async.parallel(
                [
                    //aceasta functie este actualizata pentru destinatarul cererii de prietenie atuncti cand este acceptata
                    function (callback) {
                        if (req.body.senderId) {
                            Users.updateOne(
                                {
                                    '_id': req.user._id,
                                    'friendsList.friendId': { $ne: req.body.senderId }
                                },
                                {
                                    $push: {
                                        friendsList: {
                                            friendId: req.body.senderId,
                                            friendName: req.body.senderName
                                        }
                                    },
                                    $pull: {
                                        request: {
                                            userId: req.body.senderId,
                                            username: req.body.senderName
                                        }
                                    },
                                    $inc: { totalRequest: -1 }
                                },
                                (err, count) => {
                                    callback(err, count);
                                }
                            );
                        }
                    },
                    //aceasta functie este actualizata pentru destinatarul cererii de prietenie atuncti cand este acceptata de catre expeditor
                    function (callback) {
                        if (req.body.senderId) {
                            Users.updateOne(
                                {
                                    '_id': req.body.senderId,
                                    'friendsList.friendId': { $ne: req.user._id }
                                },
                                {
                                    $push: {
                                        friendsList: {
                                            friendId: req.user._id,
                                            friendName: req.user.username
                                        }
                                    },
                                    $pull: {
                                        sentRequest: {
                                            username: req.user.username
                                        }
                                    }
                                },
                                (err, count) => {
                                    callback(err, count);
                                }
                            );
                        }
                    },

                    //anulare cerere prietenie pentru receptor
                    function (callback) {
                        if (req.body.user_Id) {
                            Users.updateOne(
                                {
                                    '_id': req.user._id,
                                    'request.userId': { $eq: req.body.user_Id }
                                },
                                {
                                    $pull: {
                                        request: {
                                            userId: req.body.user_Id
                                        }
                                    },
                                    $inc: { totalRequest: -1 }
                                },
                                (err, count) => {
                                    callback(err, count);
                                }
                            );
                        }
                    },

                    //anulare cerere prietenie pentru emitator
                    function (callback) {
                        if (req.body.user_Id) {
                            Users.updateOne(
                                {
                                    '_id': req.body.user_Id,
                                    'sentRequest.username': { $eq: req.user.username }
                                },
                                {
                                    $pull: {
                                        sentRequest: {
                                            username: req.user.username
                                        }
                                    }
                                },
                                (err, count) => {
                                    callback(err, count);
                                }
                            );
                        }
                    },

                    // mesaj citit
                    function (callback) {
                        if (req.body.chatId) {
                            Message.update({
                                '_id': req.body.chatId
                            },
                                {
                                    "isRead": true
                                }, (err, done) => {
                                    //  console.log(done);
                                    callback(err, done);
                                })
                        }
                    }
                ],
                (err, results) => {
                    res.redirect(url);
                }
            );

        }
    }
}