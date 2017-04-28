var express = require('express');
var ip = require('ip');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ss = require('socket.io-stream');
var fs = require('fs');
var path = require('path');
var latest = [];
var imgs = [];

console.log(">> " + ip.address());

server.listen(3000);
app.use(express.static(__dirname + '/html'));

io.on('connection', function (socket) {
  console.log("connection client");
  ss(socket).on('file', function(stream, data) {
    var unix = new Date().getTime();
    var ext = ".png";
    var out =  "up/" + unix + ext;
    stream.pipe(fs.createWriteStream(__dirname + "/html/" + out ));
    stream.on('finish', function () {
        imgs.push(out);
        socket.broadcast.emit("img", out);
        socket.emit("img", out);
    });
  });
  socket.on('mes', function(m) {
      let d = new Date();
      let hr = (d.getHours() > 10) ? d.getHours() : "0" + d.getHours();
      let min = (d.getMinutes() > 10) ? d.getMinutes() : "0" + d.getMinutes();
      m.time =  hr + ":" + min;
      console.log(m);
      latest.push(m);
      socket.broadcast.emit("mes", m);
      socket.emit("mes", m);
  });
  socket.on('login', function(n) {
      console.log("user: " + n);
      socket.emit("login", n);
      for(var i = 0; i < latest.length; i++) {
          socket.emit("mes", latest[i]);
      }
      for(var i = 0; i < imgs.length; i++) {
          socket.emit("img", imgs[i]);
      }
      console.log(n);
  });
});
