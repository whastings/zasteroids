(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var GameUI = Asteroids.GameUI = function(element) {
    this.element = element;
    this.messageHeader = element.querySelector('.message-header');
    this.messageBody = element.querySelector('.message-body');
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
})(this);
