function ControlsCtrl($scope) {
  $scope.restart = function () {
    startGame();
  }
  $scope.toggleOpponent = function() {
    if (!opponentIsHuman && game.currentPlayer === 2) {
      botGeneratedMove(field);
    }
    opponentIsHuman = !opponentIsHuman;
  }
}

function PageCtrl($scope, $window) {
  $scope.init = function () {
    startGame()
  }
  angular.element($window).bind('resize', updateFieldSize);
  angular.element($window).bind('orientationchange', updateFieldSize);
}
