function ControlsCtrl($scope) {
  $scope.restart = startGame;
  $scope.toggleOpponent = function() {
    if (!opponentIsHuman && game.currentPlayer === 2) {
      makeBotGeneratedMove();
    }
    opponentIsHuman = !opponentIsHuman;
  }
}

function PageCtrl($scope, $window) {
  $scope.init = startGame;
  angular.element($window).bind('resize', updateCanvasSize);
  angular.element($window).bind('orientationchange', updateCanvasSize);
}
