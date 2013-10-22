"use strict";

var notificationElement = $('#notification');

var sendNotification = function (msg) {
  notificationElement.html(msg);
};

var newCanvasSize = function () {
  var deviceWidth = $(window).width(),
    deviceHeight = $(window).height();
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
    if (_.isString(e)) {
      sendNotification('Exception in bot ' + bot.name + ': ' + e + '\n' +
        'Report to project maintainer personally or via email ' +
        '&lt;<a href="mailto:sasha.sochka@gmail.com">sasha.sochka@gmail.com</a>&gt;');
    } else {
      throw e;
    }
  }
};

var makeBotGeneratedMove = function () {
  var moveCoord = botGeneratedMove();
  makeMoveTo(moveCoord);
};
