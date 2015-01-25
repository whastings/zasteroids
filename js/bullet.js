'use strict';

import MovingObject from './moving_object';

var COLOR = "white",
    INITIAL_SPEED = 500,
    RADIUS = 2,
    SPEED_MULTIPLIER = 10;

var Bullet = MovingObject.extend({
  init(pos, vel) {
    this.callSuper('init', pos, [0, 0], RADIUS, COLOR);
    this.setVelocity(vel);
  },

  reset(pos, vel) {
    this.pos[0] = pos[0];
    this.pos[1] = pos[1];
    this.setVelocity(vel);
  },

  private: {
    setVelocity(vel) {
      this.vel[0] = vel[0] * SPEED_MULTIPLIER;
      this.vel[1] = vel[1] * SPEED_MULTIPLIER;
    }
  }
});

export default Bullet;
