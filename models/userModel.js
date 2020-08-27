const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const userSchema = mongoose.Schema({
  username: { type: String, unique: true, default: '' },
  fullname: { type: String, unique: true, default: '' },
  email: { type: String, unique: true },
  password: { type: String, default: '' },
  userImage: { type: String, default: 'default.png' },
  facebook: { type: String, default: '' },
  fbTokens: Array,
  google: { type: String, default: '' },
  sentRequest: [
    {
      username: { type: String, default: '' }
    }
  ],
  request: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: { type: String, default: '' }
    }
  ],
  friendsList: [
    {
      friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      friendName: { type: String, default: '' }
    }
  ],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  totalRequest: { type: Number, default: 0 },
  country: { type: String, default: '' },
  mantra: { type: String, default: '' },
  favGame: [{ gameName: { type: String, default: '' } }],
  favGameType: [{ gameType: { type: String, default: '' } }],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validUserPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//crearea unui token pentru resetarea parolei
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  console.log(resetToken, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

module.exports = mongoose.model('User', userSchema);
