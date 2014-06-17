// Copyright (C) Richard Maxwell, 2014.

var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io');

// Argh, anonomouse lamdas, now to indent?!
var server = http.createServer(
    function(req, res) 
    {
        res.writeHead(200, { 'Content-type': 'text/html'});
        res.end(fs.readFileSync(__dirname + '/hack-light-picker.html'));
    }).listen(
        8080, 
        function() 
        {
            console.log('Listening at: http://localhost:8080');
        });

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
