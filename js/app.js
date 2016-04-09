'use strict'

//basic settings for game
//  object_body = each object with and height
//  c_width = canvas width, if changing u must update canvas size and columns in engine.js
//  c_height = canvas height, if changing u must update canvas size and rows in engine.js
var game_set = {
  "object_body": 100,
  "c_width": 707,
  "c_height": 1120,
  "lives": 3
};

//basic settings for game
var player_set = {
  "default_x" : 200,
  "default_y" : 440,
  "step": 50
};

//coordinates on y axis
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
  this.stop = false;
  this.win = false;
  this.gm = false; // game over
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
};


Player.prototype.handleInput = function(key) {
  if(this.stop === false){

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
  }
};

///////////
//// Collectibles
//////////

var Gem = function(image, x, y){
  this.sprite = image;
  this.x = x;
  this.y = y;
  this.run = false;
};

Gem.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.update = function(dt){
  if(this.run === true){
    this.x = (this.x + 30) + 550 *dt;
  }
};

///////////
//// Scores
//////////
var Score = function(x, y, sprite){
  this.x = x;
  this.y = y;
  this.sprite = sprite;
}

Score.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 20, 20);
};

Score.prototype.update = function(){

};

var ScoreGems = function(x, y, sprite){
  this.x = x;
  this.y = y;
  this.sprite = sprite;
}
ScoreGems.prototype = Object.create(Score.prototype);

//////////
//// Player settings
/////////
var player = new Player(player_set.default_x, player_set.default_y);

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

//////////
//// Enemies settings
/////////

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

//////////
//// Gems settings
/////////
var allGems = [];
//gem locations
var gemLinks = ["images/gem-red.png", "images/gem-green.png", "images/gem-orange.png"];

//gem locations
var gml = [
  [600, 220],
  [50, 220],
  [250, 700],
  [100, 800],
  [550, 800],
  [550, 350]
];

//creates gems on the map, randomly chooses images from gemLinks
for(var gem = 0;gem < gml.length; gem++){
  var randomGem = Math.floor(Math.random() * gemLinks.length);
  allGems.push(new Gem(gemLinks[randomGem], gml[gem][0], gml[gem][1]));
}

//////////
//// Lives and scores settings
/////////
var points = 0;
var allScore = [];

//score position
var sp = 20;

//generates lives, it is set in basic games settings
for(var i=0; i < game_set.lives; i++ ){
  allScore.push(new Score(sp ,60, "images/Heart.png"));
  sp += 20;
}

/////////////
//// Functions
////////////

//everytime runs it checks for each enemy postion relative to player position and resets player to default starting position

//score postion gem
var spGem = 450; //keeps track of picked gems increses by 40 everytime to position picked gems correctly on screen
function checkCollisions(enemies, player, gems){

  enemies.forEach(function(enemy){
    //keeps track of player and enemy colisions
    /////left///////////////////////////right//////////////////////////down////////////////////up/////////////
    if(enemy.x > player.x -25 && enemy.x < player.x + 25 && enemy.y > player.y -20 && enemy.y < player.y + 70){
      player.x = player_set.default_x;
      player.y = player_set.default_y;
      allScore.shift();
      game_set.lives -= 1;
      //checks if game over
      //calls reset to display game over screen
      if(game_set.lives === 0){
        player.gm = true;
      }
    }
  });
  gems.forEach(function(gem){
    if(gem.x > player.x -25 && gem.x < player.x + 25 && gem.y > player.y -20 && gem.y < player.y + 70){
      gem.run = true;
      allScore.push(new ScoreGems( spGem ,60, gem.sprite));
      //counts picked gems
      points++;
      spGem += 25;
      };
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

//if player is in the water, resets player to default location
//param: array with sets of coordinates
function waterCheck(array, player){
  for(var i=0; i<array.length; i++){
    if(player.y > array[i][0] && player.y < array[i][1] ){

        player.x = player_set.default_x;
        player.y = player_set.default_y;
        allScore.shift();
        game_set.lives -= 1;
    }
  }
}

function hasWon(){
  //if picked gems = gems on the map
  if(points === gml.length){
    player.win = true;
    console.log('win');
  }
}
