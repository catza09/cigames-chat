module.exports = function () {
    return {
        SetRouting: function (router) {
            router.get('/latest-game-news', this.gameNews);
        },

        gameNews: function (req, res) {
            res.render('news/gameNews', { title: "Cigames Chat - Game News", user: req.user });
        }
    }
}