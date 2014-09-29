define(
  ['asteroid'],
  function(Asteroid) {
    var AsteroidPool = function(max, screenWidth, screenHeight) {
      this.screenHeight = screenHeight;
      this.screenWidth = screenWidth;
      this.pool = [];
      this.create(max);
    };

    AsteroidPool.prototype.allocate = function(num) {
      if (this.pool.length < num) {
        throw new Error('Not enough objects in pool');
      }
      var asteroids = this.pool.splice(0, num);
      asteroids.forEach(function(asteroid) {
        asteroid.reset(this.screenWidth, this.screenHeight);
      }, this);
      return asteroids;
    };

    AsteroidPool.prototype.create = function(num) {
      var self = this;
      _.times(num, function() {
        self.pool.push(
          new Asteroid([0, 0], [0, 0])
        );
      });
    };

    AsteroidPool.prototype.free = function(object) {
      this.pool.push(object);
    };

    return AsteroidPool;
  }
);
