var ngIntroDirective = angular.module('angular-intro', []);


ngIntroDirective.directive('ngIntroOptions', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',
        scope: {
            ngIntroMethod: "=",
            ngIntroExitMethod: "=",
            ngIntroOptions: '=',
            ngIntroOncomplete: '=',
            ngIntroOnexit: '=',
            ngIntroOnchange: '=',
            ngIntroOnbeforechange: '=',
            ngIntroOnafterchange: '=',
            ngIntroAutostart: '&',
            ngIntroAutorefresh: '='
        },
        link: function(scope, element, attrs) {

            var intro;

            scope.ngIntroMethod = function(step) {

                
                var navigationWatch = scope.$on('$locationChangeStart', function(){
                  intro.exit();
                });

                if (typeof(step) === 'string') {
                    intro = introJs(step);

                } else {
                    intro = introJs();
                }

                intro.setOptions(scope.ngIntroOptions);
                
                if (scope.ngIntroAutorefresh) {
                  scope.$watch(function(){
                    intro.refresh();
                  });
                }
                
                if (scope.ngIntroOncomplete) {
                    intro.oncomplete(function() {
                        $timeout(scope.ngIntroOncomplete.bind(this, scope));
                        navigationWatch();
                    });
                }

                if (scope.ngIntroOnexit) {
                    intro.onexit(function() {
                        $timeout(scope.ngIntroOnexit.bind(this, scope));
                        navigationWatch();
                    });
                }

                if (scope.ngIntroOnchange) {
                    intro.onchange(function(targetElement){
                       $timeout(scope.ngIntroOnchange.bind(this, targetElement, scope));
                    });
                }

                if (scope.ngIntroOnbeforechange) {
                    intro.onbeforechange(function(targetElement) {
                        $timeout(scope.ngIntroOnbeforechange.bind(this, targetElement, scope));
                    });
                }

                if (scope.ngIntroOnafterchange) {
                    intro.onafterchange(function(targetElement){
                        $timeout(scope.ngIntroOnafterchange.bind(this, targetElement, scope));
                    });
                }

                if (typeof(step) === 'number') {
                    intro.goToStep(step).start();
                } else {
                    intro.start();
                }
            };

            scope.ngIntroExitMethod = function (callback) {
                intro.exit();
                callback();
            }

            if (scope.ngIntroAutostart()) {
                $timeout(function() {
                    scope.ngIntroMethod();
                });
            }
        }
    };
}]);