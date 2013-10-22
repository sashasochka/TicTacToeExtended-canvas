"use strict";

console.assert(typeof TicTacToeGame !== 'undefined');


var GameCanvas = function (container, gameEngine, size) {
  this.container = container;
  this.gameEngine = gameEngine;

  // colors
  this.squareStrokeColor = 'gray';
  this.backgroundColor = this.squareStrokeColor;
  this.squareBackgroundColor = 'orange';
  this.cellColor = '#333';
  this.cellStrokeColor = 'black';
  this.firstPlayerColor = 'red';
  this.secondPlayerColor = 'blue';
  this.lastSelectedCellColor = 'yellow';
  this.selectedSquareStrokeColor = 'yellow';
  this.firstPlayerSquareBackgroundColor = 'brown';
  this.secondPlayerSquareBackgroundColor = 'lightblue';

  // dimensions and geometry
  this.width = size.width;
  this.height = size.height;
  this.scaleRatio = {
    y: 1,
    x: 1
  };
  this.squareCoordDiff = {
    x: (this.width / this.gameEngine.baseSize),
    y: (this.height / this.gameEngine.baseSize)
  };
  this.squareDimensions = {
    width: this.squareCoordDiff.x,
    height: this.squareCoordDiff.y
  };
  this.squareBorderWidth = this.width / 160;
  this.freeSpaceBetweenCells = {
    x: this.width / 180,
    y: this.height / 180
  };
  // FIXME Problems here! Not counted in formulas! Not guaranteed to work if changed
  this.cellBorderWidth = Math.min(this.width, this.height) / 250;
  this.firstCellCoord = {
    x: this.squareBorderWidth + this.cellBorderWidth / 2,
    y: this.squareBorderWidth + this.cellBorderWidth / 2
  };
  this.cellsDim = {
    width:  (this.squareDimensions.width - 2 * this.firstCellCoord.x -
      (gameEngine.baseSize - 1) * this.freeSpaceBetweenCells.x) / gameEngine.baseSize,
    height:  (this.squareDimensions.height - 2 * this.firstCellCoord.y -
      (gameEngine.baseSize - 1) * this.freeSpaceBetweenCells.y) / gameEngine.baseSize
  };
  this.cellsCoordDiff = {
    x: this.cellsDim.width + this.freeSpaceBetweenCells.x,
    y: this.cellsDim.height + this.freeSpaceBetweenCells.y
  };
  this.crossStrokeWidth = this.width / 160;
  this.circleStrokeWidth = this.width / 200;
  this.crossDiagonalPadding = {
    x: this.width / 110,
    y: this.height / 110
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
  this.events = ['cellClicked'];
  this._addEvents(this.events);
};

// constants
GameCanvas.horizontal = 0;
GameCanvas.vertical = 1;

GameCanvas.Cell = function (square, innerCoord, outerCoord) {
  this.square = square;
  this.field = square.field;
  this.coord = outerCoord;
  this.innerCoord = innerCoord;

  this.groupSettings = {
    x: this.field.firstCellCoord.x + innerCoord.x * this.field.cellsCoordDiff.x,
    y: this.field.firstCellCoord.y + innerCoord.y * this.field.cellsCoordDiff.y,
  };
  this.rectSettings = {
    x: 0,
    y: 0,
    width: this.field.cellsDim.width,
    height: this.field.cellsDim.height,
    fill: this.field.cellColor,
    stroke: this.field.cellStrokeColor,
    strokeWidth: this.field.cellBorderWidth
  };
  this.group = new Kinetic.Group(this.groupSettings);
  this.cell = new Kinetic.Rect(this.rectSettings);
  var outerScopeThis = this;
  this.cell.on('click tap', function () {
    outerScopeThis.field.raiseCellClicked(outerScopeThis.coord);
  });
  this.group.add(this.cell);
  square.group.add(this.group);
};

GameCanvas.Cell.prototype.setBackground = function (color) {
  this.cell.setFill(color);
};

GameCanvas.Cell.prototype.drawCross = function () {
  var crossMainDiagonalLine = new Kinetic.Line({
    points: [
      this.field.crossDiagonalPadding.x,
      this.field.crossDiagonalPadding.x,
      this.rectSettings.width - this.field.crossDiagonalPadding.x,
      this.rectSettings.height - this.field.crossDiagonalPadding.y
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
  this.group.add(crossMainDiagonalLine);
  this.group.add(crossAdditionalDiagonalLine);
  this.field.display();
};

GameCanvas.Cell.prototype.drawCircle = function () {
  var circle = new Kinetic.Circle({
    x: this.rectSettings.width / 2,
    y: this.rectSettings.height / 2,
    radius: this.rectSettings.width / 2 - this.rectSettings.width / 15,
    stroke: this.field.secondPlayerColor,
    strokeWidth: this.field.circleStrokeWidth
  });
  this.group.add(circle);
  this.field.display();
};

GameCanvas.Square = function (field, coord) {
  this.field = field;
  this.coord = coord;
  this.groupSettings = {
    x: coord.x * field.squareCoordDiff.x,
    y: coord.y * field.squareCoordDiff.y,
    width: field.squareDimensions.width,
    height: field.squareDimensions.height
  };
  this.squareSettings = {
    x: field.squareBorderWidth / 2,
    y: field.squareBorderWidth / 2,
    fill: field.squareBackgroundColor,
    stroke: field.squareStrokeColor,
    strokeWidth: field.squareBorderWidth
  };
  this.squareSettings.width = this.groupSettings.width - 2 * this.squareSettings.x;
  this.squareSettings.height = this.groupSettings.height - 2 * this.squareSettings.y;
  this.group = new Kinetic.Group(this.groupSettings);
  this.square = new Kinetic.Rect(this.squareSettings);
  this.group.add(this.square);
  field.layer.add(this.group);
};

GameCanvas.Square.prototype.addCells = function () {
  for (var row = 0; row < this.field.gameEngine.baseSize; ++row) {
    for (var col = 0; col < this.field.gameEngine.baseSize; ++col) {
      var y = this.coord.y * this.field.gameEngine.baseSize + row;
      var x = this.coord.x * this.field.gameEngine.baseSize + col;
      this.field.cells[y][x] = new GameCanvas.Cell(this, {
        y: row,
        x: col
      }, {
        y: y,
        x: x
      });
    }
  }
};

GameCanvas.Square.prototype.setOwnerBackground = function (owner) {
  for (var row = 0; row < this.field.gameEngine.baseSize; ++row) {
    for (var col = 0; col < this.field.gameEngine.baseSize; ++col) {
      var y = this.coord.y * this.field.gameEngine.baseSize + row;
      var x = this.coord.x * this.field.gameEngine.baseSize + col;
      var color = field[(owner === 1) ? 'firstPlayerSquareBackgroundColor' : 'secondPlayerSquareBackgroundColor'];
      this.field.cells[y][x].setBackground(color);
    }
  }
  this.field.display();
};

GameCanvas.Square.prototype.select = function () {
  this.square.setStroke(this.field.selectedSquareStrokeColor);
  this.field.display();
};

GameCanvas.Square.prototype.unselect = function () {
  this.square.setStroke(this.field.squareStrokeColor);
  this.field.display();
};

GameCanvas.prototype.addBackground = function () {
  this.background = new Kinetic.Rect({
    x: 0,
    y: 0,
    width: this.width,
    height: this.height,
    fill: this.backgroundColor,
    stroke: this.squareStrokeColor,
    strokeWidth: 0
  });
  this.layer.add(this.background);
};

GameCanvas.prototype.addCells = function () {
  this.cells = [];
  for (var row = 0; row < this.gameEngine.size; ++row) {
    this.cells[row] = [];
  }
  for (var row = 0; row < this.gameEngine.baseSize; ++row) {
    for (var col = 0; col < this.gameEngine.baseSize; ++col) {
      this.squares[row][col].addCells();
    }
  }
};

GameCanvas.prototype.addSquares = function () {
  this.squares = [];
  for (var y = 0; y < this.gameEngine.baseSize; ++y) {
    this.squares[y] = [];
    for (var x = 0; x < this.gameEngine.baseSize; ++x) {
      this.squares[y][x] = new GameCanvas.Square(this, {y: y, x: x});
    }
  }
};

GameCanvas.prototype.resize = function (newSize) {
  this.scaleRatio = {
    y: newSize.height / this.height,
    x: newSize.width / this.width
  };
  this.layer.setScale(this.scaleRatio.x, this.scaleRatio.y);
  this.stage.setWidth(newSize.width);
  this.stage.setHeight(newSize.height);
  this.display();
};

GameCanvas.prototype.setup = function () {
  this.addBackground();
  this.addSquares();
  this.addCells();
};

GameCanvas.prototype.display = function () {
  this.stage.draw();
};

GameCanvas.prototype._addEvents = function (events) {
  for (var index = 0; index < events.length; ++index) {
    this._addEvent(events[index]);
  }
};

GameCanvas.prototype._addEvent = function (eventName) {
  var eventsListMemberName = 'on' + eventName.capitalize(),
    raiseFunctionName = 'raise' + eventName.capitalize();
  var callbacks = this[eventsListMemberName] = [];
  this[eventName] = function (callback) {
    callbacks.push(callback);
  };
  this[raiseFunctionName] = function () {
    for (var index = 0; index < this[eventsListMemberName].length; ++index) {
      callbacks[index].apply(this, arguments);
    }
  };
};
