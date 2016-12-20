  angular
    .module('productFinder')
    .controller('navCtrl', navCtrl);

  function navCtrl($scope,$location,$window, auth) {

    $scope.isLoggedIn = auth.isLoggedIn();

    $scope.currentUser = auth.currentUser();
    

    $scope.logout = function() {
      auth.logout();
      $window.location.reload();
    };

  }