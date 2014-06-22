(function(root) {
  "use strict";

  var Asteroids = root.Asteroids = root.Asteroids || {};
  var Asteroid = Asteroids.Asteroid;
  var AsteroidPool = Asteroids.AsteroidPool;
  var Ship = Asteroids.Ship;

  var SCORE_X = 50,
      FPS = 30;

  var Game = Asteroids.Game = function(context, height, width, ui) {
    this.context = context;
    this.height = height;
    this.width = width;
    this.calculateNumAsteroids();
    this.asteroids = [];
    this.pool = new AsteroidPool(this.numAsteroids, width, height);
    this.ship = new Ship([this.width / 2, this.height / 2]);
    this.bullets = [];
    this.hitAsteroids = 0;
    this.paused = true;
    this.over = false;
    this.ui = ui;
    this.keyHandler = this.handleKeyPress.bind(this);
    document.addEventListener('keydown', this.keyHandler, false);
    this.rafCallback = this.rafCallback || this.step.bind(this);
    window.requestAnimationFrame(this.rafCallback);
  };

  Game.prototype.addAsteroids = function(numAsteroids) {
    this.asteroids = this.asteroids.concat(this.pool.allocate(numAsteroids));
  };

  Game.prototype.calculateNumAsteroids = function() {
    this.numAsteroids = Math.floor(this.width / 100 / 2);
  };

  Game.prototype.cleanUp = function() {
    var that = this;
    this.cleanUpAsteroids();
    this.checkOutOfBounds(this.bullets);
    if (this.isOutOfBounds(this.ship)) {
      this.ship.wrapAround(this.width, this.height);
    }
  };

  Game.prototype.cleanUpAsteroids = function() {
    for (var i = (this.asteroids.length - 1); i >= 0; i--) {
      if (this.isOutOfBounds(this.asteroids[i])) {
        this.removeAsteroid(i);
      }
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
    if (!this.ship.isMoving()) {
      return;
    }
    var bullet = this.ship.fireBullet();
    this.bullets.push(bullet);
  };

  Game.prototype.handleKeyPress = function(event) {
    if (_.contains([38, 39, 40, 37, 32], event.keyCode)) {
      event.preventDefault();
    }
    switch (event.keyCode) {
    case 13:
      this.paused || this.over ? this.start() : this.pause();
      break;
    case 38:
      this.ship.power(true);
      break;
    case 39:
      this.ship.rotateClockwise();
      break;
    case 40:
      this.ship.power();
      break;
    case 37:
      this.ship.rotateCounterClockwise();
      break;
    case 32:
      this.fireBullet();
    }
  };

  Game.prototype.move = function(currentFps) {
    this.asteroids.forEach(function(asteroid) {
      asteroid.move(currentFps);
    });
    this.bullets.forEach(function(bullet) {
      bullet.move(currentFps);
    });
    this.ship.move(currentFps);
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
    var that = this;
    this.bullets.forEach(function(bullet, bulletI) {
      for (var i = (this.asteroids.length - 1); i >= 0; i--) {
        if (this.asteroids[i].isCollidedWith(bullet)) {
          removeTheseBullets.push(bulletI);
          that.hitAsteroids += 1;
          that.removeAsteroid(i);
        }
      }
    }, this);
    removeTheseBullets.forEach(function(bullet){
      that.bullets.splice(bullet, 1);
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
  };

  Game.prototype.removeAsteroid = function(asteroidIndex) {
    this.pool.free(this.asteroids[asteroidIndex]);
    this.asteroids.splice(asteroidIndex, 1);
  };

  Game.prototype.resetAsteroids = function() {
    var asteroidsNeeded = this.numAsteroids - this.asteroids.length;
    if (asteroidsNeeded > 0) {
      this.addAsteroids(asteroidsNeeded);
    }
  };

  Game.prototype.restart = function() {
    document.removeEventListener('keydown', this.keyHandler);
    var newGame = new Game(this.context, this.height, this.width, this.ui.clone());
    setTimeout(function() {
      newGame.start();
    }, 0);
  };

  Game.prototype.step = function(currentTime) {
    var currentFps = this.ui.calculateFps(currentTime);
    if (!this.paused) {
      this.move(currentFps);
      this.draw();
      this.checkCollision();
      this.checkShots();
      this.cleanUp();
      this.resetAsteroids();
      this.showScore();
    }
    window.requestAnimationFrame(this.rafCallback);
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
    if (this.over) {
      return this.restart();
    }
    if (this.paused) {
      this.paused = false;
    }
    this.ui.hide();
    this.resetAsteroids();
  };

  Game.prototype.stop = function() {
    this.paused = true;
    this.over = true;
    this.ui.showGameOver();
  };

})(this);
