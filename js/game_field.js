"use strict";

console.assert(typeof TicTacToeGame !== 'undefined');


var GameField = function (container, gameEngine, width, height) {
  this.container = container;
  this.gameEngine = gameEngine;

  // colors
  this.backgroundColor = 'orange';
  this.cellColor = 'green';
  this.cellBorderColor = 'black';
  this.firstPlayerColor = 'red';
  this.secondPlayerColor = 'blue';
  this.innerSquareGridLineColor = 'gray';
  this.lastSelectedCellColor = 'yellow';

  // dimensions and geometry
  this.width = width;
  this.height = height || this.width;
  this.scaleRatio = {
    y: 1.,
    x: 1.
  };
  this.crossStrokeWidth = this.width / 160;
  this.circleStrokeWidth = this.width / 200;
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
    width:  this.width / this.gameEngine.size -
      this.cellBorderWidth - this.freeSpaceBetweenCells.x / 2,
    height:  this.height / this.gameEngine.size -
      this.cellBorderWidth - this.freeSpaceBetweenCells.y / 2
  };
  this.cellsCoordDiff = {
    x: (this.width - this.freeSpaceBetweenCells.x) / this.gameEngine.size,
    y: (this.height - this.freeSpaceBetweenCells.y ) / this.gameEngine.size
  };


  // KineticJS elements
  this.stage = new Kinetic.Stage({
    container: this.container,
    width: this.width,
    height: this.height
  });
  this.layer = new Kinetic.Layer();
  this.stage.add(this.layer);

  // event callback functions
  this.events = ['endGame', 'invalidMove', 'moveExpected'];
  this._addEvents(this.events);
};

// constants
GameField.horizontal = 0;
GameField.vertical = 1;

GameField.Cell = function (field, coord) {
  this.field = field;
  this.rectSettings = {
    x: field.firstCellCoord.x + coord.x * field.cellsCoordDiff.x,
    y: field.firstCellCoord.y + coord.y * field.cellsCoordDiff.y,
    width: field.cellsDim.width,
    height: field.cellsDim.height,
    fill: field.cellColor,
    stroke: field.cellBorderColor,
    strokeWidth: field.cellBorderWidth
  };
  Kinetic.Rect.call(this, this.rectSettings);
  this.on('click tap', function () {
    var player = field.gameEngine.currentPlayer;

    if (field.gameEngine.makeTurn(coord)) {
      if (player === 1) {
        this.drawCross();
      } else {
        this.drawCircle();
      }
      if (field.gameEngine.winner()) {
        field.raiseEndGame({winner: field.gameEngine.winner()});
      } else {
        field.raiseMoveExpected({
          player: field.gameEngine.currentPlayer
        });
      }
    } else {
      field.raiseInvalidMove({
        player: field.gameEngine.currentPlayer
      });
    }
  });
};

GameField.Cell.prototype = Object.create(Kinetic.Rect.prototype);

GameField.Cell.prototype.drawCross = function () {
  var crossMainDiagonalLine = new Kinetic.Line({
    points: [
      this.rectSettings.x + this.field.crossDiagonalPadding.x,
      this.rectSettings.y + this.field.crossDiagonalPadding.x,
      this.rectSettings.x + this.rectSettings.width - this.field.crossDiagonalPadding.x,
      this.rectSettings.y + this.rectSettings.height - this.field.crossDiagonalPadding.y
    ],
    stroke: this.field.firstPlayerColor,
    strokeWidth: this.field.crossStrokeWidth,
    lineCap: 'round',
    lineJoin: 'round'
  });
  var crossAdditionalDiagonalLine = new Kinetic.Line({
    points: [
      this.rectSettings.x + this.field.crossDiagonalPadding.x,
      this.rectSettings.y + this.rectSettings.height - this.field.crossDiagonalPadding.y,
      this.rectSettings.x + this.rectSettings.width - this.field.crossDiagonalPadding.x,
      this.rectSettings.y + this.field.crossDiagonalPadding.x
    ],
    stroke: this.field.firstPlayerColor,
    strokeWidth: this.field.crossStrokeWidth,
    lineCap: 'round',
    lineJoin: 'round'
  });
  this.field.layer.add(crossMainDiagonalLine);
  this.field.layer.add(crossAdditionalDiagonalLine);
  this.field.display();
};

