'use strict';

import MovingObject from './moving_object';

var COLOR = 'gray',
    GRAVE_IMAGES,
    RADIUS = 40,
    SPEED_FACTOR = 150;

GRAVE_IMAGES = [
  'images/gravestone-cross.png',
  'images/gravestone-face.png',
  'images/gravestone-rip.png'
].map((imageSrc) => {
  var image = new Image();
  image.src = imageSrc;
  return image;
});

var Asteroid = MovingObject.extend({
  init(pos, vel) {
    this.callSuper('init', pos, vel, RADIUS, COLOR);
    this.image = new Image();
    this.image.src = 'images/zombie.png';
    this.currentDirection = 0;
    this.moving = false;
  },

  draw(context) {
    return this.moving ? this.drawZombie(context) : this.drawGrave(context);
  },

  isCollidedWith(otherObject) {
    if (this.moving) {
      return this.callSuper('isCollidedWith', otherObject);
    }
    return false;
  },

  move(currentFps) {
    if (this.moving) {
      this.callSuper('move', currentFps);
    }
  },

  reset(dimX, dimY) {
    this.setRandom(dimX, dimY);
    this.moving = false;
    this.scheduleMovement();
  },

  updateDirection(targetPos) {
    var aX = this.pos[0],
        aY = this.pos[1],
        tX = targetPos[0],
        tY = targetPos[1];
    var opposite = tY - aY,
        adjacent = tX - aX;
    this.currentDirection = Math.atan2(opposite, adjacent);
  },

  randomAsteroid(dimX, dimY) {
    var asteroid = this.create([0, 0], 0);
    asteroid.setRandom(dimX, dimY);
    return asteroid;
  },

  randomVec(){
    var vel = Math.random() * SPEED_FACTOR + 20;
    vel *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    return vel;
  },

  private: {
    drawGrave(context) {
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

    drawZombie(context) {
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

    scheduleMovement() {
      setTimeout(() => {
        this.moving = true;
      }, 1500);
    },

    setRandom(dimX, dimY) {
      this.pos[0] = Math.floor(Math.random() * (dimX - 200) + 100);
      this.pos[1] = Math.floor(Math.random() * (dimY - 200) + 100);
      this.vel[0] = Asteroid.randomVec();
      this.vel[1] = Asteroid.randomVec();
    }
  }
});

export default Asteroid;
