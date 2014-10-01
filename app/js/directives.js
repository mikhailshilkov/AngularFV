'use strict';

/* Directives */


angular.module('myApp.directives', [])
  .directive('appVersion', ['version', function (version) {
    return function (scope, elm, attrs) {
      elm.text(version);
    }
  }])
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  })
  .directive('ngArrowDown', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 40) {
          scope.$apply(function () {
            scope.$eval(attrs.ngArrowDown);
          });

          event.preventDefault();
        }
      });
    };
  })
  .directive('ngArrowUp', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 38) {
          scope.$apply(function () {
            scope.$eval(attrs.ngArrowUp);
          });

          event.preventDefault();
        }
      });
    };
  })
  .directive('contenteditable', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        // view -> model
        element.bind('blur', function () {
          scope.$apply(function () {
            ctrl.$setViewValue(element.html());
          });
        });

        // model -> view
        ctrl.$render = function () {
          element.html(ctrl.$viewValue);
        };
      }
    };
  })
  .directive('focusMe', function ($timeout) {
    return {
      link: function (scope, element, attrs) {
        scope.$watch(attrs.focusMe, function (value) {
          if (value === true) {
            console.log('value=', value);
            //$timeout(function() {
            element[0].focus();
            scope[attrs.focusMe] = false;
            //});
          }
        });
      }
    };
  })
  .directive('fvMessagePreview', function () {
    return {
      restrict: 'AE',
      scope: {
        message: '=message'
      },
      templateUrl: 'partials/messagepreview.html'
    };
  })
  .directive('fvNewMessage', function () {
    return {
      restrict: 'AE',
      scope: {
        focused: '='
      },
      controller: 'NewMessageCtrl',
      templateUrl: 'partials/newmessage.html'
    };
  })
  .directive('fvAssetSelector', function () {
    return {
      restrict: 'AE',
      scope: true,
      templateUrl: 'partials/assetselector.html'
    };
  });



(function (angular) {
  'use strict';

  angular.module('angularTreeview', []).directive('treeModel', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        //tree id
        var treeId = attrs.treeId;

        //tree model
        var treeModel = attrs.treeModel;

        //node id
        var nodeId = attrs.nodeId || 'id';

        //node label
        var nodeLabel = attrs.nodeLabel || 'label';

        //children
        var nodeChildren = attrs.nodeChildren || 'children';

        //tree template
        var template =
          '<ul>' +
            '<li data-ng-repeat="node in ' + treeModel + '">' +
              '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && !node.expanded" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
              '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && node.expanded" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
              '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
              '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
              '<div data-ng-show="node.expanded" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
            '</li>' +
          '</ul>';


        //check tree id, tree model
        if (treeId && treeModel) {

          //root node
          if (attrs.angularTreeview) {

            //create tree object if not exists
            scope[treeId] = scope[treeId] || {};

            //if node head clicks,
            scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function (selectedNode) {

              //Collapse or Expand
              selectedNode.expanded = !selectedNode.expanded;
            };

            //if node label clicks,
            scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function (selectedNode) {

              //remove highlight from previous node
              if (scope[treeId].currentNode && scope[treeId].currentNode.selected) {
                scope[treeId].currentNode.selected = undefined;
              }

              //set highlight to selected node
              selectedNode.selected = 'selected';

              //set currentNode
              scope[treeId].currentNode = selectedNode;
            };
          }

          //Rendering template.
          element.html('').append($compile(template)(scope));
        }
      }
    };
  }]);
})(angular);
