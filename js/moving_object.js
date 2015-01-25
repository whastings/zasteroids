'use strict';

var MovingObject = Protomatter.create({
  init(pos, vel, radius, color) {
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.color = color;
  },

  getPos() {
    return this.pos;
  },

  getRadius() {
    return this.radius;
  },

  move(currentFps) {
    if (!this.isMoving()) {
      return;
    }
    var posX = this.pos[0],
        posY = this.pos[1],
        velX = this.vel[0] / currentFps,
        velY = this.vel[1] / currentFps;
    this.pos[0] = posX + velX;
    this.pos[1] = posY + velY;
  },

  draw(context) {
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
  },

  isCollidedWith(otherObject) {
    var otherPos = otherObject.getPos(),
        x1 = this.pos[0],
        y1 = this.pos[1],
        x2 = otherPos[0],
        y2 = otherPos[1];
    var distance = this.findDistance(x1, y1, x2, y2);

    return (distance < (this.radius + otherObject.getRadius()));
  },

  isMoving() {
    return this.vel[0] !== 0 || this.vel[1] !== 0;
  },

  private: {
    findDistance(x1, y1, x2, y2) {
      return Math.sqrt(
        Math.pow((y2 - y1), 2) +
        Math.pow((x2 - x1), 2)
      );
    }
  }
});

export default MovingObject;
