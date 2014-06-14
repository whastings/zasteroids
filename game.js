(function(root) {
  "use strict";

  var Asteroids = root.Asteroids = root.Asteroids || {};
  var Asteroid = Asteroids.Asteroid;
  var Ship = Asteroids.Ship;

  var SCORE_X = 50,
      FPS = 30,
      NUM_ASTEROIDS = 3;

  var Game = Asteroids.Game = function(context, height, width) {
    this.context = context;
    this.height = height;
    this.width = width;
    this.asteroids = [];
    this.addAsteroids(NUM_ASTEROIDS);
    this.ship = new Ship([this.width / 2, this.height / 2]);
    this.bullets = [];
    this.hitAsteroids = 0;
    this.paused = false;
    document.addEventListener('keydown', this.handleKeyPress.bind(this), false);
  };

  Game.prototype.addAsteroids = function(numAsteroids) {
    var asteroids = [];
    for (var i = 0; i < numAsteroids; i++) {
      asteroids.push(Asteroid.randomAsteroid(this.width, this.height));
    }
    this.asteroids = this.asteroids.concat(asteroids);
  };

  Game.prototype.cleanUp = function() {
    var that = this;
    this.checkOutOfBounds(this.asteroids);
    this.checkOutOfBounds(this.bullets);
    if (this.isOutOfBounds(this.ship)) {
      this.ship.wrapAround(this.width, this.height);
    }
  };

  Game.prototype.draw = function() {
    var context = this.context,
        shipPos = this.ship.pos;
    context.clearRect(0, 0, this.width, this.height);
    this.asteroids.forEach(function(asteroid) {
      asteroid.updateDirection(shipPos);
      asteroid.draw(context);
    });
    this.bullets.forEach(function(bullet) {
      bullet.draw(context);
    });

    this.ship.draw(context);
  };

  Game.prototype.fireBullet = function() {
    var bullet = this.ship.fireBullet();
    this.bullets.push(bullet);
  };

  Game.prototype.handleKeyPress = function(event) {
    if (_.contains([38, 39, 40, 37, 32], event.keyCode)) {
      event.preventDefault();
    }
    switch (event.keyCode) {
    case 13:
      this.paused ? this.start() : this.pause();
      break;
    case 38:
      this.ship.power(1);
      break;
    case 39:
      this.ship.rotateClockwise();
      break;
    case 40:
      this.ship.power(-1);
      break;
    case 37:
      this.ship.rotateCounterClockwise();
      break;
    case 32:
      event.preventDefault();
      this.fireBullet();
    }
  };

  Game.prototype.move = function() {
    this.asteroids.forEach(function(asteroid) {
      asteroid.move();
    });
    this.bullets.forEach(function(bullet) {
      bullet.move();
    });
    this.ship.move();
  };

  Game.prototype.checkCollision = function() {
    var ship = this.ship,
        collision = false;
    this.asteroids.some(function(asteroid) {
      if (asteroid.isCollidedWith(ship)) {
        collision = true;
        return true;
      }
    });
    if (collision) {
      this.stop();
    }
  };

  Game.prototype.checkShots = function() {

    var removeTheseBullets = [];
    var removeTheseAsteroids = [];
    var that = this;
    this.bullets.forEach(function(bullet, bulletI) {
      that.asteroids.forEach(function(asteroid, asteroidI){
        if (asteroid.isCollidedWith(bullet)) {
          removeTheseBullets.push(bulletI);
          removeTheseAsteroids.push(asteroidI);
        }
      });
    });
    removeTheseBullets.forEach(function(bullet){
      that.bullets.splice(bullet, 1);
    });
    removeTheseAsteroids.forEach(function(asteroid){
      that.asteroids.splice(asteroid, 1);
      that.hitAsteroids += 1;
    });
  };

  Game.prototype.checkOutOfBounds = function(array) {
    var that = this;
    this.checkRemove(array, function(item) {
      return that.isOutOfBounds(item);
    });
  };

  Game.prototype.checkRemove = function(array, callback) {
    var removeThese = [];
    var that = this;

    array.forEach(function(item, itemI) {
      if (callback(item)) {
        removeThese.push(itemI);
      }
    });
    removeThese.forEach(function(item){
      array.splice(item, 1);
    });
  };

  Game.prototype.isOutOfBounds = function (moveableObject) {
    if (moveableObject.pos[0] > this.width || moveableObject.pos[1] > this.height ||
        moveableObject.pos[0] < 0 || moveableObject.pos[1] < 0) {
      return true;
    }
    return false;
  };

  Game.prototype.pause = function() {
    this.paused = true;
    clearInterval(this.interval);
  };

  Game.prototype.resetAsteroids = function() {
    var asteroidsNeeded = NUM_ASTEROIDS - this.asteroids.length;
    if (asteroidsNeeded > 0) {
      this.addAsteroids(asteroidsNeeded);
    }
  };

  Game.prototype.step = function() {
    this.move();
    this.draw();
    this.checkCollision();
    this.checkShots();
    this.cleanUp();
    this.resetAsteroids();
    this.showScore();
  };

  Game.prototype.showScore = function() {
    this.context.fillStyle = "#ff0000";
    this.context.font = "normal 20pt Finger Paint";
    this.context.fillText(
      "Current score: " + this.hitAsteroids,
      SCORE_X,
      40
    );

  };

  Game.prototype.start = function() {
    this.paused = false;
    this.interval = setInterval(Game.prototype.step.bind(this), FPS);
  };

  Game.prototype.stop = function() {
    alert("Game Over. You hit " + this.hitAsteroids + " asteroids.");
    clearInterval(this.interval);
  };

})(this);
