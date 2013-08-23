"use strict";

var gameLogicTest = new TestCase("GameLogicTest");

gameLogicTest.prototype.testTurnLeadsToSameSquare = function () {
  var game = new TicTacToeGame();
  assertTrue(game.turnLeadsToSameSquare({x: 0, y: 0}));
  assertTrue(game.turnLeadsToSameSquare({x: 8, y: 0}));
  assertTrue(game.turnLeadsToSameSquare({x: 4, y: 4}));
  assertFalse(game.turnLeadsToSameSquare({x: 4, y: 2}));
  assertFalse(game.turnLeadsToSameSquare({x: 3, y: 4}));
};

gameLogicTest.prototype.testCell = function() {
  assertTrue(new TicTacToeGame.Cell().empty());
  assertFalse(new TicTacToeGame.Cell(1).empty());
  assertFalse(new TicTacToeGame.Cell(2).empty());

  assertTrue(new TicTacToeGame.Cell(1).player === 1);
  assertTrue(new TicTacToeGame.Cell(2).player === 2);
  assertException(function() {
    new TicTacToeGame.Cell(-1);
  }, assert.AssertionError.name);
};

gameLogicTest.prototype.testNotStartLeadingToSameSquare = function() {
  var game = new TicTacToeGame();
  assertFalse(game.makeTurn({x: 4, y: 4}));
  assertFalse(game.makeTurn({x: 8, y: 8}));
  assertFalse(game.makeTurn({x: 0, y: 8}));
  assertTrue(game.makeTurn({x: 5, y: 3}));
};

gameLogicTest.prototype.testDependencyOnPreviousMove = function() {
  var game = new TicTacToeGame();

  assertTrue(game.makeTurn({x: 0, y: 5}));
  assertFalse(game.firstMove);
  assertTrue(game.previousTurnCoord.x === 0);
  assertTrue(game.previousTurnCoord.y === 5);

  assertFalse(game.makeTurn({x: 0, y: 3}));
  assertFalse(game.makeTurn({x: 3, y: 8}));
  assertFalse(game.makeTurn({x: 5, y: 8}));

  assertTrue(game.previousTurnCoord.x === 0);
  assertTrue(game.previousTurnCoord.y === 5);
  assertTrue(game.makeTurn({x: 2, y: 8}));
};

