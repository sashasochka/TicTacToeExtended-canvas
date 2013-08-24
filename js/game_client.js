"use strict";

console.assert(typeof TicTacToeGame !== 'undefined');

var game = new TicTacToeGame();

var displaySettings = new function () {
  this.container = 'TicTacToeCanvas';

  // colors
  this.backgroundColor = 'orange';
  this.cellColor = 'green';
  this.cellBorderColor = 'black';
  this.firstPlayerColor = 'red';
  this.secondPlayerColor = 'blue';
  this.innerSquareGridLineColor = 'gray';

  // dimensions
  this.width = 800;
  this.height = this.width;
  this.crossStrokeWidth = this.width / 160;
  this.circleStrokeWidth = this.width / 160;
  this.cellBorderWidth = Math.min(this.width, this.height) / 140;
  this.crossDiagonalPadding = {
    x: this.width / 110,
    y: this.height / 110
  };
  this.freeSpaceBetweenCells = {
    x: this.width / 160,
    y: this.height / 160
  };
  this.firstCellCoord = {
    x: this.cellBorderWidth / 2 + this.freeSpaceBetweenCells.x / 2 + 3,
    y: this.cellBorderWidth / 2 + this.freeSpaceBetweenCells.y / 2 + 3
  };
  this.cellsDim = {
    width:  this.width / game.size -
      this.cellBorderWidth - this.freeSpaceBetweenCells.x / 2,
    height:  this.height / game.size -
      this.cellBorderWidth - this.freeSpaceBetweenCells.y / 2
  };
  this.cellsCoordDiff = {
    x: (this.width - this.freeSpaceBetweenCells.x) / game.size,
    y: (this.height - this.freeSpaceBetweenCells.y ) / game.size
  };
}();

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
    fill: displaySettings.cellColor,
    stroke: displaySettings.cellBorderColor,
    strokeWidth: displaySettings.cellBorderWidth
  };
  Kinetic.Rect.call(this, rectSettings);
  this.on('click', function () {
    var player = game.currentPlayer;
    if (game.makeTurn(coord)) {
      if (player === 1) {
        var crossMainDiagonalLine = new Kinetic.Line({
          points: [
            rectSettings.x + displaySettings.crossDiagonalPadding.x,
            rectSettings.y + displaySettings.crossDiagonalPadding.x,
            rectSettings.x + rectSettings.width - displaySettings.crossDiagonalPadding.x,
            rectSettings.y + rectSettings.height - displaySettings.crossDiagonalPadding.y
          ],
          stroke: displaySettings[player === 1 ? 'firstPlayerColor' : 'secondPlayerColor'],
          strokeWidth: displaySettings.crossStrokeWidth,
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
          stroke: displaySettings[player === 1 ? 'firstPlayerColor' : 'secondPlayerColor'],
          strokeWidth: displaySettings.crossStrokeWidth,
          lineCap: 'round',
          lineJoin: 'round'
        });
        layer.add(crossMainDiagonalLine);
        layer.add(crossAdditionalDiagonalLine);
      } else {
        var circle = new Kinetic.Circle({
          x: rectSettings.x + rectSettings.width / 2,
          y: rectSettings.y + rectSettings.height / 2,
          radius: rectSettings.width / 2 - rectSettings.width / 15,
          stroke: displaySettings[player === 1 ? 'firstPlayerColor' : 'secondPlayerColor'],
          strokeWidth: 4
        });
        layer.add(circle);
      }
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
  width: displaySettings.width,
  height: displaySettings.height,
  fill: displaySettings.backgroundColor,
  stroke: displaySettings.innerSquareGridLineColor,
  strokeWidth: 0
}));

// add the shape to the layer
for (var y = 0; y < game.size; ++y) {
  for (var x = 0; x < game.size; ++x) {
    layer.add(new SmallCell({y: y,  x : x}));
  }
}

var horizontal = 0, vertical = 1;
var drawInnerSquareGridLine = function (index, direction) {
  var point1, point2;
  if (direction === horizontal) {
    point1 = {
      x: 0,
      y: displaySettings.firstCellCoord.y + game.baseSize * index * displaySettings.cellsCoordDiff.y -
        displaySettings.freeSpaceBetweenCells.y / 2 - displaySettings.cellBorderWidth / 2 + 1
    };
    point2 = {
      x: displaySettings.width,
      y: displaySettings.firstCellCoord.y + game.baseSize * index * displaySettings.cellsCoordDiff.y -
        displaySettings.freeSpaceBetweenCells.y / 2 - displaySettings.cellBorderWidth / 2 + 1
    };
  } else {
    point1 = {
      x: displaySettings.firstCellCoord.x + game.baseSize * index * displaySettings.cellsCoordDiff.x -
        displaySettings.freeSpaceBetweenCells.x / 2 - displaySettings.cellBorderWidth / 2 + 1,
      y: 0
    };
    point2 = {
      x: displaySettings.firstCellCoord.x + game.baseSize * index * displaySettings.cellsCoordDiff.x -
        displaySettings.freeSpaceBetweenCells.x / 2 - displaySettings.cellBorderWidth / 2 + 1,
      y: displaySettings.width
    };
  }
  layer.add(new Kinetic.Line({
    points: [
      point1.x,
      point1.y,
      point2.x,
      point2.y
    ],
    stroke: displaySettings.innerSquareGridLineColor,
    strokeWidth: displaySettings.freeSpaceBetweenCells[horizontal ? 'y' : 'x'] + 1,
    lineCap: 'round',
    lineJoin: 'round'
  }));
};

for (var index = 0; index <= game.baseSize; ++index) {
  drawInnerSquareGridLine(index, horizontal);
  drawInnerSquareGridLine(index, vertical);
}

stage.add(layer);
