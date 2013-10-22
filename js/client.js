"use strict";

var canvasSize;
var game;
var canvas;
var selectedSquare;

var opponentIsHuman = true;

var startGame = function () {
  canvasSize = newCanvasSize()
  game = new TicTacToeGame();
  canvas = new GameCanvas('TicTacToeCanvas', game, canvasSize);
  canvas.setup();
  updateCanvasSize();
  canvas.display();
  canvas.cellClicked(makeMoveTo);
};

var makeMoveTo = function (cellCoord) {
  if (game.makeTurn(cellCoord)) {
    updateCanvasOnMoveTo(cellCoord);
  } else {
    sendNotification('Invalid move! Player: ' + game.currentPlayer);
  }
};

var updateCanvasOnMoveTo = function (cellCoord) {
  if (selectedSquare) {
    canvas.getSquare(selectedSquare).unselect();
    selectedSquare = undefined;
  }
  var cell = canvas.getCell(cellCoord);
  cell.drawSymbolOfPlayer(game.getCell(cellCoord).owner);
  var previousSquareCoord = game.squareCoordByCell(game.previousTurnCoord);
  var owner = game.getSquare(previousSquareCoord).owner;
  if (owner !== TicTacToeGame.undefinedWinner) {
    canvas.getSquare(previousSquareCoord).setOwnerBackground(owner);
  }
  if (game.finished()) {
    var winner = game.winner();
    if (winner !== TicTacToeGame.draw) {
      sendNotification('Winner: Player ' + winner);
    } else {
      sendNotification('Winner: Draw!');
    }

  } else {
    sendNotification('Move of player: ' + game.currentPlayer);
    var nextSquare = game.nextSquare();
    if (nextSquare) {
      selectedSquare = nextSquare.coord;
      canvas.getSquare(selectedSquare).select();
    }
    if (game.currentPlayer === 2 && opponentIsHuman) {
      makeBotGeneratedMoveWithDelay(400);
    }
  }
};

var updateCanvasSize = function () {
  canvas.resize(newCanvasSize());
};
