(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["angular", "intro.js"], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('angular'), require('intro.js'));
    } else {
        root.angularIntroJs = factory(root.angular, root.introJs);
    }
}(this, function (angular, introJs) {
    if(typeof introJs == 'object')
        introJs=introJs.introJs;

    var ngIntroDirective = angular.module('angular-intro', []);


    ngIntroDirective.directive('ngIntroOptions', ['$timeout', function ($timeout) {

        return {
            restrict: 'A',
            scope: {
                ngIntroMethod: "=",
                ngIntroExitMethod: "=?",
                ngIntroNextMethod: "=?",
                ngIntroPreviousMethod: "=?",
                ngIntroRefreshMethod: "=?",
                ngIntroOptions: '=',
                ngIntroOncomplete: '=',
                ngIntroOnexit: '=',
                ngIntroOnchange: '=',
                ngIntroOnbeforechange: '=',
                ngIntroOnafterchange: '=',
                ngIntroAutostart: '=',
                ngIntroAutorefresh: '='
            },
            link: function(scope, element, attrs) {

                var intro;
                var refreshWatch;
                var navigationWatch;

                scope.ngIntroMethod = function(step) {


                    navigationWatch = scope.$on('$locationChangeStart', function(){
                      intro.exit();
                    });

                    if (typeof(step) === 'string') {
                        intro = introJs(step);

                    } else {
                        intro = introJs();
                    }

                    intro.setOptions(scope.ngIntroOptions);

                    if (scope.ngIntroAutorefresh) {
                      refreshWatch = scope.$watch(function(){
                        intro.refresh();
                      });
                    }

                    if (scope.ngIntroOncomplete) {
                        intro.oncomplete(function() {
                            scope.ngIntroOncomplete.call(this, scope);
                            $timeout(function() {scope.$digest();});
                            clearWatches();
                        });
                    }

                    if (scope.ngIntroOnexit) {
                        intro.onexit(function() {
                            scope.ngIntroOnexit.call(this, scope);
                            $timeout(function() {scope.$digest();});
                            clearWatches();
                        });
                    }

                    if (scope.ngIntroOnchange) {
                        intro.onchange(function(targetElement){
                            scope.ngIntroOnchange.call(this, targetElement, scope);
                            $timeout(function() {scope.$digest();});
                        });
                    }

                    if (scope.ngIntroOnbeforechange) {
                        intro.onbeforechange(function(targetElement) {
                            scope.ngIntroOnbeforechange.call(this, targetElement, scope);
                            $timeout(function() {scope.$digest();});
                        });
                    }

                    if (scope.ngIntroOnafterchange) {
                        intro.onafterchange(function(targetElement){
                            scope.ngIntroOnafterchange.call(this, targetElement, scope);
                            $timeout(function() {scope.$digest();});
                        });
                    }

                    if (typeof(step) === 'number') {
                        intro.goToStep(step).start();
                    } else {
                        intro.start();
                    }
                };

                scope.ngIntroNextMethod = function () {
                    intro.nextStep();
                };

                scope.ngIntroPreviousMethod = function () {
                    intro.previousStep();
                };

                scope.ngIntroExitMethod = function (callback) {
                    intro.exit();
                    if (typeof callback === 'function'){
                        callback();
                    }
                };

                scope.ngIntroRefreshMethod = function () {
                    intro.refresh();
                };

                var autoStartWatch = scope.$watch('ngIntroAutostart', function () {
                    if(scope.ngIntroAutostart){
                        $timeout(function() {
                            scope.ngIntroMethod();
                        });
                    }
                    autoStartWatch();
                });

                scope.$on('$locationChangeSuccess', function() {
                    if (typeof intro !== 'undefined')
                        intro.exit();
                });

                var clearWatches = function() {
                    if(navigationWatch) navigationWatch();
                    if(refreshWatch) refreshWatch();
                };

                scope.$on('$destroy', function() {
                    clearWatches();
                });
            }
        };
    }]);

    return ngIntroDirective;

}));
