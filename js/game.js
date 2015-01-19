(function(root) {
  'use strict';

  var Asteroids = root.Asteroids = root.Asteroids || {};
  var Asteroid = Asteroids.Asteroid;
  var AsteroidPool = Asteroids.AsteroidPool;
  var Ship = Asteroids.Ship;

  var Game = Asteroids.Game = Protomatter.create({
    init: function(height, width) {
      this.height = height;
      this.width = width;
      this.calculateNumAsteroids();
      this.overStream = new Bacon.Bus();
      this.scoreStream = new Bacon.Bus();
      this.reset();
    },

    getOverStream: function() {
      return this.overStream;
    },

    getScoreStream: function() {
      return this.scoreStream;
    },

    reset: function() {
      this.over = false;
      this.asteroids = [];
      this.pool = AsteroidPool.create(this.numAsteroids, this.width, this.height);
      this.ship = Ship.create([this.width / 2, this.height / 2]);
      this.bullets = [];
      this.hitAsteroids = 0;
      this.overStream.push(false);
      this.scoreStream.push(0);
    },

    rotateClockwise: function() {
      this.ship.rotateClockwise();
    },

    rotateCounterClockwise: function() {
      this.ship.rotateCounterClockwise();
    },

    shoot: function() {
      if (!this.ship.isMoving()) {
        return;
      }
      var bullet = this.ship.fireBullet();
      this.bullets.push(bullet);
    },

    slowDown: function() {
      this.ship.power();
    },

    speedUp: function() {
      this.ship.power(true);
    },

    step: function(context, currentFps) {
      this.move(currentFps);
      this.draw(context);
      this.checkCollision();
      this.checkShots();
      this.cleanUp();
      this.resetAsteroids();
      this.overStream.push(this.over);
    },

    private: {
      addAsteroids: function(numAsteroids) {
        this.asteroids = this.asteroids.concat(this.pool.allocate(numAsteroids));
      },

      calculateNumAsteroids: function() {
        this.numAsteroids = Math.floor(this.width / 100 / 2);
      },

      cleanUp: function() {
        var that = this;
        this.cleanUpAsteroids();
        this.cleanUpBullets();
        if (this.isOutOfBounds(this.ship)) {
          this.ship.wrapAround(this.width, this.height);
        }
      },

      cleanUpAsteroids: function() {
        for (var i = (this.asteroids.length - 1); i >= 0; i--) {
          if (this.isOutOfBounds(this.asteroids[i])) {
            this.removeAsteroid(i);
          }
        }
      },

      cleanUpBullets: function() {
        for (var i = (this.bullets.length - 1); i >= 0; i--) {
          if (this.isOutOfBounds(this.bullets[i])) {
            this.ship.returnBullet(this.bullets[i]);
            this.bullets.splice(i, 1);
          }
        }
      },

      draw: function(context) {
        var shipPos = this.ship.getPos();
        context.clearRect(0, 0, this.width, this.height);
        this.asteroids.forEach(function(asteroid) {
          asteroid.updateDirection(shipPos);
          asteroid.draw(context);
        });
        this.bullets.forEach(function(bullet) {
          bullet.draw(context);
        });

        this.ship.draw(context);
        this.scoreStream.push(this.hitAsteroids);
      },

      move: function(currentFps) {
        this.asteroids.forEach(function(asteroid) {
          asteroid.move(currentFps);
        });
        this.bullets.forEach(function(bullet) {
          bullet.move(currentFps);
        });
        this.ship.move(currentFps);
      },

      checkCollision: function() {
        var ship = this.ship,
            collision = false;
        this.asteroids.some(function(asteroid) {
          if (asteroid.isCollidedWith(ship)) {
            collision = true;
            return true;
          }
        });
        if (collision) {
          this.over = true;
        }
      },

      checkShots: function() {
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
        removeTheseBullets.reverse().forEach(function(bulletIndex) {
          var bullet = that.bullets.splice(bulletIndex, 1)[0];
          that.ship.returnBullet(bullet);
        });
      },

      isOutOfBounds: function (moveableObject) {
        var pos = moveableObject.getPos();
        if (pos[0] > this.width || pos[1] > this.height ||
            pos[0] < 0 || pos[1] < 0) {
          return true;
        }
        return false;
      },

      removeAsteroid: function(asteroidIndex) {
        this.pool.free(this.asteroids[asteroidIndex]);
        this.asteroids.splice(asteroidIndex, 1);
      },

      resetAsteroids: function() {
        var asteroidsNeeded = this.numAsteroids - this.asteroids.length;
        if (asteroidsNeeded > 0) {
          this.addAsteroids(asteroidsNeeded);
        }
      }
    }
  });

})(this);
