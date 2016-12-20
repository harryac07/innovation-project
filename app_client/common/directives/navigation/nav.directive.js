  angular
    .module('productFinder')
    .directive('navigation', navigation);

  function navigation () {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/navigation/nav.html',
      controller: 'navCtrl'
    };
  }

//Directive or route for directive view navigation