GameField.Cell.prototype.drawCircle = function () {
  var circle = new Kinetic.Circle({
    x: this.rectSettings.x + this.rectSettings.width / 2,
    y: this.rectSettings.y + this.rectSettings.height / 2,
    radius: this.rectSettings.width / 2 - this.rectSettings.width / 15,
    stroke: this.field.secondPlayerColor,
    strokeWidth: this.field.circleStrokeWidth
  });
  this.field.layer.add(circle);
  this.field.display();
};

GameField.prototype.setup = function () {
  this.addBackground();
  this.addCells();
  this.addSquareGridLines();
};

GameField.prototype.addBackground = function () {
  this.layer.add(new Kinetic.Rect({
    x: 0,
    y: 0,
    width: this.width,
    height: this.height,
    fill: this.backgroundColor,
    stroke: this.innerSquareGridLineColor,
    strokeWidth: 0
  }));
};

GameField.prototype.addCells = function () {
  // add the shape to the layer
  this.cells = [];
  for (var y = 0; y < this.gameEngine.size; ++y) {
    this.cells[y] = [];
    for (var x = 0; x < this.gameEngine.size; ++x) {
      this.cells[y][x] = new GameField.Cell(this,  {y: y,  x : x});
      this.layer.add(this.cells[y][x]);
    }
  }
};

GameField.prototype.addSquareGridLines = function () {
  for (var index = 0; index <= this.gameEngine.baseSize; ++index) {
    this._drawInnerGridLine(this.gameEngine.baseSize * index, GameField.horizontal);
    this._drawInnerGridLine(this.gameEngine.baseSize * index, GameField.vertical);
  }
};

GameField.prototype.updateSize = function (newSize) {
  this.scaleRatio = {
    y: newSize.height / this.height,
    x: newSize.width / this.width
  } ;
  this.layer.setScale(this.scaleRatio.x, this.scaleRatio.y);
  this.stage.setWidth(newSize.width);
  this.stage.setHeight(newSize.height);
  this.display();
};

GameField.prototype.display = function () {
  this.stage.draw();
};

GameField.prototype._addEvents = function (events) {
  for (var index = 0; index < events.length; ++index) {
    this._addEvent(events[index]);
  }
};

GameField.prototype._addEvent = function (event) {
  var eventsListMemberName ='on' + event.capitalize(),
    raiseFunctionName = 'raise' + event.capitalize();
  var callbacks = this[eventsListMemberName] = [];
  this[event] = function (callback) {
    callbacks.push(callback);
  };
  this[raiseFunctionName] = function () {
    for (var index = 0; index < this[eventsListMemberName].length; ++index) {
      callbacks[index].apply(this, arguments);
    }
  };
};

GameField.prototype._innerGridLineCoordFormula = function (index, dim) {
  return this.firstCellCoord[dim] + index * this.cellsCoordDiff[dim] -
    this.freeSpaceBetweenCells[dim] / 2 - this.cellBorderWidth / 2 + 1;
};

GameField.prototype._drawInnerGridLine = function (index, direction) {
  var point1, point2;
  if (direction === GameField.horizontal) {
    point1 = {
      x: 0,
      y: this._innerGridLineCoordFormula(index, 'y')
    };
    point2 = {
      x: this.width,
      y: this._innerGridLineCoordFormula(index, 'y')
    };
  } else {
    point1 = {
      x: this._innerGridLineCoordFormula(index, 'x'),
      y: 0
    };
    point2 = {
      x: this._innerGridLineCoordFormula(index, 'x'),
      y: this.width
    };
  }
  this.layer.add(new Kinetic.Line({
    points : [
      point1.x,
      point1.y,
      point2.x,
      point2.y
    ],
    stroke: this.innerSquareGridLineColor,
    strokeWidth: this.freeSpaceBetweenCells[GameField.horizontal ? 'y' : 'x'] + 1,
    lineCap: 'round',
    lineJoin: 'round'
  }));
};
