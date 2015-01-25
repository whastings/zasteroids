'use strict';

import Bullet from './bullet';
import BulletPool from './bullet_pool';
import MovingObject from './moving_object';

var RADIUS = 30,
    MAX_POWER = 200,
    COLOR = 'blue',
    POWER_INCREMENT = 50;

var Ship = MovingObject.extend({
  init(pos) {
    this.callSuper('init', pos, [0, 0], RADIUS, COLOR);
    this.image = new Image();
    this.image.src = 'images/penguin.png';
    this.currentDirection = 45;
    this.pool = BulletPool.create();
    this.speed = 0;
  },

  draw(context) {
    var size = Math.floor(RADIUS * 2.1),
        angle = this.currentDirection * (Math.PI / 180) + (Math.PI * 0.5);
    context.save();
    context.translate(this.pos[0], this.pos[1]);
    context.rotate(angle);
    context.drawImage(
      this.image,
      -RADIUS, -RADIUS, // Start x, start y.
      size, size // width, height
    );
    context.restore();
  },

  fireBullet(){
    return this.pool.allocate(this.pos, this.vel);
  },

  power(increase) {
    var increment = POWER_INCREMENT * (increase ? 1 : -1);
    this.speed += increment;
    if (this.speed < 0){
      this.speed = 0;
    } else if (this.speed > MAX_POWER ){
      this.speed = MAX_POWER;
    }
    this.updateVelocity();
  },

  returnBullet(bullet) {
    this.pool.free(bullet);
  },

  rotateClockwise(){
    this.rotate(true);
  },

  rotateCounterClockwise(){
    this.rotate(false);
  },

  wrapAround(maxWidth, maxHeight) {
    var x = this.pos[0],
        y = this.pos[1];
    if (y < 0) {
      this.pos[1] = maxHeight;
    } else if (y > maxHeight) {
      this.pos[1] = 0;
    } else if (x < 0) {
      this.pos[0] = maxWidth;
    } else if (x > maxWidth) {
      this.pos[0] = 0;
    }
  },

  private: {
    rotate(clockwise) {
      this.currentDirection += (clockwise) ? 390 : 330;
      this.currentDirection %= 360;
      this.updateVelocity();
    },

    updateVelocity() {
      var degrees = this.currentDirection;

      this.vel[0] = Math.cos(degrees * (Math.PI / 180)) * this.speed;
      this.vel[1] = Math.sin(degrees * (Math.PI / 180)) * this.speed;
    }
  }
});

export default Ship;
