"use strict";

console.assert(typeof TicTacToeGame !== 'undefined');


var Client = function (container, width, height) {
  this.container = container;
  this.gameEngine = new TicTacToeGame();

  // colors
  this.backgroundColor = 'orange';
  this.cellColor = 'green';
  this.cellBorderColor = 'black';
  this.firstPlayerColor = 'red';
  this.secondPlayerColor = 'blue';
  this.innerSquareGridLineColor = 'gray';

  // dimensions
  this.width = width;
  this.height = height || this.width;
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
};

// constants
Client.horizontal = 0;
Client.vertical = 1;

Client.Cell = function (client, coord) {
  var rectSettings = {
    x: client.firstCellCoord.x + coord.x * client.cellsCoordDiff.x,
    y: client.firstCellCoord.y + coord.y * client.cellsCoordDiff.y,
    width: client.cellsDim.width,
    height: client.cellsDim.height,
    fill: client.cellColor,
    stroke: client.cellBorderColor,
    strokeWidth: client.cellBorderWidth
  };
  Kinetic.Rect.call(this, rectSettings);
  this.on('click tap', function () {
    var player = client.gameEngine.currentPlayer;

    if (client.gameEngine.makeTurn(coord)) {
      if (player === 1) {
        var crossMainDiagonalLine = new Kinetic.Line({
          points: [
            rectSettings.x + client.crossDiagonalPadding.x,
            rectSettings.y + client.crossDiagonalPadding.x,
            rectSettings.x + rectSettings.width - client.crossDiagonalPadding.x,
            rectSettings.y + rectSettings.height - client.crossDiagonalPadding.y
          ],
          stroke: client[player === 1 ? 'firstPlayerColor' : 'secondPlayerColor'],
          strokeWidth: client.crossStrokeWidth,
          lineCap: 'round',
          lineJoin: 'round'
        });
        var crossAdditionalDiagonalLine = new Kinetic.Line({
          points: [
            rectSettings.x + client.crossDiagonalPadding.x,
            rectSettings.y + rectSettings.height - client.crossDiagonalPadding.y,
            rectSettings.x + rectSettings.width - client.crossDiagonalPadding.x,
            rectSettings.y + client.crossDiagonalPadding.x
          ],
          stroke: client[player === 1 ? 'firstPlayerColor' : 'secondPlayerColor'],
          strokeWidth: client.crossStrokeWidth,
          lineCap: 'round',
          lineJoin: 'round'
        });
        client.layer.add(crossMainDiagonalLine);
        client.layer.add(crossAdditionalDiagonalLine);
      } else {
        var circle = new Kinetic.Circle({
          x: rectSettings.x + rectSettings.width / 2,
          y: rectSettings.y + rectSettings.height / 2,
          radius: rectSettings.width / 2 - rectSettings.width / 15,
          stroke: client[player === 1 ? 'firstPlayerColor' : 'secondPlayerColor'],
          strokeWidth: 4
        });
        client.layer.add(circle);
      }
      client.stage.draw();

      if (client.gameEngine.winner()) {
        $('#notification').html('Winner: ' + client.gameEngine.winner());
      } else {
        $('#notification').html('Move of player: ' + client.gameEngine.currentPlayer);

        if (client.gameEngine.currentPlayer === 2 && location.hash !== '#two_players') {
          client.makeBotGeneratedMove();
        }
      }
    } else {
      $('#notification').html('Invalid move! Player: ' + client.gameEngine.currentPlayer);
    }
  });
};

Client.Cell.prototype = Object.create(Kinetic.Rect.prototype);

Client.prototype.addBackground = function () {
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

Client.prototype.addCells = function () {
  // add the shape to the layer
  this.cells = [];
  for (var y = 0; y < this.gameEngine.size; ++y) {
    this.cells[y] = [];
    for (var x = 0; x < this.gameEngine.size; ++x) {
      this.cells[y][x] = new Client.Cell(this,  {y: y,  x : x});
      this.layer.add(this.cells[y][x]);
    }
  }
};

Client.prototype.addSquareGridLines = function () {
  for (var index = 0; index <= this.gameEngine.baseSize; ++index) {
    this._drawInnerGridLine(this.gameEngine.baseSize * index, Client.horizontal);
    this._drawInnerGridLine(this.gameEngine.baseSize * index, Client.vertical);
  }
};

Client.prototype._drawInnerGridLine = function (index, direction) {
  var point1, point2;
  if (direction === Client.horizontal) {
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
    strokeWidth: this.freeSpaceBetweenCells[Client.horizontal ? 'y' : 'x'] + 1,
    lineCap: 'round',
    lineJoin: 'round'
  }));
};

Client.prototype._innerGridLineCoordFormula = function (index, dim) {
  return this.firstCellCoord[dim] + index * this.cellsCoordDiff[dim] -
    this.freeSpaceBetweenCells[dim] / 2 - this.cellBorderWidth / 2 + 1;
};

Client.prototype.updateSize = function() {
  var newClientSize = clientSize();
  var scaleArg = newClientSize / curClientSize;
  client.layer.setScale(scaleArg);
  client.stage.setWidth(newClientSize);
  client.stage.setHeight(newClientSize);
  client.display();
};

Client.prototype.makeBotGeneratedMove = function () {
  var nMaxConsequentFails = 1000,
    consequentFails = 0;
  while (consequentFails < nMaxConsequentFails) {
    var tryCoord = {
      x: randRange(client.gameEngine.size),
      y: randRange(client.gameEngine.size)
    };
    if (client.gameEngine.isAllowedMove(tryCoord)) {
      client.cells[tryCoord.y][tryCoord.x].fire('click');
      break;
    } else {
      ++consequentFails;
    }
  }
  if (consequentFails === nMaxConsequentFails) {
    $('#notification').html('Bug found - computer cannot detect moves.' +
      ' Report to Oleksandr Sochka personally or via email ' +
      '&lt;sasha.sochka@gmail.com&gt; or personally');
  }
};

Client.prototype.display = function () {
  this.stage.draw();
};

var clientSize = function () {
  var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width,
    deviceHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
  var result = Math.min(800, Math.min(deviceWidth, deviceHeight) * 7 / 8);
  $('#notification').html('Size: ' + result + ', width: ' + deviceHeight + ', height: ' + deviceWidth);
  return result;
};

var curClientSize = clientSize();
var client = new Client('TicTacToeCanvas', curClientSize);
client.addBackground();
client.addCells();
client.addSquareGridLines();
window.addEventListener("orientationchange", client.updateSize, false);
$(window).resize(client.updateSize);
client.display();

$('#playWithBotCheckbox').change(function () {
  if (location.hash === '#two_players') {
    location.hash = '';
    if (client.gameEngine.currentPlayer === 2) {
      client.makeBotGeneratedMove();
    }
  } else {
    location.hash = '#two_players';
  }
});
