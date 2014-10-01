'use strict';

/* Services */


angular.module('myApp.services', ['ngResource'])
  .value('version', '0.1')
  .factory('MessageService', ['$resource',
    function ($resource) {
      return {
        getAll: function (params, callback) {
          return $resource('http://localhost/AngularFV/services/Messages.svc/GetMessages')
            .get(params)
            .$promise
            .then(function (r) {
              callback(r.d);
            });
        },
        sendMessage: function (params) {
          return $resource('http://localhost/AngularFV/services/Messages.svc/SendMessage')
            .get(params);
        }
      };
    }])
  .factory('AssetGroupService', ['$resource',
    function ($resource) {
      return {
        getAll: function (callback) {
          return $resource('http://localhost/AngularFV/services/Messages.svc/GetAssetGroups')
            .get()
            .$promise
            .then(function (r) {
              callback(r.d);
            });
        }
      };
    }]);
