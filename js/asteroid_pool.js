import Asteroid from './asteroid';

var AsteroidPool = Protomatter.create({
  init: function(max, screenWidth, screenHeight) {
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.pool = [];
    this.createInstances(max);
  },
  allocate: function(num) {
    if (this.pool.length < num) {
      throw new Error('Not enough objects in pool');
    }
    var asteroids = this.pool.splice(0, num);
    asteroids.forEach(function(asteroid) {
      asteroid.reset(this.screenWidth, this.screenHeight);
    }, this);
    return asteroids;
  },

  free: function(object) {
    this.pool.push(object);
  },

  private: {
    createInstances: function(num) {
      var self = this;
      _.times(num, function() {
        self.pool.push(
          Asteroid.create([0, 0], [0, 0])
        );
      });
    }
  }
});

export default AsteroidPool;
