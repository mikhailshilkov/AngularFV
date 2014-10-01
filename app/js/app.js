'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'angularTreeview'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/messages', { templateUrl: 'partials/messages.html', controller: 'MessageListCtrl' });
  $routeProvider.when('/messages/:folder', { templateUrl: 'partials/messages.html', controller: 'MessageListCtrl' });
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  //$routeProvider.otherwise({ redirectTo: '/messages' });
}]);
