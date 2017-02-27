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

	ngIntro.factory("ngIntroService", ['$q', function ($q) {
		if (typeof (introJs) !== 'function') {
			throw new IntroJsNotAvailable();
		}

		var intro;
		var notifyList = {};
		
		var service = {
			addListener: addListener,
			removeListener: removeListener,
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
		Object.defineProperty(service, "intro", {
			get: function () {
				return intro;
			},
			enumerable: true,
			configurable: true
		});

		function addListener(name, cb){
			if(angular.isFunction(cb))
				notifyList[name] = cb;
		}
		function removeListener(name){
			delete notifyList[name];
			
		}
		function setOptions(options) {
			intro.setOptions(options);
		}

		function start(step) {
			if (typeof (step) === 'number') {
				intro.start().goToStep(step);
			} else {
				intro.start();
			}
			notifyListeners('open');
		}
		function notifyListeners(newSts){
			for(var key in notifyList){
				if(notifyList.hasOwnProperty(key)){
					if(angular.isFunction(notifyList[key]))
						notifyList[key](newSts);
				}
				
			}
		}
		function exit() {
			intro.exit();
			notifyListeners('closed');
		}

		function previous() {
			intro.previousStep();
			notifyListeners('open');
		}

		function next() {
			intro.nextStep();
			notifyListeners('open');
		}

		function refresh() {
			intro.refresh();
		}

		function onComplete(cb) {
			return intro.oncomplete(function () {
				if(angular.isFunction(cb)) cb();
				notifyListeners('closed');
			});
		}

		function onBeforeChange(cb) {
			return intro.onbeforechange(function (targetElement) {
				if(angular.isFunction(cb)) cb(targetElement);
			});
		}

		function onChange(cb) {
			return intro.onchange(function(targetElement) {
				if(angular.isFunction(cb)) cb(targetElement);
			});
			
		}
		
		function clear(cb){
			if(typeof(intro) !=='undefined')
				intro.exit();
			
			intro = new introJs();
			
			notifyListeners('closed');
			
			if(angular.isFunction(cb)) cb();
			
			return intro;
		}

		function onAfterChange(cb) {
			return intro.onafterchange(function (targetElement) {
				if(angular.isFunction(cb)) cb(targetElement);
			});
		}

		function onExit(cb) {
			return intro.onexit(function () {
				notifyListeners('closed');
				if(angular.isFunction(cb)) cb();
			});
		}
		
		function addHints(){
			return intro.addHints();
		}

		function showHints(){
			return intro.showHints();
		}
		function hideHint(step){
			return intro.hideHint(step);
		}
		function hideHints(){
			return intro.hideHints();
		}

		function onHintClick(cb){
			intro.onhintclick(function () {
				if(angular.isFunction(cb)) cb();
			});
		}
		
		function onHintClose(cb){			
			return intro.onhintclose(function () {
				if(angular.isFunction(cb)) cb();
			});
		}
		
		function onHintsAdded(cb){			
			return intro.onhintclose(function () {
				if(angular.isFunction(cb)) cb();
			});
		}
		
		clear();
		
		return service;

	}]).directive('ngIntroDisableButton',['ngIntroService','$compile', function(ngIntroService, $compile){
		var id = 0;
		return{ 
			restrict:'A',
			priority: 1,
			scope:{
				introDisableButton: '='
			},
			link: function (scope, elm, attrs) {
				var uniqueId = "disabledBtn"+id++;
				 ngIntroService.addListener(uniqueId, function(value){
					if (value === 'open') {
						attrs.$set('disabled', 'disabled');
					} else {
						delete attrs.disabled;
						elm.removeAttr('disabled');
					}
				});

				scope.$on('$destroy', function(){
					ngIntroService.removeListener(uniqueId);
				});
				
			}
		};
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
					ngIntro.onComplete(scope.ngIntroOncomplete);
				}

				if (scope.ngIntroOnexit) {
					ngIntro.onExit(scope.ngIntroOnexit);
				}

				if (scope.ngIntroOnbeforechange) {
					ngIntro.onBeforeChange(scope.ngIntroOnbeforechange);
				}

				if (scope.ngIntroOnchange) {
					ngIntro.onChange(scope.ngIntroOnchange);
				}

				if (scope.ngIntroOnafterchange) {
					ngIntro.onAfterChange(scope.ngIntroOnafterchange);
				}
 
				scope.ngIntroMethod = function (step) {
					ngIntro.setOptions(scope.ngIntroOptions);
					ngIntro.start(step);
				};

                scope.ngIntroHintsMethod = function() {
					ngIntro.setOptions(scope.ngIntroOptions);
					ngIntro.start(step);

                    if(scope.ngIntroOnhintsadded) {
						ngIntro.onHintsAdded(scope.ngIntroOnbeforechange);
                    }

                    if(scope.ngIntroOnhintclick) {
						ngIntro.onHintClick(scope.ngIntroOnbeforechange);
                    }
                    
                    if(scope.ngIntroOnhintclose) {
						ngIntro.onHintClick(scope.ngIntroOnbeforechange);
                    }
                    
                    intro.addHints();
                };
                
                scope.ngIntroShowHint = function(id) {
                    ngIntro.showHint(id);
                };

                scope.ngIntroShowHints = function() {
                    ngIntro.showHints();
                };

                scope.ngIntroHideHint = function(id) {
                    ngIntro.hideHint(id);
                };

                scope.ngIntroHideHints = function() {
                    ngIntro.hideHints();
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