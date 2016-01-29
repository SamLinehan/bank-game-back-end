var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function(){
  console.log('listening on localhost:3000');
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

app.get('/', function(request, response){
  response.render('index');
})

var playerId = 0;
var playerPairs = [];

io.on('connection', function(socket){
    socket.emit('connect', playerId);

    var playerAssigned;

    for(var i in playerPairs){
      if(!playerPairs[i].player1){
        playerPairs[i].player1 = playerId;
        playerAssigned = 1;
        break;
      } else if(!playerPairs[i].player2){
        playerPairs[i].player2 = playerId;
        playerAssigned = 2;
        break;
      }
    }

    if(!playerAssigned){
      playerPairs.push({player1: playerId});
      playerAssigned = 1;
    }

    socket.emit('pair', playerAssigned);

    playerId++;
});

// io.on('connection', function(socket){
//   socket.on('chat message', function(message){
//     console.log(message);
//     io.emit('chat message', message);
//   });
// });
