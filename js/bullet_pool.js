import Bullet from './bullet';

var BulletPool = Protomatter.create({
  init: function() {
    this.pool = [];
  },

  allocate: function(pos, vel) {
    if (this.pool.length === 0) {
      this.createInstance();
    }
    var bullet = this.pool.shift();
    bullet.reset(pos, vel);
    return bullet;
  },

  free: function(bullet) {
    this.pool.push(bullet);
  },

  private: {
    createInstance: function() {
      this.pool.push(Bullet.create([0, 0], [0, 0]));
    }
  }
});

export default BulletPool;
