"use strict";

console.assert(typeof TicTacToeGame !== 'undefined');

var game = new TicTacToeGame();

var displaySettings = new function () {
  this.container = 'TicTacToeCanvas';
  this.width = 800;
  this.height = 800;
  this.cellBorderWidth = 7;
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
stage.add(layer);
