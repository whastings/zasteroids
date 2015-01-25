import Bullet from './bullet';

var BulletPool = Protomatter.create({
  init() {
    this.pool = [];
  },

  allocate(pos, vel) {
    var bullet;
    if (this.pool.length === 0) {
      this.createInstance();
    }
    bullet = this.pool.shift();
    bullet.reset(pos, vel);
    return bullet;
  },

  free(bullet) {
    this.pool.push(bullet);
  },

  private: {
    createInstance() {
      this.pool.push(Bullet.create([0, 0], [0, 0]));
    }
  }
});

export default BulletPool;
