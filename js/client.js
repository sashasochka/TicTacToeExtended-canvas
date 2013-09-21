"use strict";

var fieldSize;
var game;
var field;
var selectedSquare;

var startGame = function () {
  fieldSize = newFieldSize()
  game = new TicTacToeGame();
  field = new GameField('TicTacToeCanvas', game,
    fieldSize.width, fieldSize.height);
  field.setup();
  updateFieldSize();
  field.display();
  field.cellClicked(function (cell) {
    var game = field.gameEngine;
    var player = game.currentPlayer;

    if (game.makeTurn(cell.coord)) {
      if (selectedSquare) {
        field.squares[selectedSquare.y][selectedSquare.x].unselect();
        selectedSquare = undefined;
      }
      if (player === 1) {
        cell.drawCross();
      } else {
        cell.drawCircle();
      }
      var previousSquareCoord = game.squareCoordByCell(game.previousTurnCoord);
      var owner = game.squareOwner[previousSquareCoord.y][previousSquareCoord.x].player;
      if (owner != TicTacToeGame.undefinedWinner) {
        field.squares[previousSquareCoord.y][previousSquareCoord.x].setOwnerBackground(owner);
      }
      if (game.winner()) {
        sendNotification('Winner: ' + game.winner());
      } else {
        sendNotification('Move of player: ' + game.currentPlayer);
        var nextSquare = game.nextSquare();
        if (nextSquare) {
          selectedSquare = nextSquare.coord;
          field.squares[selectedSquare.y][selectedSquare.x].select();
        }
        if (game.currentPlayer === 2 && !playWithBotCheckbox.prop('checked')) {
          setTimeout(function () {
             makeBotGeneratedMove(cell.field);
          }, 400);
        }
      }
    } else {
      sendNotification('Invalid move! Player: ' + game.currentPlayer);
    }
  });
};

var updateFieldSize = function () {
  field.updateSize(newFieldSize());
};

// update field size if needed
$(window).resize(updateFieldSize);
window.addEventListener("orientationchange", updateFieldSize, false);

// checkbox and hash value controlling User vs Bot or User vs User
if (location.hash === '#two_players') {
  playWithBotCheckbox.attr('checked', true);
}

playWithBotCheckbox.change(function () {
  if (location.hash === '#two_players') {
    location.hash = '';
    if (game.currentPlayer === 2) {
      makeBotGeneratedMove(field);
    }
  } else {
    location.hash = '#two_players';
  }
});

$('#restart-btn').click(function () {
  startGame();
});
startGame();
