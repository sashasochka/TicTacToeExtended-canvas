"use strict";

var fieldSize;
var game;
var field;
var selectedSquare;

var opponentIsHuman = true;

var startGame = function () {
  fieldSize = newFieldSize()
  game = new TicTacToeGame();
  field = new GameCanvas('TicTacToeCanvas', game, fieldSize);
  field.setup();
  updateFieldSize();
  field.display();
  field.cellClicked(makeMoveTo);
};

var makeMoveTo = function (cellCoord) {
  if (game.makeTurn(cellCoord)) {
    updateFieldOnMoveTo(cellCoord);
  } else {
    sendNotification('Invalid move! Player: ' + game.currentPlayer);
  }
};

var updateFieldOnMoveTo = function (cellCoord) {
  if (selectedSquare) {
    field.squares[selectedSquare.y][selectedSquare.x].unselect();
    selectedSquare = undefined;
  }
  var cell = field.cells[cellCoord.y][cellCoord.x];
  if (game.cell[cellCoord.y][cellCoord.x].owner === 1) {
    cell.drawCross();
  } else {
    cell.drawCircle();
  }
  var previousSquareCoord = game.squareCoordByCell(game.previousTurnCoord);
  var owner = game.square[previousSquareCoord.y][previousSquareCoord.x].owner;
  if (owner !== TicTacToeGame.undefinedWinner) {
    field.squares[previousSquareCoord.y][previousSquareCoord.x].setOwnerBackground(owner);
  }
  if (game.winner()) {
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
      field.squares[selectedSquare.y][selectedSquare.x].select();
    }
    if (game.currentPlayer === 2 && opponentIsHuman) {
      makeBotGeneratedMoveWithDelay(400);
    }
  }
};

var updateFieldSize = function () {
  field.resize(newFieldSize());
};
