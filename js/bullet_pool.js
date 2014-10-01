define(
  'bullet_pool',
  ['bullet'],
  function(Bullet) {
    'use strict';

    var BulletPool = function() {
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

    return BulletPool;
  }
);
