"use strict";

var SimpleBot = function () {
  this.naame = 'SimpleBot';
};

SimpleBot.prototype.getMove = function (game) {
  var nMaxConsequentFails = 1000,
    nMaxCleverTryFails = 900,
    consequentFails = 0;
  while (consequentFails < nMaxConsequentFails) {
    var tryCoord = {
      x: randRange(game.size),
      y: randRange(game.size)
    };
    var squareCoord = game.squareCoordByCell(tryCoord);
    var isStupidMove = game.square[squareCoord.y][squareCoord.x].empty();
    if (game.isAllowedMove(tryCoord) && (!isStupidMove || consequentFails > nMaxCleverTryFails)) {
      return tryCoord;
    } else {
      ++consequentFails;
    }
  }
  if (consequentFails === nMaxConsequentFails) {
    throw 'No moves detected';
  }
};