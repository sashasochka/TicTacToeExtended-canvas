"use strict";

var notificationElement = $('#notification');

var sendNotification = function (msg) {
  notificationElement.html(msg);
};

var newFieldSize = function () {
  var deviceWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width,
    deviceHeight = (window.innerHeight > 0) ? window.innerHeight : screen.height;
  var result = Math.min(deviceWidth, deviceHeight) * 7 / 8;
  sendNotification('Size: ' + result + ', width: ' + deviceHeight + ', height: ' + deviceWidth);
  return {
    width: result,
    height: result
  };
};

var bot = new SimpleBot();

var botGeneratedMove = function () {
  try {
    return bot.getMove(game);
  } catch (e) {
    if (e.isString()) {
      sendNotification('Exception in bot ' + bot.name + ': ' + e + '\n' +
        'Report to project maintainer personally or via email ' +
        '&lt;<a href="mailto:sasha.sochka@gmail.com">sasha.sochka@gmail.com</a>&gt;');
    } else {
      throw e;
    }
  }
};

var makeBotGeneratedMoveWithDelay = function (delay) {
  setTimeout(function () {
    var moveCoord = botGeneratedMove();
    makeMoveTo(moveCoord);
  }, delay);
};
