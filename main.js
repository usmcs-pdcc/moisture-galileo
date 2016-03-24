/* moisture-galileo
 * author: hadrihl // hadrihilmi@gmail.com */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var socket = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client.html');
});

http.listen(55555, function() {
    console.log("moisture-galileo is listening at *:55555");
});

var mraa = require('mraa'); // include Libmraa
console.log("MRAA version: " + mraa.getVersion()); // print the Libmraa version

var pin = new mraa.Aio(0); // bind moisture sensor to analog pin A0

function measureMoistureLevel(socket) {
    var data = pin.read();
    
    socket.emit('stream', data);
    console.log("moisture level: " + data);
}

socket.on('connect', function(socket) {
    console.log("user connected");
    
    var intervalID = setInterval(function() {
        measureMoistureLevel(socket);
    }, 1000);

    socket.on('disconnect', function() {
        console.log("user disconnected");
        clearInterval(intervalID);        
    });
});





