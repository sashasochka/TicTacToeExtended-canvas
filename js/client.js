"use strict";

var fieldSize = newFieldSize();
var game = new TicTacToeGame();
var field = new GameField('TicTacToeCanvas', game,
  fieldSize.width, fieldSize.height);
field.setup();
field.display();


field.endGame(function (result) {
  sendNotification('Winner: ' + result.winner);
});

field.moveExpected(function (event) {
  sendNotification('Move of player: ' + event.player);

  if (field.gameEngine.currentPlayer === 2 && playWithBotCheckbox.attr('checked')) {
    makeBotGeneratedMove(field);
  }
});

field.invalidMove(function (event) {
  sendNotification('Invalid move! Player: ' + event.player);
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
    if (field.gameEngine.currentPlayer === 2) {
      makeBotGeneratedMove();
    }
  } else {
    location.hash = '#two_players';
  }
});
