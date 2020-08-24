const mongoose = require('mongoose');
var groupSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    body: { type: String },
    name: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupMessage', groupSchema);
