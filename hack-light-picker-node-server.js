// Copyright (C) Richard Maxwell, 2014.

var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io')
    , express = require('express');
    
var app = express();

app.configure(
    function()
    {
        app.use(express.static(__dirname + '/html'));
    });
    
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(8080);

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort(
    '\\\\.\\COM12',
    {   
        baudrate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    });

serialPort.on(
    "open", 
    function () 
    {
        console.log('open');
        serialPort.on(
            'data', 
            function(data)
            {
                console.log('data received: ' + data);
            });
    });

socketio.listen(server).on(
    'connection', 
    function (socket) 
    {
        socket.on(
            'message', 
            function (msg) 
            {
                console.log('Message Received: ', msg);
                socket.broadcast.emit('message', msg);
                
                // No input validation, what could possible go wrong?
                // Expected format is HTML colour code: #RRGGBB.
                serialPort.write(msg);
            });
    });
