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

gameLogicTest.prototype.testCell = function () {
  assertTrue(new TicTacToeGame.Cell().empty());
  assertFalse(new TicTacToeGame.Cell(1).empty());
  assertFalse(new TicTacToeGame.Cell(2).empty());

  assertSame(new TicTacToeGame.Cell(1).player, 1);
  assertSame(new TicTacToeGame.Cell(2).player, 2);
  assertException(function () {
    new TicTacToeGame.Cell(-1);
  }, assert.AssertionError.name);
};

gameLogicTest.prototype.testNotStartLeadingToSameSquare = function () {
  var game = new TicTacToeGame();
  assertFalse(game.makeTurn({x: 4, y: 4}));
  assertFalse(game.makeTurn({x: 8, y: 8}));
  assertFalse(game.makeTurn({x: 0, y: 8}));
  assertTrue(game.makeTurn({x: 5, y: 3}));
};

gameLogicTest.prototype.testDependencyOnPreviousMove = function () {
  var game = new TicTacToeGame();

  assertTrue(game.makeTurn({x: 0, y: 5}));
  assertFalse(game.firstMove);
  assertSame(game.previousTurnCoord.x , 0);
  assertSame(game.previousTurnCoord.y , 5);

  assertFalse(game.makeTurn({x: 0, y: 3}));
  assertFalse(game.makeTurn({x: 3, y: 8}));
  assertFalse(game.makeTurn({x: 5, y: 8}));

  assertSame(game.previousTurnCoord.x, 0);
  assertSame(game.previousTurnCoord.y, 5);
  assertTrue(game.makeTurn({x: 2, y: 8}));
};

gameLogicTest.prototype.testMoveSameCell = function () {
  var game = new TicTacToeGame();
  assertTrue(game.makeTurn({x: 1, y: 0}));
  assertTrue(game.makeTurn({x: 4, y: 0}));
  assertFalse(game.makeTurn({x: 1, y: 0}));
};

gameLogicTest.prototype.testCurrentPlayer = function () {
  var game = new TicTacToeGame();
  assertSame(game.currentPlayer, 1);
  game.makeTurn({x: 1, y: 0});
  assertSame(game.currentPlayer, 2);
  assertFalse(game.makeTurn({x: 1, y: 0}));
  assertSame(game.currentPlayer, 2);
};
