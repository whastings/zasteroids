(function(root) {
  "use strict";

  var Asteroids = root.Asteroids = root.Asteroids || {};
  var Bullet = Asteroids.Bullet;

  var RADIUS = 20,
      MAX_POWER = 3,
      COLOR = "blue";

  var Ship = Asteroids.Ship = function(pos) {
    Asteroids.MovingObject.call(this, pos, [0, 0], RADIUS, COLOR);
    //will now be the degree that we are pointing
    this.currentDirection = 0;
    this.speed = 0;
  };
  Ship.inherits(Asteroids.MovingObject);


  Ship.prototype.fireBullet = function(){
    return new Bullet(this.pos, this.vel);
  };

  Ship.prototype.power = function(impulse) {
    this.speed += impulse;
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
