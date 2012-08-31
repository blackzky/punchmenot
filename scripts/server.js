var app = require('http').createServer(handler),
io  = require('socket.io').listen(app),
fs  = require('fs');
var path = require('path');

app.listen(3000);

var CONTENT_TYPE = "text/plain";
var FILE_NAME = "";

function handler(request, response) {

  var filePath = '.' + request.url;
  if (filePath == './')
    filePath = './index.html';

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
    break;
    case '.css':
      contentType = 'text/css';
    break;
    case '.png':
      contentType = 'image/png';
    break;
  }

  path.exists(filePath, function(exists) {

    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          response.writeHead(500);
          response.end();
        }
        else {
          response.writeHead(200, { 'Content-Type': contentType });
          response.end(content, 'utf-8');
        }
      });
    }
    else {
      response.writeHead(404);
      response.end();
    }
  });

}


var WORLD_MAP_INFO = {
  TILE_SIZE : 32,
  MAX_COL : 25,
  MAX_ROW : 18
};
var WORLD_MAP_DATA;
var PLAYERS = [];
var KEYCODE = {
  "UP" : 87,
  "LEFT" : 65,
  "DOWN" : 83,
  "RIGHT" : 68
};

function generateRandomPosition(){
  var position = {row:0, col:0};
  position.row = parseInt(Math.random() * WORLD_MAP_INFO.MAX_ROW);
  position.col = parseInt(Math.random() * WORLD_MAP_INFO.MAX_COL);
  return position;
}
function initWorldMap(){
  WORLD_MAP_DATA = Array(WORLD_MAP_INFO.MAX_ROW);
  for(row = 0; row < WORLD_MAP_INFO.MAX_ROW; row++){
    WORLD_MAP_DATA[row] = Array(WORLD_MAP_INFO.MAX_COL);
    for(col = 0; col < WORLD_MAP_INFO.MAX_COL; col++){
      WORLD_MAP_DATA[row][col] = "empty";
    }
  }
  generateRandomObjects("rock", 5);
}
function generateRandomObjects(object, occurance){
  if(occurance == 0){	return;	}
  var position = generateRandomPosition();
  var tile = WORLD_MAP_DATA[position.row][position.col];
  if(tile == "empty"){
    WORLD_MAP_DATA[position.row][position.col] = object;
    occurance--;
    generateRandomObjects(object, occurance);
  }else{
    generateRandomObjects(object, occurance);
  }
}
function initPlayer(username){
  var position = generateRandomPosition();	
  var tile = WORLD_MAP_DATA[position.row][position.col];

  if(tile == "empty"){
    PLAYERS.push({
      username : username,
      row : position.row,
      col : position.col
    });
  }else{
    initPlayer(username);
  }
}
function getTile(row, col){
  row = parseInt(row);
  col = parseInt(col);
  return WORLD_MAP_DATA[row][col];
}
function getPlayerAdjacentTile(direction, row, col){
  switch(direction){
    case KEYCODE.UP:
      return getTile(row - 1, col);
    break;
    case KEYCODE.DOWN:
      return getTile(row + 1, col);
    break;
    case KEYCODE.LEFT:
      return getTile(row, col - 1);
    break;
    case KEYCODE.RIGHT:
      return getTile(row, col + 1);
    break;
  }
}
initWorldMap();
function setTile(object, row, col) {
  WORLD_MAP_DATA[row][col] = object;
}
function isEmptyTile(tile){
  return (tile == "empty");
}

io.sockets.on('connection', function (socket) {
  //socket.on('message', function () { });

  socket.on('addUser', function(username){
    initPlayer(username);
    socket.player_id = PLAYERS.length - 1;
    socket.username = PLAYERS[socket.player_id].name;
    socket.row = PLAYERS[socket.player_id].row;
    socket.col = PLAYERS[socket.player_id].col;
    socket.emit('initPlayerConfig', WORLD_MAP_DATA, PLAYERS[socket.player_id]);
    io.sockets.emit('setPlayerList', PLAYERS);
  });

  socket.on('keyDownInput', function(keyCode){
    var tile =  getPlayerAdjacentTile(keyCode, socket.row, socket.col);
    if(isEmptyTile(tile)){
      movePlayer(keyCode, socket.row, socket.col);
    }
  });

  function movePlayer(dir, row, col){
    switch(dir){
      case KEYCODE.UP:
        setTile("empty", row, col);
        socket.row = row - 1;
        socket.col = col;
        setTile("player", socket.row, socket.col);
        io.sockets.emit('updateWorldMap', WORLD_MAP_DATA);
      break;
      case KEYCODE.DOWN:
        setTile("empty", row, col);
        socket.row = row + 1;
        socket.col = col;
        setTile("player", socket.row, socket.col);
        io.sockets.emit('updateWorldMap', WORLD_MAP_DATA);
      break;
      case KEYCODE.LEFT:
        setTile("empty", row, col);
        socket.row = row;
        socket.col = col - 1;
        setTile("player", socket.row, socket.col);
        io.sockets.emit('updateWorldMap', WORLD_MAP_DATA);
      break;
      case KEYCODE.RIGHT:
        setTile("empty", row, col);
        socket.row = row;
        socket.col = col + 1;
        setTile("player", socket.row, socket.col);
        io.sockets.emit('updateWorldMap', WORLD_MAP_DATA);
      break;
    }
  }

  socket.on('disconnect', function () { });

});
