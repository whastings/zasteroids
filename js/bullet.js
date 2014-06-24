(function(root) {
  "use strict";

  var Asteroids = root.Asteroids = root.Asteroids || {};
  var MovingObject = Asteroids.MovingObject;

  var COLOR = "white",
      INITIAL_SPEED = 500,
      RADIUS = 2,
      SPEED_MULTIPLIER = 10;

  var Bullet = Asteroids.Bullet = function(pos, vel) {
    MovingObject.call(this, pos, [0, 0], RADIUS, COLOR);
    this.setVelocity(vel);
  };
  Bullet.inherits(MovingObject);

  Bullet.prototype.reset = function(pos, vel) {
    this.pos[0] = pos[0];
    this.pos[1] = pos[1];
    this.setVelocity(vel);
  };

  Bullet.prototype.setVelocity = function(vel) {
    this.vel[0] = vel[0] * SPEED_MULTIPLIER;
    this.vel[1] = vel[1] * SPEED_MULTIPLIER;
  };
})(this);
