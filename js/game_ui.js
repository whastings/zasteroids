'use strict';

var RAF = window.requestAnimationFrame,
    SCORE_X = 50,
    KEY_EVENTS;

KEY_EVENTS = {
  32: 'shoot',
  37: 'rotateCounterClockwise',
  38: 'speedUp',
  39: 'rotateClockwise',
  40: 'slowDown'
};

var GameUI = Protomatter.create({
  init(context, game, element) {
    this.context = context;
    this.game = game;
    this.element = element;
    this.messageHeader = element.querySelector('.message-header');
    this.messageBody = element.querySelector('.message-body');

    this.createEventStreams();
  },

  restartGame() {
    this.hide();
    this.game.reset();
  },

  private: {
    checkGameOver(status) {
      if (!status) {
        return;
      }
      this.showGameOver();
    },

    createEventStreams() {
      var keyStream = createKeyStream(),
          overStream = this.game.getOverStream(),
          scoreStream = this.game.getScoreStream(),
          pauseStream = createPauseStream(keyStream, overStream),
          goStream = overStream.not().merge(pauseStream.not()),
          frameStream = createFrameStream(goStream),
          restartStream = createRestartStream(keyStream, overStream);

      createGameControlStreams(keyStream, goStream, this.game);

      frameStream.onValue(this.game, 'step', this.context);
      frameStream.take(1).onValue(this, 'hide');
      overStream.onValue(this, 'checkGameOver');
      restartStream.onValue(this, 'restartGame');
      scoreStream.onValue(this, 'showScore');
    },

    hide() {
      this.element.style.display = 'none';
    },

    show() {
      this.element.style.display = 'block';
    },

    showGameOver() {
      this.messageHeader.innerHTML = 'GAME OVER';
      this.messageBody.innerHTML = 'Press ENTER to play again.';
      this.show();
    },

    showScore(score) {
      this.context.fillStyle = '#ff0000';
      this.context.font = 'normal 20pt Finger Paint';
      this.context.fillText(
        'Current score: ' + score,
        SCORE_X,
        40
      );
    }
  }
});

function createFrameStream(goStream) {
  return createRafStream()
    .map(fpsCalculator())
    .filter(goStream.toProperty());
}

function createGameControlStreams(keyStream, goStream, game) {
  Object.keys(KEY_EVENTS).forEach(function(eventKeyCode) {
    var method = KEY_EVENTS[eventKeyCode],
        stream;
    eventKeyCode = parseInt(eventKeyCode, 10);
    stream = keyStream
      .filter(keyCode => keyCode === eventKeyCode)
      .filter(goStream.toProperty());
    stream.onValue(game, method);
  });
}

function createKeyStream() {
  return Bacon.fromEventTarget(document, 'keydown')
    .filter(event => event.keyCode in KEY_EVENTS || event.keyCode === 13)
    .doAction('.preventDefault')
    .map('.keyCode');
}

function createPauseStream(keyStream, overStream) {
  var paused = true;
  return keyStream
    .filter(isEnter)
    .filter(overStream.not().toProperty(true))
    .map(function() {
      paused = !paused;
      return paused;
    });
}

function createRafStream() {
  return Bacon.fromBinder(function(sink) {
    var rafId;

    function rafCallback(timestamp) {
      sink(timestamp);
      rafId = RAF(rafCallback);
    }
    rafId = RAF(rafCallback);

    return function() {
      window.cancelAnimationFrame(rafId);
    };
  });
}

function createRestartStream(keyStream, overStream) {
  return keyStream
    .filter(isEnter)
    .filter(overStream.toProperty());
}

function fpsCalculator() {
  var prevTime = 0;
  return function(currentTime) {
    var fps = 1000 / (currentTime - prevTime);
    prevTime = currentTime;
    return fps;
  };
}

function isEnter(keyCode) {
  return keyCode === 13;
}

export default GameUI;
