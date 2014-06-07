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
  };
  Asteroid.inherits(Asteroids.MovingObject);

  Asteroid.prototype.draw = function(context) {
    var sizeOffset = Math.floor(RADIUS * 0.95),
        size = Math.floor(RADIUS * 2.1);
    context.drawImage(
      this.image,
      this.pos[0] - sizeOffset, this.pos[1] - sizeOffset, // Start x, start y.
      size, size // width, height
    );
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
