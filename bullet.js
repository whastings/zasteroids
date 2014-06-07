(function(root) {
  "use strict";

  var Asteroids = root.Asteroids = root.Asteroids || {};
  var MovingObject = Asteroids.MovingObject;

  var COLOR = "black",
      RADIUS = 2,
      SPEED_MULTIPLIER = 10;

  var Bullet = Asteroids.Bullet = function(pos, vel) {
    var ourVel = [];
    ourVel.push(vel[0] === 0 ? SPEED_MULTIPLIER : vel[0] * SPEED_MULTIPLIER);
    ourVel.push(vel[1] === 0 ? SPEED_MULTIPLIER : vel[1] * SPEED_MULTIPLIER);

    MovingObject.call(this, pos, ourVel, RADIUS, COLOR);
  };
  Bullet.inherits(MovingObject);


})(this);
