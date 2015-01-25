import Asteroid from './asteroid';

var AsteroidPool = Protomatter.create({
  init(max, screenWidth, screenHeight) {
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.pool = [];
    this.createInstances(max);
  },

  allocate(num) {
    var asteroids,
        asteroid;
    if (this.pool.length < num) {
      throw new Error('Not enough objects in pool');
    }
    asteroids = this.pool.splice(0, num);
    for (asteroid of asteroids) {
      asteroid.reset(this.screenWidth, this.screenHeight);
    }
    return asteroids;
  },

  free(object) {
    this.pool.push(object);
  },

  private: {
    createInstances(num) {
      _.times(num, () => {
        this.pool.push(
          Asteroid.create([0, 0], [0, 0])
        );
      });
    }
  }
});

export default AsteroidPool;
