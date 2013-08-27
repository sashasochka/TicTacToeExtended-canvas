"use strict";

var fieldSize = newFieldSize();
var game = new TicTacToeGame();
var field = new GameField('TicTacToeCanvas', game,
  fieldSize.width, fieldSize.height);
field.setup();
field.display();

var selectedSquare;
field.cellClicked(function (cell) {
  var game = field.gameEngine;
  var player = game.currentPlayer;

  if (game.makeTurn(cell.coord)) {
    if (selectedSquare) {
      field.squares[selectedSquare.y][selectedSquare.x].unselect();
    }
    if (player === 1) {
      cell.drawCross();
    } else {
      cell.drawCircle();
    }
    if (game.winner()) {
      sendNotification('Winner: ' + game.winner());
    } else {
      sendNotification('Move of player: ' + game.currentPlayer);

      selectedSquare = game.nextSquare().coord;
      field.squares[selectedSquare.y][selectedSquare.x].select();
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
