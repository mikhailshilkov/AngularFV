'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MessageListCtrl', ['$scope', '$routeParams', '$location', 'MessageService', 'AssetGroupService',
  function ($scope, $routeParams, $location, MessageService, AssetGroupService) {
    $scope.messages = [];
    $scope.newCount = 0;
    $scope.selectedFolder = 'inbox';
    $scope.selectedMessage = null;
    $scope.assetGroups = null;
    $scope.searchTerm = '';

    AssetGroupService.getAll(function (data) {
      $scope.assetGroups = [{ id: 0, name: 'All Vehicles', children: data }];
      $scope.$watch('tree.currentNode', function () {
        $scope.retrieveMessages();
      });
    });

    $scope.retrieveMessages = function () {
      $scope.selectedMessage = null;
      var selectedGroup = $scope.tree && $scope.tree.currentNode ? $scope.tree.currentNode.id : null;
      MessageService.getAll({ folder: $scope.selectedFolder, assetGroup: selectedGroup, filter: $scope.searchTerm }, function (data) {
        $scope.messages = data;
        $scope.selectedMessage = $scope.messages[0];
        if ($scope.selectedFolder == 'inbox' && selectedGroup === null && $scope.searchTerm === '') {
          $scope.newCount = $scope.messages.filter(function (x) { return x.status === 'unread' }).length;
        }
      });
    };

    $scope.selectMessage = function (message) {
      $scope.selectedMessage = message;
    };

    $scope.selectNext = function () {
      $scope.selectMessage($scope.messages[$scope.messages.indexOf($scope.selectedMessage) + 1]);
    };

    $scope.selectPrevious = function () {
      var index = $scope.messages.indexOf($scope.selectedMessage);
      if (index > 0) {
        $scope.selectMessage($scope.messages[index - 1]);
      }
    };

    $scope.$on('closenewmessage', function () {
      $scope.newMessage = false;
    });

    $scope.retrieveMessages();
  }])
  .controller('NewMessageCtrl', ['$scope', 'MessageService',
    function ($scope, MessageService) {
      $scope.recepient = '';
      $scope.text = '';

      $scope.sendMessage = function () {
        MessageService.sendMessage({ to: $scope.recepient, text: $scope.text },
          function (data) {
            $scope.hideDialog();
          })
      };

      $scope.hideDialog = function () {
        $scope.$emit('closenewmessage');
        $scope.recepient = '';
        $scope.text = '';
      };
    }])
  .controller('MyCtrl2', [function () {
  }]);