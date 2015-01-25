'use strict';

import Asteroid from './asteroid';
import AsteroidPool from './asteroid_pool';
import Ship from './ship';

var Game = Protomatter.create({
  init(height, width) {
    this.height = height;
    this.width = width;
    this.calculateNumAsteroids();
    this.overStream = new Bacon.Bus();
    this.scoreStream = new Bacon.Bus();
    this.reset();
  },

  getOverStream() {
    return this.overStream;
  },

  getScoreStream() {
    return this.scoreStream;
  },

  reset() {
    this.over = false;
    this.asteroids = [];
    this.pool = AsteroidPool.create(this.numAsteroids, this.width, this.height);
    this.ship = Ship.create([this.width / 2, this.height / 2]);
    this.bullets = [];
    this.hitAsteroids = 0;
    this.overStream.push(false);
    this.scoreStream.push(0);
  },

  rotateClockwise() {
    this.ship.rotateClockwise();
  },

  rotateCounterClockwise() {
    this.ship.rotateCounterClockwise();
  },

  shoot() {
    var bullet;
    if (!this.ship.isMoving()) {
      return;
    }
    bullet = this.ship.fireBullet();
    this.bullets.push(bullet);
  },

  slowDown() {
    this.ship.power();
  },

  speedUp() {
    this.ship.power(true);
  },

  step(context, currentFps) {
    this.move(currentFps);
    this.draw(context);
    this.checkCollision();
    this.checkShots();
    this.cleanUp();
    this.resetAsteroids();
    this.overStream.push(this.over);
  },

  private: {
    addAsteroids(numAsteroids) {
      this.asteroids = this.asteroids.concat(this.pool.allocate(numAsteroids));
    },

    calculateNumAsteroids() {
      this.numAsteroids = Math.floor(this.width / 100 / 2);
    },

    cleanUp() {
      this.cleanUpAsteroids();
      this.cleanUpBullets();
      if (this.isOutOfBounds(this.ship)) {
        this.ship.wrapAround(this.width, this.height);
      }
    },

    cleanUpAsteroids() {
      for (var i = (this.asteroids.length - 1); i >= 0; i--) {
        if (this.isOutOfBounds(this.asteroids[i])) {
          this.removeAsteroid(i);
        }
      }
    },

    cleanUpBullets() {
      for (var i = (this.bullets.length - 1); i >= 0; i--) {
        if (this.isOutOfBounds(this.bullets[i])) {
          this.ship.returnBullet(this.bullets[i]);
          this.bullets.splice(i, 1);
        }
      }
    },

    draw(context) {
      var shipPos = this.ship.getPos(),
          asteroid,
          bullet;

      context.clearRect(0, 0, this.width, this.height);

      for (asteroid of this.asteroids) {
        asteroid.updateDirection(shipPos);
        asteroid.draw(context);
      }
      for (bullet of this.bullets) {
        bullet.draw(context);
      }

      this.ship.draw(context);
      this.scoreStream.push(this.hitAsteroids);
    },

    move(currentFps) {
      var asteroid,
          bullet;

      for (asteroid of this.asteroids) {
        asteroid.move(currentFps);
      }
      for (bullet of this.bullets) {
        bullet.move(currentFps);
      }

      this.ship.move(currentFps);
    },

    checkCollision() {
      var ship = this.ship;

      this.over = this.asteroids.some(function(asteroid) {
        return asteroid.isCollidedWith(ship);
      });
    },

    checkShots() {
      var removeTheseBullets = [],
          asteroids = this.asteroids,
          bullets = this.bullets,
          ship = this.ship,
          bulletIndex = bullets.length,
          bullet,
          asteroidIndex;

      while (bulletIndex--) {
        bullet = bullets[bulletIndex];
        asteroidIndex = asteroids.length;
        while (asteroidIndex--) {
          if (asteroids[asteroidIndex].isCollidedWith(bullet)) {
            removeTheseBullets.push(bulletIndex);
            this.hitAsteroids += 1;
            this.removeAsteroid(asteroidIndex);
          }
        }
      }

      for (bulletIndex of removeTheseBullets) {
        bullet = bullets.splice(bulletIndex, 1)[0];
        ship.returnBullet(bullet);
      }
    },

    isOutOfBounds (moveableObject) {
      var pos = moveableObject.getPos();
      return (pos[0] > this.width || pos[1] > this.height ||
          pos[0] < 0 || pos[1] < 0);
    },

    removeAsteroid(asteroidIndex) {
      this.pool.free(this.asteroids[asteroidIndex]);
      this.asteroids.splice(asteroidIndex, 1);
    },

    resetAsteroids() {
      var asteroidsNeeded = this.numAsteroids - this.asteroids.length;
      if (asteroidsNeeded > 0) {
        this.addAsteroids(asteroidsNeeded);
      }
    }
  }
});

export default Game;
