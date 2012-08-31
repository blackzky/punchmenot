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
	MAX_ROW : 18,
};
var WORLD_MAP_DATA;
var PLAYERS = [];
var KEYCODE = {
	"w" : 87,
	"a" : 65,
	"s" : 83,
	"d" : 68
};

function initWorldMap(){
	WORLD_MAP_DATA = Array(WORLD_MAP_INFO.MAX_ROW);
	for(row = 0; row < WORLD_MAP_INFO.MAX_ROW; row++){
		WORLD_MAP_DATA[row] = Array(WORLD_MAP_INFO.MAX_COL);
		for(col = 0; col < WORLD_MAP_INFO.MAX_COL; col++){
			WORLD_MAP_DATA[row][col] = "empty";
		}
	}
}
function generateRandomPosition(){
	var position = {row:0, col:0};
	position.row = parseInt(Math.random() * WORLD_MAP_INFO.MAX_ROW);
	position.col = parseInt(Math.random() * WORLD_MAP_INFO.MAX_COL);
	return position;
}
function generateRandomObjects(object, occurance){
	if(occurance == 0){	return;	}
	var position = generateRandomPosition();
	var tile = WORLD_MAP_DATA[position.row][position.col];
	if(tile == "empty"){
		tile = object;
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
	return WORLD_MAP_DATA[row][col];
}
function movePlayer(event){
	var current_tile, adjacent_tile;
	current_tile = getTile(WORLD_MAP_DATA.row, WORLD_MAP_DATA.col);
	switch(event.keyCode){
			case $KEY.w:
				adjacent_tile = getPlayerAdjacentTile("up");
				if(adjacent_tile.attr("class") == "empty"){
					current_tile.attr("class", "empty");
					WORLD_MAP_DATA.row--;
					adjacent_tile.attr("class", "player");
				}
			break;
			case $KEY.a:
				adjacent_tile = getPlayerAdjacentTile("left");
				if(adjacent_tile.attr("class") == "empty"){
					current_tile.attr("class", "empty");
					WORLD_MAP_DATA.col--;
					adjacent_tile.attr("class", "player");
				}
			break;
			case $KEY.s:
				adjacent_tile = getPlayerAdjacentTile("down");
				if(adjacent_tile.attr("class") == "empty"){
					current_tile.attr("class", "empty");
					WORLD_MAP_DATA.row++;
					adjacent_tile.attr("class", "player");
				}
			break;
			case $KEY.d:
				adjacent_tile = getPlayerAdjacentTile("right");
				if(adjacent_tile.attr("class") == "empty"){
					current_tile.attr("class", "empty");
					WORLD_MAP_DATA.col++;
					adjacent_tile.attr("class", "player");
				}
			break;
		}
}

function getPlayerAdjacentTile(direction){
	switch(direction){
		case "up":
			return getTile(WORLD_MAP_DATA.row - 1, WORLD_MAP_DATA.col);
		break;
		case "down":
			return getTile(WORLD_MAP_DATA.row + 1, WORLD_MAP_DATA.col);
		break;
		case "left":
			return getTile(WORLD_MAP_DATA.row, WORLD_MAP_DATA.col - 1);
		break;
		case "right":
			return getTile(WORLD_MAP_DATA.row, WORLD_MAP_DATA.col + 1);
		break;
	}
}

initWorldMap();
generateRandomObjects("rock", 5);

io.sockets.on('connection', function (socket) {
  //socket.on('message', function () { });

  socket.on('addUser', function(username){
	initPlayer(username);
	socket.player_id = PLAYERS.length - 1;
	console.log(socket.player_id);
	socket.username = PLAYERS[socket.player_id].name;
	socket.row = PLAYERS[socket.player_id].row;
	socket.col = PLAYERS[socket.player_id].col;
    //socket.emit('initPlayerConfig', WORLD_MAP_DATA, PLAYERS[PLAYERS.length-1]);
    //io.sockets.emit('setPlayerList', PLAYERS);
  });
  
  socket.on('keyDownInput', function(keyCode){
	
	switch(keyCode){
			case KEYCODE.w:
				getPlayerAdjacentTile("up");
			break;
			case KEYCODE.a:
				getPlayerAdjacentTile("left");
			break;
			case KEYCODE.s:
				getPlayerAdjacentTile("down");
			break;
			case KEYCODE.d:
				getPlayerAdjacentTile("right");
			break;
		}
  });

  socket.on('disconnect', function () { });

});


