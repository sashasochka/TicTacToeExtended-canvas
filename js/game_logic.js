"use strict";

var emptyCellArray2d = function (dim1, dim2) {
  var result = [];
  for (var outer = 0; outer < dim1; ++outer) {
    result[outer] = [];
    for (var inner = 0; inner < dim2; ++inner) {
      result[outer][inner] = new TicTacToeGame.Cell();
    }
  }
  return result;
};

var TicTacToeGame = function () {
  this.firstMove = true;
  this.previousTurnCoord = {y: -1, x: -1};
  this.baseSize = 3;
  this.size = this.baseSize * this.baseSize;
  this.currentPlayer = 1;
  this.cellOwner = emptyCellArray2d(this.size, this.size);
  this.squareOwner = emptyCellArray2d(this.baseSize, this.baseSize);
};


TicTacToeGame.Cell = function (player) {
  this.player = player || 0;
  assert(this.player >= 0,
    "Cell should be initialized with player number greater or equal than 0. Value passed: " + player);
  this.empty = function () {
    return this.player === 0;
  };
};

TicTacToeGame.prototype.makeTurn = function (coord) {
  // makes a turn by the current user
  // returns false if a move is illegal

  // some assertions
  assert(0 <= coord.x && coord.x < this.size, "x coordinate in makeTurn fails out of range");
  assert(0 <= coord.y && coord.y < this.size, "y coordinate in makeTurn fails out of range");
  assert(!this.gameFinished(), "Cannot make moves after game is finished!");

  var squareCoord = this._squareCoord(coord);
  var correctSquareCoord = {
    y: this.previousTurnCoord.y % this.baseSize,
    x: this.previousTurnCoord.x % this.baseSize
  };

  // Additional checks if move is invalid
  // cannot put to already filled cell
  if (!this.cellOwner[coord.y][coord.x].empty()) {
    return false;
  }
  // cannot put in (a, a) point in the first move by rules
  if (this.firstMove && this.turnLeadsToSameSquare(coord)) {
    return false;
  }
  // should put a mark only in the big square defined by the previous opponent move
  if (!this.firstMove &&
    (squareCoord.x !== correctSquareCoord.x || squareCoord.y !== correctSquareCoord.y)) {
    return false;
  }

  this.firstMove = false;


  // making a turn itself
  this.cellOwner[coord.y][coord.x].player = this.currentPlayer;

  // update big cells ownership
  this._updateSquareOwnership(squareCoord, this.currentPlayer);

  // now it's a turn of the next player
  // 2 becomes 1 and 1 becomes 2
  this.currentPlayer = 3 - this.currentPlayer;
  this.previousTurnCoord = {x: coord.x, y: coord.y};
  return true;
};

TicTacToeGame.prototype.gameFinished = function () {
  return this.winner() !== undefined;
};

TicTacToeGame.prototype.winner = function () {
  if (this._checkWinner(1)) {
    return 1;
  }
  if (this._checkWinner(2)) {
    return 2;
  }
  return undefined;
};

TicTacToeGame.prototype.turnLeadsToSameSquare = function (coord) {
  var squareCoord = this._squareCoord(coord);
  return coord.x % this.baseSize === squareCoord.x &&
    coord.y % this.baseSize === squareCoord.y;
};

TicTacToeGame.prototype._squareCoord = function (coord) {
  return {
    y: Math.floor(coord.y / this.baseSize),
    x: Math.floor(coord.x / this.baseSize)
  };
};

TicTacToeGame.prototype._updateSquareOwnership = function (SquareCoord, player) {
  var playerOwnsSquare = false;
  for (var row = 0; row < this.baseSize; ++row) {
    if (this._checkInSquareRow(SquareCoord, row, player)) {
      playerOwnsSquare = true;
    }
  }
  for (var col = 0; col < this.baseSize; ++col) {
    if (this._checkInSquareCol(SquareCoord, col, player)) {
      playerOwnsSquare = true;
    }
  }
  if (this._checkInSquareDiagonals(SquareCoord, player)) {
    playerOwnsSquare = true;
  }
  if (playerOwnsSquare) {
    this.squareOwner[SquareCoord.y][SquareCoord.x].player = player;
  }
};

TicTacToeGame.prototype._checkWinner = function (player) {
  for (var i = 0; i < this.baseSize; ++i) {
    if (this._checkSquareRow(i, player) || this._checkSquareCol(i, player)) {
      return true;
    }
  }
  return this._checkSquareDiagonals(player);
};

TicTacToeGame.prototype._checkSquareRow = function (row, player) {
  for (var col = 0; col < this.baseSize; ++col) {
    if (this.squareOwner[row][col].player !== player) {
      return false;
    }
  }
  return true;
};

TicTacToeGame.prototype._checkSquareCol = function (col, player) {
  for (var row = 0; row < this.baseSize; ++row) {
    if (this.squareOwner[row][col].player !== player) {
      return false;
    }
  }
  return true;
};

TicTacToeGame.prototype._checkSquareDiagonals = function (player) {
  // _check main diagonal
  var mainDiagonal = true;
  for (var row = 0; row < this.baseSize; ++row) {
    if (this.squareOwner[row][row].player !== player) {
      mainDiagonal = false;
    }
  }
  if (mainDiagonal) {
    return true;
  }

  // _check additional diagonal
  // `var row` was declared in the loop above
  for (row = 0; row < this.baseSize; ++row) {
    if (this.squareOwner[row][this.baseSize - row - 1].player !== player) {
      return false;
    }
  }
  return true;
};

TicTacToeGame.prototype._checkInSquareRow = function (SquareCoord, row, currentPlayer) {
  var colStart = this.baseSize * SquareCoord.x;
  for (var col = colStart; col < colStart + this.baseSize; ++col) {
    if (this.cellOwner[row][col].player !== currentPlayer) {
      return false;
    }
  }
  return true;
};

TicTacToeGame.prototype._checkInSquareCol = function (SquareCoord, col, currentPlayer) {
  var rowStart = this.baseSize * SquareCoord.y;
  for (var row = rowStart; row < rowStart + this.baseSize; ++row) {
    if (this.cellOwner[row][col].player !== currentPlayer) {
      return false;
    }
  }
  return true;
};

TicTacToeGame.prototype._checkInSquareDiagonals = function (SquareCoord, currentPlayer) {
  // _check main diagonal
  var mainDiagonal = true;
  var baseX = SquareCoord.x * this.baseSize;
  var baseY = SquareCoord.y * this.baseSize;
  for (var d = 0; d < this.baseSize; ++d) {
    if (this.cellOwner[baseY + d][baseX + d].player !== currentPlayer) {
      mainDiagonal = false;
    }
  }
  if (mainDiagonal) {
    return true;
  }

  // _check additional diagonal
  // `var d` was declared in the loop above
  for (d = 0; d < this.baseSize; ++d) {
    if (this.cellOwner[baseY + d][baseX + this.baseSize - d - 1].player !== currentPlayer) {
      return false;
    }
  }
  return true;
};

