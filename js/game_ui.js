define(
  'game_ui',
  function() {
    'use strict';

    var GameUI = function(element) {
      this.element = element;
      this.messageHeader = element.querySelector('.message-header');
      this.messageBody = element.querySelector('.message-body');
      this.previousTime = 0;
    };

    GameUI.prototype.calculateFps = function(currentTime) {
      var fps = 1000 / (currentTime - this.previousTime);
      this.previousTime = currentTime;
      return fps;
    };

    GameUI.prototype.clone = function() {
      return new GameUI(this.element);
    };

    GameUI.prototype.hide = function() {
      this.element.style.display = 'none';
    };

    GameUI.prototype.show = function() {
      this.element.style.display = 'block';
    };

    GameUI.prototype.showGameOver = function() {
      this.messageHeader.innerHTML = 'GAME OVER';
      this.messageBody.innerHTML = 'Press ENTER to play again.';
      this.show();
    };

    return GameUI;
  }
);
