'use strict'

//basic settings for game
//  object_body = each object with and height
//  c_width = canvas width, if changing u must update canvas size and columns in engine.js
//  c_height = canvas height, if changing u must update canvas size and rows in engine.js
var game_set = {
  "object_body": 100,
  "c_width": 707,
  "c_height": 1120
};

//basic settings for game
var player_set = {
  "default_x" : 200,
  "default_y" : 440,
  "step": 50
};

var water =  [[0, 140],[815, 1100]];

///////////
//// Enemy
//////////

// Enemies our player must avoid
var Enemy = function(x, y) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.x = x;
  this.y = y;
  this.speed = Math.floor(Math.random() * 200 + 100);
  this.direction = randomDirection();
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if(this.direction === "right"){
    if(this.x < game_set.c_width+100){
      this.sprite = 'images/enemy-bug.png';
      this.x = this.x + this.speed * dt;
    }else {

      this.x = -150;
      this.speed = Math.floor(Math.random() * 200 + 100);
      this.direction = randomDirection();
    }
  }
  if(this.direction === "left"){
    if(this.x > -150){
      this.sprite = 'images/enemy-bug-left.png';
      this.x = this.x - this.speed * dt;
    }else {
      this.x = game_set.c_width+150;
      this.speed = Math.floor(Math.random() * 200 + 100);
      this.direction = randomDirection();
    }
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

///////////
//// Player
//////////
var Player = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/char-boy.png';
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function() {
  if(this.x > game_set.c_width-80){
    this.x = this.x - player_set.step;
  }else if(this.x < -25) {
    this.x = this.x + player_set.step;
  }else if(this.y > game_set.c_height - 250){
    this.y = this.y - player_set.step;
  }else if(this.y < +25){
    this.y = this.y + player_set.step;
  }
  waterCheck(water);
  console.log(this.x +" "+this.y);
};


Player.prototype.handleInput = function(key) {
  switch (key) {
    case "up":
        this.y = this.y - player_set.step;
        break;
    case "down":
        this.y = this.y + player_set.step;
        break;
    case "left":
        this.x = this.x - player_set.step;
        break;
    case "right":
        this.x = this.x + player_set.step;
        break;
  }
};
//takes json
// Player.prototype.stepWater = function(Json){
//   for(var i=0; i<Json.length; i++){
//     console.log(Json[i].x);
//   }
// };

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(player_set.default_x, player_set.default_y);

//all rows y coordinates allowed for enemy to spawn at
var rowArray = [200, 285, 370, 620 ,700, 780];

//enemy per row
var epr = 2;

var allEnemies = [];

//creates enemies for each row
for(var row = 0; row < rowArray.length; row++){
  for(var enemy = 0; enemy < epr; enemy++){
    var e = new Enemy(xEposition(), rowArray[row]);
    allEnemies.push(e);
  }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});


/////////////
//// Functions
////////////

//everytime runs it checks for each enemy postion relative to player position and resets player to default starting position
function checkCollisions(enemies, player){
  enemies.forEach(function(enemy){
    /////left///////////////////////////right//////////////////////////down////////////////////up/////////////
    if(enemy.x > player.x -25 && enemy.x < player.x + 25 && enemy.y > player.y -20 && enemy.y < player.y + 70){
      player.x = player_set.default_x;
      player.y = player_set.default_y;
    }
  });
}

//tells enemy which direction to take
function randomDirection(){
  var direction = Math.floor(Math.random()*2 + 1);
  if(direction === 1){
    return "right";
  }else{
    return "left";
  }
}

//sets randomly  x coordinates for each enemy
function xEposition(){
  var x =  Math.floor(Math.random()* game_set.c_width + 1);
  return x;
}

//if player in water resets to default location
//param: array with sets of coordinates
function waterCheck(array){
  for(var i=0; i<array.length; i++){
    if(player.y > array[i][0] && player.y < array[i][1] ){
      setTimeout(function(){
        player.x = player_set.default_x;
        player.y = player_set.default_y;
      }, 500);
    }
  }
}
