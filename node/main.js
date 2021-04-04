var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

import { Gpio } from 'onoff'; //library  GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4

app.get('/', function(req, res) {
   res.sendFile('index.html', { root: __dirname });
});


io.on('connection', function(socket) {
    console.log('Client connected ');
 
    //Send a message after every 10 seconds
    blinkInterval = setInterval(function() {
        if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
            LED.writeSync(1); //set pin state to 1 (turn LED on)
            socket.send('Led on !');
          } else {
            LED.writeSync(0); //set pin state to 0 (turn LED off)
            socket.send('Led off !');
          }
       
    }, 10000);
 
    socket.on('disconnect', function () {
        clearInterval(blinkInterval); // Stop blink intervals
        LED.writeSync(0); // Turn LED off
        LED.unexport(); // Unexport GPIO to free resources
    });
 });

http.listen(3000, function() {
    //by Fggn 2021
   console.log('Krasamo  test server:3000');
});