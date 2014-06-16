(function(root) {
  "use strict";

  var COLOR = "gray";
  var RADIUS = 40;
  var SPEED_FACTOR = 2;

  var Asteroids = root.Asteroids = root.Asteroids || {};
  var MovingObject = Asteroids.MovingObject;

  var GRAVE_IMAGES = [
    'images/gravestone-cross.png',
    'images/gravestone-face.png',
    'images/gravestone-rip.png'
  ].map(function(imageSrc) {
    var image = new Image();
    image.src = imageSrc;
    return image;
  });

  var Asteroid = Asteroids.Asteroid = function(pos, vel) {
    MovingObject.call(this, pos, vel, RADIUS, COLOR);
    this.image = new Image();
    this.image.src = 'images/zombie.png';
    this.currentDirection = 0;
    this.moving = false;
    this.scheduleMovement();
  };
  Asteroid.inherits(MovingObject);

  Asteroid.prototype.draw = function(context) {
    return this.moving ? this.drawZombie(context) : this.drawGrave(context);
  };

  Asteroid.prototype.drawGrave = function(context) {
    if (this.graveChoice === undefined) {
      this.graveChoice = Math.floor(Math.random() * GRAVE_IMAGES.length);
    }
    var graveImage = GRAVE_IMAGES[this.graveChoice];
    context.drawImage(
      graveImage,
      this.pos[0] - RADIUS, this.pos[1] - RADIUS, // Start x, start y.
      graveImage.naturalWidth, graveImage.naturalHeight // width, height
    );
  };

  Asteroid.prototype.drawZombie = function(context) {
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

  Asteroid.prototype.isCollidedWith = function(otherObject) {
    if (this.moving) {
      return MovingObject.prototype.isCollidedWith.call(this, otherObject);
    }
    return false;
  };

  Asteroid.prototype.move = function() {
    if (this.moving) {
      MovingObject.prototype.move.call(this);
    }
  };

  Asteroid.prototype.reset = function(dimX, dimY) {
    this.setRandom(dimX, dimY);
    this.moving = false;
    this.scheduleMovement();
  };

  Asteroid.prototype.scheduleMovement = function() {
    setTimeout(function() {
      this.moving = true;
    }.bind(this), 1500);
  };

  Asteroid.prototype.setRandom = function(dimX, dimY) {
    this.pos[0] = Math.floor(Math.random() * (dimX - 200) + 100);
    this.pos[1] = Math.floor(Math.random() * (dimY - 200) + 100);
    this.vel = [Asteroid.randomVec(), Asteroid.randomVec()];
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
    var asteroid = new Asteroid([0, 0], 0);
    asteroid.setRandom(dimX, dimY);
    return asteroid;
  };

  Asteroid.randomVec = function(){
    var vel = Math.random() * SPEED_FACTOR + 1;
    vel *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    return vel;
  };

})(this);
