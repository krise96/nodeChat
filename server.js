var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('./mongoose.js');
var methodOverride = require('method-override');

var app = express();
var router = express.Router();
var server = app.listen(1337);
var io = require('socket.io').listen(server);



app.use(bodyParser.json())
app.use(router);
app.use(express.static(path.join(__dirname, "public"))); 
app.use(methodOverride());


app.get('/messages', function(req, res) {
    console.log('GET method');
    return mongoose.MessageModel.find(function (err, messages) {
        if (!err) {
            return res.send(messages);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.delete('/messages', function (req, res){
    console.log("Delete method");
    console.log({author: req.body.author, text: req.body.text});
    try{
    mongoose.MessageModel.findOne({author: req.body.author, text: req.body.text}).remove().exec();
    }catch(e){
        return res.send({ status: 'Bad request'});
    }
    return res.send({ status: 'OK'});
});

app.post('/messages', function(req, res) {
    console.log(req.body);
    
    var message = new mongoose.MessageModel({
        author: req.body.author,
        text: req.body.text,
    });
    console.log(req.body.author);
    console.log(message.text);
    
    message.save(function (err) {
        if (!err) {
            console.log("message added");
            return res.send({ status: 'OK', message:message });
        } else {
            console.log(err);
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            console.log('Internal error(%d): %s',res.statusCode,err.message);
        }
    });
});


app.get('/sockets', function (req, res) {
	res.sendfile('public/indexSoc.html');
});





io.sockets.on('connection', function (socket) {
    
    //Коли я намагався винести це в окрему функцію вибивала помилка, нічого не міг з цим вдіяти.
    mongoose.MessageModel.find({},function(err, msg){
        if(!err){
            console.log('!err');
            socket.emit('history', msg);
        }else console.log('err');
    });
 
    socket.on('delete', function(data){
        try{
            mongoose.MessageModel.findOne({author: data.author, text: data.text}).remove().exec();
        }catch(e){
            return console.log('Bad request');
        }
        mongoose.MessageModel.find({},function(err, msg){
            if(!err){
                console.log('!err');
                socket.emit('history', msg);
                socket.broadcast.emit('history', msg);
            }else console.log('err');
        });
    })       
    
	socket.on('message', function (data) {
        console.log(data);
		var message = new mongoose.MessageModel({
            author: data.author,
            text: data.text,
        });
    
        console.log(message.author);
        console.log(message.text);    
    
    
        message.save(function (err) {
        if (!err) {
            console.log("message added");
            
        mongoose.MessageModel.find({},function(err, msg){
        if(!err){
            console.log('!err');
            socket.emit('history', msg);
            socket.broadcast.emit('history', msg);
        }else console.log('err');
    });
        } else {
               socket.json.send({ error: 'Server error' });
        }
    });
    
	});

});






