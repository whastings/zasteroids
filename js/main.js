define(
  ['game', 'game_ui'],
  function(Game, GameUI) {
    var canvas = document.getElementById('game-canvas'),
        gameHeight = document.documentElement.clientHeight,
        gameWidth = document.documentElement.clientWidth,
        messageBox = document.querySelector('.message-box');

    canvas.setAttribute('height', gameHeight);
    canvas.setAttribute('width', gameWidth);

    return new Game(
      canvas.getContext('2d'),
      gameHeight,
      gameWidth,
      new GameUI(messageBox)
    );
  }
);
