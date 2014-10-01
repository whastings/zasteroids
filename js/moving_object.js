define(
  'moving_object',
  function() {
    "use strict";

    var MovingObject = function(pos, vel, radius, color) {
      this.pos = pos;
      this.vel = vel;
      this.radius = radius;
      this.color = color;
    };

    MovingObject.prototype.move = function(currentFps) {
      if (!this.isMoving()) {
        return;
      }
      var posX = this.pos[0],
          posY = this.pos[1],
          velX = this.vel[0] / currentFps,
          velY = this.vel[1] / currentFps;
      this.pos[0] = posX + velX;
      this.pos[1] = posY + velY;
    };

    MovingObject.prototype.draw = function(context) {
      context.fillStyle = this.color;
      context.beginPath();

      context.arc(
        this.pos[0],
        this.pos[1],
        this.radius,
        0,
        2 * Math.PI,
        false
      );

      context.fill();
    };

    MovingObject.prototype.findDistance = function(x1, y1, x2, y2) {
      return Math.sqrt(
        Math.pow((y2 - y1), 2) +
        Math.pow((x2 - x1), 2)
      );
    };

    MovingObject.prototype.isCollidedWith = function(otherObject) {
      var x1 = this.pos[0],
          y1 = this.pos[1],
          x2 = otherObject.pos[0],
          y2 = otherObject.pos[1];
      var distance = this.findDistance(x1, y1, x2, y2);

      return (distance < (this.radius + otherObject.radius));
    };

    MovingObject.prototype.isMoving = function() {
      return this.vel[0] !== 0 || this.vel[1] !== 0;
    };

    return MovingObject;
  }
);
