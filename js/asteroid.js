'use strict';

import MovingObject from './moving_object';

var COLOR = 'gray';
var RADIUS = 40;
var SPEED_FACTOR = 150;

var GRAVE_IMAGES = [
  'images/gravestone-cross.png',
  'images/gravestone-face.png',
  'images/gravestone-rip.png'
].map(function(imageSrc) {
  var image = new Image();
  image.src = imageSrc;
  return image;
});

var Asteroid = MovingObject.extend({
  init: function(pos, vel) {
    this.callSuper('init', pos, vel, RADIUS, COLOR);
    this.image = new Image();
    this.image.src = 'images/zombie.png';
    this.currentDirection = 0;
    this.moving = false;
  },

  draw: function(context) {
    return this.moving ? this.drawZombie(context) : this.drawGrave(context);
  },

  isCollidedWith: function(otherObject) {
    if (this.moving) {
      return this.callSuper('isCollidedWith', otherObject);
    }
    return false;
  },

  move: function(currentFps) {
    if (this.moving) {
      this.callSuper('move', currentFps);
    }
  },

  reset: function(dimX, dimY) {
    this.setRandom(dimX, dimY);
    this.moving = false;
    this.scheduleMovement();
  },

  updateDirection: function(targetPos) {
    var aX = this.pos[0],
        aY = this.pos[1],
        tX = targetPos[0],
        tY = targetPos[1];
    var opposite = tY - aY,
        adjacent = tX - aX;
    this.currentDirection = Math.atan2(opposite, adjacent);
  },

  randomAsteroid: function(dimX, dimY) {
    var asteroid = this.create([0, 0], 0);
    asteroid.setRandom(dimX, dimY);
    return asteroid;
  },

  randomVec: function(){
    var vel = Math.random() * SPEED_FACTOR + 20;
    vel *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    return vel;
  },

  private: {
    drawGrave: function(context) {
      if (this.graveChoice === undefined) {
        this.graveChoice = Math.floor(Math.random() * GRAVE_IMAGES.length);
      }
      var graveImage = GRAVE_IMAGES[this.graveChoice];
      context.drawImage(
        graveImage,
        this.pos[0] - RADIUS, this.pos[1] - RADIUS, // Start x, start y.
        graveImage.naturalWidth, graveImage.naturalHeight // width, height
      );
    },

    drawZombie: function(context) {
      var size = Math.floor(RADIUS * 2.1);
      context.save();
      context.translate(this.pos[0], this.pos[1]);
      context.rotate(Math.PI * 1.5 + this.currentDirection);
      context.drawImage(
        this.image,
        -RADIUS, -RADIUS, // Start x, start y.
        size, size // width, height
      );
      context.restore();
    },

    scheduleMovement: function() {
      setTimeout(function() {
        this.moving = true;
      }.bind(this), 1500);
    },

    setRandom: function(dimX, dimY) {
      this.pos[0] = Math.floor(Math.random() * (dimX - 200) + 100);
      this.pos[1] = Math.floor(Math.random() * (dimY - 200) + 100);
      this.vel[0] = Asteroid.randomVec();
      this.vel[1] = Asteroid.randomVec();
    }
  }
});

export default Asteroid;
