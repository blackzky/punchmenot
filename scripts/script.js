var socket = io.connect('http://localhost:3000');

var CLIENT_SIDE_PLAYER_LIST;
var WORLD_MAP_DATA;
var CURRENT_PLAYER;


function getTile(row, col){
  return $("#" + row + "_" + col);
}
function renderPlayerMap(){
  var html = "";
  for(row in WORLD_MAP_DATA){
    html += "<div class='row'>";
    for(col in WORLD_MAP_DATA[row]){
      html += "<div class='column'><div id=" + row + "_" + col + " class='" + WORLD_MAP_DATA[row][col] + "'></div></div>";
    }
    html += "</div>";
  }
  $("#game_canvas").html(html);
}
function updatePlayerMap(){
  var tile;
  for(id in CLIENT_SIDE_PLAYER_LIST){
    tile = getTile(CLIENT_SIDE_PLAYER_LIST[id].row, CLIENT_SIDE_PLAYER_LIST[id].col);
    tile.attr("class", "player");
  }
}

$(document).ready(function() {
  socket.on('connect', function () {
    var player_name = prompt("Enter name:");
    socket.emit('addUser', player_name);

    socket.on('initPlayerConfig', function(world_map, player){
      WORLD_MAP_DATA = world_map;
      CURRENT_PLAYER = player;
      renderPlayerMap();
    });

    socket.on('setPlayerList', function(players) {
      CLIENT_SIDE_PLAYER_LIST = players;
      $("div#player_list ul").empty();
      for(id in players){
        $("div#player_list ul").append("<li>" + players[id].username + "</li>");
      } 
      updatePlayerMap();
    });

    socket.on('updateWorldMap', function(map){
      WORLD_MAP_DATA = map;
      renderPlayerMap(); 
    });
  });


  $(document).keydown(function(event) {
      socket.emit('keyDownInput', event.keyCode);
  });

});



/*
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
   */
