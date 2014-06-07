(function(root) {
  "use strict";

  var COLOR = "gray";
  var RADIUS = 40;
  var SPEED_FACTOR = 2;

  var Asteroids = root.Asteroids = root.Asteroids || {};

  var Asteroid = Asteroids.Asteroid = function(pos, vel) {
    Asteroids.MovingObject.call(this, pos, vel, RADIUS, COLOR);
    this.image = new Image();
    this.image.src = 'images/zombie.png';
    this.currentDirection = 0;
  };
  Asteroid.inherits(Asteroids.MovingObject);

  Asteroid.prototype.draw = function(context) {
    var sizeOffset = Math.floor(RADIUS * 0.95),
        size = Math.floor(RADIUS * 2.1);
    context.save();
    context.translate(this.pos[0], this.pos[1]);
    context.rotate(Math.PI * 1.5 + this.currentDirection);
    context.drawImage(
      this.image,
      -RADIUS, -RADIUS, // Start x, start y.
      size, size // width, height
    );
    context.restore();
  };

  Asteroid.prototype.updateDirection = function(targetPos) {
    var aX = this.pos[0],
        aY = this.pos[1],
        tX = targetPos[0],
        tY = targetPos[1];
    var opposite = tY - aY,
        adjacent = tX - aX;
    this.currentDirection = Math.atan2(opposite, adjacent);
  };

  Asteroid.randomAsteroid = function(dimX, dimY) {
    var posX = Math.floor(Math.random() * dimX);
    var posY = Math.floor(Math.random() * dimY);

    var vel = [Asteroid.randomVec(), Asteroid.randomVec()];

    return new Asteroid([posX, posY], vel);
  };

  Asteroid.randomVec = function(){
    var vel = Math.random() * SPEED_FACTOR + 1;
    vel *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    return vel;
  };


})(this);
