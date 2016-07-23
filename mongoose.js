var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/chat');
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:', err.message);
});

db.once('open', function callback () {
    console.log("Connected to DB!");
});

var Schema = mongoose.Schema;


var Message = new Schema({
    author: { type: String, required: true },
    text: { type: String, required: true }
});


var MessageModel = mongoose.model('Message', Message);
module.exports.MessageModel = MessageModel;
