function ControlsCtrl($scope) {
  $scope.restart = function () {
    startGame();
  }
  $scope.toggleOpponent = function() {
    if (!opponentIsHuman && game.currentPlayer === 2) {
      botGeneratedMove(canvas);
    }
    opponentIsHuman = !opponentIsHuman;
  }
}

function PageCtrl($scope, $window) {
  $scope.init = function () {
    startGame()
  }
  angular.element($window).bind('resize', updateCanvasSize);
  angular.element($window).bind('orientationchange', updateCanvasSize);
}
