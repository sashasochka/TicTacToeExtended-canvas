"use strict";

var playWithBotCheckbox = $('#playWithBotCheckbox'),
  notificationElement = $('#notification');

var sendNotification = function (msg) {
  notificationElement.html(msg);
};


var newFieldSize = function () {
  var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width,
    deviceHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
  var result = Math.min(800, Math.min(deviceWidth, deviceHeight) * 7 / 8);
  sendNotification('Size: ' + result + ', width: ' + deviceHeight + ', height: ' + deviceWidth);
  return {
    width: result,
    height: result
  };
};

var makeBotGeneratedMove = function (field) {
  var nMaxConsequentFails = 1000,
    consequentFails = 0;
  while (consequentFails < nMaxConsequentFails) {
    var tryCoord = {
      x: randRange(field.gameEngine.size),
      y: randRange(field.gameEngine.size)
    };
    if (field.gameEngine.isAllowedMove(tryCoord)) {
      field.cells[tryCoord.y][tryCoord.x].fire('click');
      break;
    } else {
      ++consequentFails;
    }
  }
  if (consequentFails === nMaxConsequentFails) {
    sendNotification('Bug found - computer cannot detect moves.' +
      ' Report to Oleksandr Sochka personally or via email ' +
      '&lt;<a href="mailto:sasha.sochka@gmail.com">sasha.sochka@gmail.com</a>&gt;');
  }
};
