(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(["angular", "intro.js"], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('angular'), require('intro.js'));
	} else {
		root.angularIntroJs = factory(root.angular, root.introJs);
	}
}(this, function (angular, introJs) {
	if (typeof introJs == 'object')
		introJs = introJs.introJs;

	var ngIntro = angular.module('angular-intro', []);

	function IntroJsNotAvailable() {
		this.message = 'Intro.js is not available. Make sure it is properly loaded.';
		this.name = 'IntroJsNotAvailable';
	}

	ngIntro.factory("ngIntroService", ['$rootScope', '$q', function ($rootScope, $q) {
		if (typeof (introJs) !== 'function') {
			throw new IntroJsNotAvailable();
		}

		var intro;
		
		var deferList = [];
		var service = {
			introObject: intro,

			setOptions: setOptions,
			start: start,
			exit: exit,
			clear: clear,

			previous: previous,
			next: next,

			refresh: refresh,


			onComplete: onComplete,
			onExit: onExit,
			onBeforeChange: onBeforeChange,
			onAfterChange: onAfterChange,
			onChange: onChange,

			addHints: addHints,
			showHints: showHints,
			hideHint: hideHint,
			hideHints:hideHints,

			onHintClick: onHintClick,
			onHintClose: onHintClose,
			onHintsAdded: onHintsAdded,
		};

		function setOptions(options) {
			intro.setOptions(options);
		}

		function start(step) {
			if (typeof (step) === 'number') {
				intro.start().goToStep(step);
			} else {
				intro.start();
			}
		}

		function exit() {
			intro.exit();
		}

		function previous() {
			intro.previousStep();
		}

		function next() {
			intro.nextStep();
		}

		function refresh() {
			intro.refresh();
		}

		function onComplete() {
			var q = $q.defer();
			deferList.push(q);
			
			intro.oncomplete(function () {
				$rootScope.$broadcast('ngIntro-onComplete');
				q.resolve();
			});
			
			return q.promise;
		}

		function onBeforeChange() {
			var q = $q.defer();
			deferList.push(q);
			
			intro.onbeforechange(function (targetElement) {
				$rootScope.$broadcast('ngIntro-onBeforeChange');
			});
			
			return q.promise;
		}

		function onChange() {
			var q = $q.defer();
			deferList.push(q);
			
			intro.onchange(function (targetElement) {
				$rootScope.$broadcast('ngIntro-onChange');
				q.resolve();
			});
			return q.promise;
		}
		
		function clear(){
			if(typeof(intro) !=='undefined')
				intro.exit();
			for(var i = 0; i< deferList.length; i++){
				deferList[i].reject();
			}	
			deferList = [];
			
			intro = new introJs();
		}

		function onAfterChange() {
			var q = $q.defer();
			deferList.push(q);
			
			intro.onafterchange(function (targetElement) {
				$rootScope.$broadcast('ngIntro-onAfterChange');
				q.resolve();
			});
			return q.promise;
		}

		function onExit(callback) {
			var q = $q.defer();
			deferList.push(q);
			
			intro.onexit(function () {
				$rootScope.$broadcast('ngIntro-onExit');
				q.resolve();
			});
			return q.promise;
		}
		
		function addHints(){
			intro.addHints();
		}

		function showHints(){
			intro.showHints();
		}
		function hideHint(step){
			intro.hideHint(step);
		}
		function hideHints(){
			intro.hideHints();
		}

		function onHintClick(){
			var q = $q.defer();
			deferList.push(q);
			
			intro.onhintclick(function () {
				$rootScope.$broadcast('ngIntro-onHintClick');
				q.resolve();
			});
			return q.promise;
		}
		
		function onHintClose(){
			var q = $q.defer();
			deferList.push(q);
			
			intro.onhintclose(function () {
				$rootScope.$broadcast('ngIntro-onHintClose');
				q.resolve();
			});
			return q.promise;
		}
		
		function onHintsAdded(){
			var q = $q.defer();
			deferList.push(q);
			
			intro.onhintclose(function () {
				$rootScope.$broadcast('ngIntro-onHintsAdded');
				q.resolve();
			});
			return q.promise;
		}
		
		clear();
		
		return service;

	}]).directive('ngIntroOptions', ['$timeout', 'ngIntroService', function ($timeout, ngIntro) {
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
				ngIntroAutorefresh: '=',

				ngIntroHintsMethod: "=?",
                ngIntroOnhintsadded: "=",
                ngIntroOnhintclick: "=?",
                ngIntroOnhintclose: "=?",
                ngIntroShowHint: "=?",
                ngIntroShowHints: "=?",
                ngIntroHideHint: "=?",
                ngIntroHideHints: "=?"
			},
			link: function (scope, element, attrs) {

				var destroy = [];

				if (scope.ngIntroOncomplete) {
					scope.$on('ngIntro-onComplete', function () {
						scope.ngIntroOncomplete.call(this, scope);
						$timeout(function () { scope.$digest(); });
						clearWatches();
					});
				}

				if (scope.ngIntroOnexit) {
					scope.$on('ngIntro-onExit', function () {
						scope.ngIntroOnexit.call(this, scope);
						$timeout(function () { scope.$digest(); });
						clearWatches();
					});
				}

				if (scope.ngIntroOnbeforechange) {
					scope.$on('ngIntro-onBeforeChange', function () {
						scope.ngIntroOnbeforechange.call(this, targetElement, scope);
						$timeout(function () { scope.$digest(); });
					});
				}

				if (scope.ngIntroOnchange) {
					scope.$on('ngIntro-onChange', function () {
						scope.ngIntroOnchange.call(this, targetElement, scope);
						$timeout(function () { scope.$digest(); });
					});
				}

				if (scope.ngIntroOnafterchange) {
					scope.$on('ngIntro-onAfterChange', function () {
						scope.ngIntroOnafterchange.call(this, targetElement, scope);
						$timeout(function () { scope.$digest(); });
					});
				}
 
				scope.ngIntroMethod = function (step) {
					ngIntro.setOptions(scope.ngIntroOptions);
					ngIntro.start(step);
				};

                scope.ngIntroHintsMethod = function() {
					
					ngIntro.setOptions(scope.ngIntroOptions);
					ngIntro.start(step);

                    if(scope.ngIntroOnhintsadded) {
						scope.$on('ngIntro-onHintsAdded', function () {
							scope.ngIntroOnhintsadded.call(this, targetElement, scope);
							$timeout(function () { scope.$digest(); });
						});
                    }

                    if(scope.ngIntroOnhintclick) {
                       	scope.$on('ngIntro-onHintClick', function () {
							scope.ngIntroOnhintclick.call(this, targetElement, scope);
							$timeout(function () { scope.$digest(); });
						});
                    }
                    
                    if(scope.ngIntroOnhintclose) {
						scope.$on('ngIntro-onHintClose', function () {
							scope.ngIntroOnhintclose.call(this, targetElement, scope);
							$timeout(function () { scope.$digest(); });
						});
                    }
                    
                    intro.addHints();
                };
                
                scope.ngIntroShowHint = function(id) {
                    intro.showHint(id);
                };

                scope.ngIntroShowHints = function() {
                    intro.showHints();
                };

                scope.ngIntroHideHint = function(id) {
                    intro.hideHint(id);
                };

                scope.ngIntroHideHints = function() {
                    intro.hideHints();
                };

				scope.ngIntroNextMethod = function () {
					ngIntro.next();
				};

				scope.ngIntroPreviousMethod = function () {
					ngIntro.previous();
				};

				scope.ngIntroExitMethod = function (callback) {
					ngIntro.exit();
					if (angular.isFunction(callback)) callback();
				};

				scope.ngIntroRefreshMethod = function () {
					ngIntro.refresh();
				};

				var autoStartWatch = scope.$watch('ngIntroAutostart', function () {
					if (scope.ngIntroAutostart) {
						$timeout(function () {
							scope.ngIntroMethod();
						});
					}
					autoStartWatch();
				});

				destroy.push(scope.$on('$locationChangeStart', function(){
				  ngIntro.exit();
				}));
				
				destroy.push(scope.$on('$locationChangeSuccess', function () {
					ngIntro.exit();
				}));

				if (scope.ngIntroAutorefresh) {
					destroy.push(scope.$watch(function () {
						ngIntro.refresh();
					}));
				}

				destroy.push(scope.$on('$destroy', function () {
					ngIntro.exit();
				}));

				scope.$on('$destroy', function () {
					clearWatches();
				});

				function clearWatches() {
					for (var i = 0; i > destroy.length; i++) {
						destroy[i]();
					}
				}
			}
		};
	}]);
	return ngIntro;
}));

