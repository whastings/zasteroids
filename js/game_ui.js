(function(root) {
  'use strict';

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var GameUI = Asteroids.GameUI = Protomatter.create({
    init: function(element) {
      this.element = element;
      this.messageHeader = element.querySelector('.message-header');
      this.messageBody = element.querySelector('.message-body');
      this.previousTime = 0;
    },

    calculateFps: function(currentTime) {
      var fps = 1000 / (currentTime - this.previousTime);
      this.previousTime = currentTime;
      return fps;
    },

    clone: function() {
      return this.create(this.element);
    },

    hide: function() {
      this.element.style.display = 'none';
    },

    show: function() {
      this.element.style.display = 'block';
    },

    showGameOver: function() {
      this.messageHeader.innerHTML = 'GAME OVER';
      this.messageBody.innerHTML = 'Press ENTER to play again.';
      this.show();
    }
  });
})(this);
