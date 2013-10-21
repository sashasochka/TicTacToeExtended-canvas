"use strict";

var fieldSize;
var game;
var field;
var selectedSquare;

var opponentIsHuman = true;

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
          makeBotGeneratedMoveWithDelay(cell.field, 400);
        }
      }
    } else {
      sendNotification('Invalid move! Player: ' + game.currentPlayer);
    }
  });
};

var updateFieldSize = function () {
  field.resize(newFieldSize());
};

function ControlsCtrl($scope) {
  $scope.restart = function () {
    startGame();
  }
  $scope.toggleOpponent = function() {
    if (!opponentIsHuman && game.currentPlayer === 2) {
      makeBotGeneratedMove(field);
    }
    opponentIsHuman = !opponentIsHuman;
  }
}

function PageCtrl($scope, $window) {
  $scope.init = function () {
    startGame()
  }
  angular.element($window).bind('resize', updateFieldSize);
  angular.element($window).bind('orientationchange', updateFieldSize);
}

