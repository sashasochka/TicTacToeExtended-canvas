"use strict";

console.assert(typeof TicTacToeGame !== 'undefined');

var game = new TicTacToeGame();

var displaySettings = new function () {
  this.container = 'TicTacToeCanvas';
  this.width = 800;
  this.height = 800;
  this.cellBorderWidth = 7;
  this.crossDiagonalPadding = {
    x: 5,
    y: 5
  };
  this.freeSpaceBetweenCells = {
    x: 5,
    y: 5
  };
  this.firstCellCoord = {
    x: Math.floor(this.cellBorderWidth / 2 + this.freeSpaceBetweenCells.x / 2) + 3,
    y: Math.floor(this.cellBorderWidth / 2 + this.freeSpaceBetweenCells.y / 2) + 3
  };
  this.cellsDim = {
    width:  Math.floor(this.width / game.size -
      this.cellBorderWidth - this.freeSpaceBetweenCells.x / 2),
    height:  Math.floor(this.height / game.size -
      this.cellBorderWidth - this.freeSpaceBetweenCells.y / 2)
  };
  this.cellsCoordDiff = {
    x: Math.floor(this.width / game.size),
    y: Math.floor(this.height / game.size)
  };
};

var stage = new Kinetic.Stage({
    container: displaySettings.container,
    width: displaySettings.width,
    height: displaySettings.height
  }),
  layer = new Kinetic.Layer();


var SmallCell = function(coord) {
  var rectSettings = {
    x: displaySettings.firstCellCoord.x + coord.x * displaySettings.cellsCoordDiff.x,
    y: displaySettings.firstCellCoord.y + coord.y * displaySettings.cellsCoordDiff.y,
    width: displaySettings.cellsDim.width,
    height: displaySettings.cellsDim.height,
    fill: 'green',
    stroke: 'black',
    strokeWidth: displaySettings.cellBorderWidth
  };
  Kinetic.Rect.call(this, rectSettings);
  this.on('click', function () {
    var player = game.currentPlayer;
    if (game.makeTurn(coord)) {
      var crossMainDiagonalLine = new Kinetic.Line({
        points: [
          rectSettings.x + displaySettings.crossDiagonalPadding.x,
          rectSettings.y + displaySettings.crossDiagonalPadding.x,
          rectSettings.x + rectSettings.width - displaySettings.crossDiagonalPadding.x,
          rectSettings.y + rectSettings.height - displaySettings.crossDiagonalPadding.y
        ],
        stroke: player === 1 ? 'red' : 'blue',
        strokeWidth: 5,
        lineCap: 'round',
        lineJoin: 'round'
      });
      var crossAdditionalDiagonalLine = new Kinetic.Line({
        points: [
          rectSettings.x + displaySettings.crossDiagonalPadding.x,
          rectSettings.y + rectSettings.height - displaySettings.crossDiagonalPadding.y,
          rectSettings.x + rectSettings.width - displaySettings.crossDiagonalPadding.x,
          rectSettings.y + displaySettings.crossDiagonalPadding.x
        ],
        stroke: player === 1 ? 'red' : 'blue',
        strokeWidth: 5,
        lineCap: 'round',
        lineJoin: 'round'
      });
      layer.add(crossMainDiagonalLine);
      layer.add(crossAdditionalDiagonalLine);
      stage.draw();

      if (game.winner()) {
        $('#notification').html('Winner: ' + game.winner());
      } else {
        $('#notification').html('Move of player: ' + game.currentPlayer);
      }
    } else {
      $('#notification').html('Invalid move! Player: ' + game.currentPlayer);
    }
  });
};

SmallCell.prototype = Object.create(Kinetic.Rect.prototype);


layer.add(new Kinetic.Rect({
  x: 0,
  y: 0,
  width: 800,
  height: 800,
  fill: 'orange',
  stroke: 'gray',
  strokeWidth: 0
}));

// add the shape to the layer
for (var y = 0; y < game.size; ++y) {
  for (var x = 0; x < game.size; ++x) {
    layer.add(new SmallCell({y: y,  x : x}));
  }
}


layer.add(new Kinetic.Line({
  points: [
    0,
    displaySettings.firstCellCoord.y + 3 *displaySettings.cellsCoordDiff.y - displaySettings.freeSpaceBetweenCells.y / 2 - 1,
    displaySettings.width,
    displaySettings.firstCellCoord.y + 3 * displaySettings.cellsCoordDiff.y - displaySettings.freeSpaceBetweenCells.y / 2 - 1
  ],
  stroke: 'gray',
  strokeWidth: displaySettings.freeSpaceBetweenCells.y,
  lineCap: 'round',
  lineJoin: 'round'
}));


layer.add(new Kinetic.Line({
  points: [
    0,
    displaySettings.firstCellCoord.y + 6 *displaySettings.cellsCoordDiff.y - displaySettings.freeSpaceBetweenCells.y / 2 - 1,
    displaySettings.width,
    displaySettings.firstCellCoord.y + 6 * displaySettings.cellsCoordDiff.y - displaySettings.freeSpaceBetweenCells.y / 2 - 1
  ],
  stroke: 'gray',
  strokeWidth: displaySettings.freeSpaceBetweenCells.y,
  lineCap: 'round',
  lineJoin: 'round'
}));



layer.add(new Kinetic.Line({
  points: [
    displaySettings.firstCellCoord.x + 3 *displaySettings.cellsCoordDiff.x - displaySettings.freeSpaceBetweenCells.x / 2 - 1,
    0,
    displaySettings.firstCellCoord.x + 3 * displaySettings.cellsCoordDiff.x - displaySettings.freeSpaceBetweenCells.x / 2 - 1,
    displaySettings.width
  ],
  stroke: 'gray',
  strokeWidth: displaySettings.freeSpaceBetweenCells.x,
  lineCap: 'round',
  lineJoin: 'round'
}));



layer.add(new Kinetic.Line({
  points: [
    displaySettings.firstCellCoord.x + 6 *displaySettings.cellsCoordDiff.x - displaySettings.freeSpaceBetweenCells.x / 2 - 1,
    0,
    displaySettings.firstCellCoord.x + 6 * displaySettings.cellsCoordDiff.x - displaySettings.freeSpaceBetweenCells.x / 2 - 1,
    displaySettings.width
  ],
  stroke: 'gray',
  strokeWidth: displaySettings.freeSpaceBetweenCells.x,
  lineCap: 'round',
  lineJoin: 'round'
}));

stage.add(layer);
