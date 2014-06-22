(function(root) {
  "use strict";

  var Asteroids = root.Asteroids = root.Asteroids || {};
  var Bullet = Asteroids.Bullet;

  var RADIUS = 30,
      MAX_POWER = 200,
      COLOR = "blue",
      POWER_INCREMENT = 50;

  var Ship = Asteroids.Ship = function(pos) {
    Asteroids.MovingObject.call(this, pos, [0, 0], RADIUS, COLOR);
    this.image = new Image();
    this.image.src = 'images/penguin.png';
    this.currentDirection = 45;
    this.speed = 0;
  };
  Ship.inherits(Asteroids.MovingObject);

  Ship.prototype.draw = function(context) {
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
  };

  Ship.prototype.fireBullet = function(){
    return new Bullet(this.pos.slice(), this.vel.slice());
  };

  Ship.prototype.power = function(increase) {
    var increment = POWER_INCREMENT * (increase ? 1 : -1);
    this.speed += increment;
    if (this.speed < 0){
      this.speed = 0;
    } else if (this.speed > MAX_POWER ){
      this.speed = MAX_POWER;
    }
    this.updateVelocity();
  };

  Ship.prototype.rotate = function(clockwise) {
    this.currentDirection += (clockwise) ? 390 : 330;
    this.currentDirection %= 360;
    this.updateVelocity();
  };

  Ship.prototype.rotateClockwise = function(){
    this.rotate(true);
  };

  Ship.prototype.rotateCounterClockwise = function(){
    this.rotate(false);
  };

  Ship.prototype.updateVelocity = function() {
    var degrees = this.currentDirection;

    this.vel[0] = Math.cos(degrees * (Math.PI / 180)) * this.speed;
    this.vel[1] = Math.sin(degrees * (Math.PI / 180)) * this.speed;
  };

  Ship.prototype.wrapAround = function(maxWidth, maxHeight) {
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
  };

})(this);
