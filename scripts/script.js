var socket = io.connect('http://localhost:3000');
var player_name = "";
socket.on('connect', function () {
	//player_name = prompt("Enter name:");
	//socket.emit('addUser', player_name);
	socket.on('setPlayerList', function(data) {
		$("div#player_list ul").empty();
		for(var i = 0; i < data.length; i++){
			$("div#player_list ul").append("<li>" + data[i] + "</li>");
		} 
	});

	socket.on('updatePlayerList', function(data){
		$("div#player_list ul").append("<li>" + data + "</li>");
	});
});

$(document).ready(function() {
	TILE_SIZE  = 32;
	canvas_width = $("#game_canvas").width();
	canvas_height = $("#game_canvas").height();
	
	$MAP_INFO = {
		max_col : canvas_width/TILE_SIZE,
		max_row : canvas_height/TILE_SIZE
	};
	$("#game_canvas").css({
		"width" : canvas_width+"px",
		"height" : canvas_height+"px"
	});
	initMap();
	

	$PLAYER = {
		name : "player",
		row : 0,
		col: 0
	}
	
	initPlayer();
	generateRandomObjects("rock", 5);
	
	$KEY = {
		"w" : 87,
		"a" : 65,
		"s" : 83,
		"d" : 68
	}

	$(document).keydown(function(event) {
		movePlayer(event);
	});
	
});

function movePlayer(event){
	var current_tile, adjacent_tile;
	current_tile = getTile($PLAYER.row, $PLAYER.col);
	switch(event.keyCode){
			case $KEY.w:
				adjacent_tile = getPlayerAdjacentTile("up");
				if(adjacent_tile.attr("class") == "empty"){
					current_tile.attr("class", "empty");
					$PLAYER.row--;
					adjacent_tile.attr("class", "player");
				}
			break;
			case $KEY.a:
				adjacent_tile = getPlayerAdjacentTile("left");
				if(adjacent_tile.attr("class") == "empty"){
					current_tile.attr("class", "empty");
					$PLAYER.col--;
					adjacent_tile.attr("class", "player");
				}
			break;
			case $KEY.s:
				adjacent_tile = getPlayerAdjacentTile("down");
				if(adjacent_tile.attr("class") == "empty"){
					current_tile.attr("class", "empty");
					$PLAYER.row++;
					adjacent_tile.attr("class", "player");
				}
			break;
			case $KEY.d:
				adjacent_tile = getPlayerAdjacentTile("right");
				if(adjacent_tile.attr("class") == "empty"){
					current_tile.attr("class", "empty");
					$PLAYER.col++;
					adjacent_tile.attr("class", "player");
				}
			break;
		}
}

function getPlayerAdjacentTile(direction){
	switch(direction){
		case "up":
			return getTile($PLAYER.row - 1, $PLAYER.col);
		break;
		case "down":
			return getTile($PLAYER.row + 1, $PLAYER.col);
		break;
		case "left":
			return getTile($PLAYER.row, $PLAYER.col - 1);
		break;
		case "right":
			return getTile($PLAYER.row, $PLAYER.col + 1);
		break;
	}
}
function getTile(row, col){
	return $("#" + row + "_" + col);
}
function generateRandomObjects(object, occurance){
	if(occurance == 0){
		return;
	}
	var position = randomPosition();
	var tile = getTile(position.row, position.col);
	if(tile.attr("class") == "empty"){
		tile.attr("class", object);
		occurance--;
		generateRandomObjects(object, occurance);
	}else{
		generateRandomObjects(object, occurance);
	}
}
function initPlayer(){
	player_postion = randomPosition();
	$PLAYER.row = player_postion.row;
	$PLAYER.col = player_postion.col;
	var tile = getTile($PLAYER.row, $PLAYER.col);
	if(tile.attr("class") == "empty"){
		tile.attr("class", "player");
	}else{
		initPlayer();
	}
	
	
}
function randomPosition(){
	var position = {row:0, col:0};
	position.row = parseInt(Math.random() * $MAP_INFO.max_row);
	position.col = parseInt(Math.random() * $MAP_INFO.max_col);
	return position;
}
function initMap(){
	var html = "";
	$MAP_DATA = Array($MAP_INFO.max_row);
	for(row=0;row<$MAP_INFO.max_row;row++){
		$MAP_DATA[row] = Array($MAP_INFO.max_col);
		html += "<div class='row'>";
		for(col=0;col<$MAP_INFO.max_col;col++){
			$MAP_DATA[col] = "empty";
			html += "<div class='column'><div id=" + row + "_" + col + " class='" + 'empty' + "'></div></div>";
		}
		html += "</div>";
	}
	$("#game_canvas").html(html);
}