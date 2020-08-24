const mongoose = require('mongoose');

const gamesNames = mongoose.Schema({
  name: { type: String, default: '' },
  gameType: { type: String, default: '' },
  image: { type: String, default: 'defaultGame.png' },
  description: { type: String, default: '' },
  subscribers: [
    {
      username: { type: String, default: '' },
      email: { type: String, default: '' },
    },
  ],
});

module.exports = mongoose.model('Game', gamesNames);
