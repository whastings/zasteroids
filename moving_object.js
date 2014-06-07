(function(root) {
  "use strict";

  var Asteroids = root.Asteroids = root.Asteroids || {};

  var MovingObject = Asteroids.MovingObject = function(pos, vel, radius, color) {
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.color = color;
  };

  MovingObject.prototype.move = function() {
    var posX = this.pos[0],
        posY = this.pos[1],
        velX = this.vel[0],
        velY = this.vel[1];
    this.pos = [posX + velX, posY + velY];
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

  MovingObject.prototype.isCollidedWith = function(otherObject) {
    var x1 = this.pos[0],
        y1 = this.pos[1],
        x2 = otherObject.pos[0],
        y2 = otherObject.pos[1];
    var distance = Math.sqrt(
      Math.pow((y2 - y1), 2) +
      Math.pow((x2 - x1), 2)
    );

    return (distance < (this.radius + otherObject.radius));
  };


})(this);
