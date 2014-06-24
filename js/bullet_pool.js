(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {}),
      Bullet = Asteroids.Bullet;

  var BulletPool = Asteroids.BulletPool = function() {
    this.pool = [];
  };

  BulletPool.prototype.allocate = function(pos, vel) {
    if (this.pool.length === 0) {
      this.create();
    }
    var bullet = this.pool.shift();
    bullet.reset(pos, vel);
    return bullet;
  };

  BulletPool.prototype.create = function() {
    this.pool.push(new Bullet([0, 0], [0, 0]));
  };

  BulletPool.prototype.free = function(bullet) {
    this.pool.push(bullet);
  };
})(this);
