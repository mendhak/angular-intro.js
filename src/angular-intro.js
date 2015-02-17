var ngIntroDirective = angular.module('angular-intro', []);


ngIntroDirective.directive('ngIntroOptions', ['$timeout', function ($timeout) {

    return {
        restrict: 'A',
        scope: {
            ngIntroMethod: "=",
            ngIntroExitMethod: "=?",
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
                        scope.ngIntroOncomplete.call(this, scope);
                        $timeout(function() {scope.$digest()});
                        navigationWatch();
                    });
                }

                if (scope.ngIntroOnexit) {
                    intro.onexit(function() {
                        scope.ngIntroOnexit.call(this, scope);
                        $timeout(function() {scope.$digest()});
                        navigationWatch();
                    });
                }

                if (scope.ngIntroOnchange) {
                    intro.onchange(function(targetElement){
                        scope.ngIntroOnchange.call(this, targetElement, scope);
                        $timeout(function() {scope.$digest()});
                    });
                }

                if (scope.ngIntroOnbeforechange) {
                    intro.onbeforechange(function(targetElement) {
                        scope.ngIntroOnbeforechange.call(this, targetElement, scope);
                        $timeout(function() {scope.$digest()});
                    });
                }

                if (scope.ngIntroOnafterchange) {
                    intro.onafterchange(function(targetElement){
                        scope.ngIntroOnafterchange.call(this, targetElement, scope);
                        $timeout(function() {scope.$digest()});
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
            };

            if (scope.ngIntroAutostart()) {
                $timeout(function() {
                    scope.ngIntroMethod();
                });
            }
        }
    };
}]);
