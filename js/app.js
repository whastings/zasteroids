import GameUI from './game_ui';
import Game from './game';

var canvas = document.getElementById('game-canvas'),
    gameHeight = document.documentElement.clientHeight,
    gameWidth = document.documentElement.clientWidth,
    messageBox = document.querySelector('.message-box'),
    context = canvas.getContext('2d');

canvas.setAttribute('height', gameHeight);
canvas.setAttribute('width', gameWidth);

export default GameUI.create(
  context,
  Game.create(gameHeight, gameWidth),
  messageBox
);
