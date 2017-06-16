/*! angular-intro.js - v4.0.0 - 2017-06-16 */

(function(root, factory) {
    if (typeof window.define === "function" && window.define.amd) {
        window.define([ "angular", "introJs" ], factory);
    } else if (typeof window.exports === "object") {
        window.module.exports = factory(window.require("angular"), window.require("introJs"));
    } else {
        root.angularIntroJs = factory(root.angular, root.introJs);
    }
})(this, function(angular, introJs) {
    var introStatus = {
        open: "open",
        closed: "closed"
    };
    var moduleName = "angular-intro";
    var notifyList = {};
    var NgIntroService = function() {
        function NgIntroService() {
            this.intro = introJs();
        }
        NgIntroService.prototype.addListener = function(name, cb) {
            if (angular.isFunction(cb)) notifyList[name] = cb;
        };
        NgIntroService.prototype.removeListener = function(name) {
            delete notifyList[name];
        };
        NgIntroService.prototype.notifyListeners = function(status) {
            for (var key in notifyList) {
                if (notifyList.hasOwnProperty(key)) {
                    if (angular.isFunction(notifyList[key])) notifyList[key](status);
                }
            }
        };
        NgIntroService.prototype.setOptions = function(options) {
            return this.intro.setOptions(options);
        };
        NgIntroService.prototype.start = function(step) {
            if (typeof step === "number") {
                this.intro.start().goToStep(step);
            } else {
                this.intro.start();
            }
            this.notifyListeners(introStatus.open);
            return this.intro;
        };
        NgIntroService.prototype.exit = function() {
            this.notifyListeners(introStatus.closed);
            return this.intro.exit();
        };
        NgIntroService.prototype.clear = function(cb) {
            if (typeof this.intro !== "undefined") this.intro.exit();
            this.intro = introJs();
            this.notifyListeners(introStatus.closed);
            if (angular.isFunction(cb)) cb();
            return this.intro;
        };
        NgIntroService.prototype.goToStepNumber = function(stepId) {
            return this.intro.goToStepNumber(stepId);
        };
        NgIntroService.prototype.addHints = function() {
            return this.intro.addHints();
        };
        NgIntroService.prototype.showHint = function(hintIndex) {
            return this.intro.showHint(hintIndex);
        };
        NgIntroService.prototype.showHints = function() {
            return this.intro.showHints();
        };
        NgIntroService.prototype.hideHint = function(hintIndex) {
            return this.intro.hideHint(hintIndex);
        };
        NgIntroService.prototype.hideHints = function() {
            return this.intro.hideHints();
        };
        NgIntroService.prototype.removeHint = function(stepId) {
            return this.intro.removeHint(stepId);
        };
        NgIntroService.prototype.removeHints = function() {
            return this.intro.removeHints();
        };
        NgIntroService.prototype.previous = function() {
            this.notifyListeners(introStatus.open);
            return this.intro.previousStep();
        };
        NgIntroService.prototype.next = function() {
            this.notifyListeners(introStatus.open);
            return this.intro.nextStep();
        };
        NgIntroService.prototype.refresh = function() {
            return this.intro.refresh();
        };
        NgIntroService.prototype.onComplete = function(cb) {
            var _this = this;
            return this.intro.oncomplete(function() {
                if (angular.isFunction(cb)) cb();
                _this.notifyListeners(introStatus.closed);
            });
        };
        NgIntroService.prototype.onExit = function(cb) {
            var _this = this;
            return this.intro.onexit(function() {
                _this.notifyListeners(introStatus.closed);
                if (angular.isFunction(cb)) cb();
            });
        };
        NgIntroService.prototype.onBeforeChange = function(cb) {
            return this.intro.onbeforechange(function(targetElement) {
                if (angular.isFunction(cb)) cb(targetElement);
            });
        };
        NgIntroService.prototype.onChange = function(cb) {
            return this.intro.onchange(function(targetElement) {
                if (angular.isFunction(cb)) cb(targetElement);
            });
        };
        NgIntroService.prototype.onAfterChange = function(cb) {
            return this.intro.onafterchange(function(targetElement) {
                if (angular.isFunction(cb)) cb(targetElement);
            });
        };
        NgIntroService.prototype.onHintClick = function(cb) {
            return this.intro.onhintclick(function() {
                if (angular.isFunction(cb)) cb();
            });
        };
        NgIntroService.prototype.onHintClose = function(cb) {
            return this.intro.onhintclose(function() {
                if (angular.isFunction(cb)) cb();
            });
        };
        NgIntroService.prototype.onHintsAdded = function(cb) {
            return this.intro.onhintclose(function() {
                if (angular.isFunction(cb)) cb();
            });
        };
        return NgIntroService;
    }();
    var NgIntroDirective = function() {
        function NgIntroDirective(introService, $timeout) {
            var _this = this;
            this.restrict = "A";
            this.scope = {
                ngIntroMethod: "=",
                ngIntroExitMethod: "=?",
                ngIntroNextMethod: "=?",
                ngIntroPreviousMethod: "=?",
                ngIntroRefreshMethod: "=?",
                ngIntroOptions: "=",
                ngIntroOncomplete: "=",
                ngIntroOnexit: "=",
                ngIntroOnchange: "=",
                ngIntroOnbeforechange: "=",
                ngIntroOnafterchange: "=",
                ngIntroAutostart: "=",
                ngIntroAutorefresh: "=",
                ngIntroHintsMethod: "=?",
                ngIntroOnhintsadded: "=",
                ngIntroOnhintclick: "=?",
                ngIntroOnhintclose: "=?",
                ngIntroShowHint: "=?",
                ngIntroShowHints: "=?",
                ngIntroHideHint: "=?",
                ngIntroHideHints: "=?"
            };
            this.destroy = [];
            this.link = function(scope, element, attrs) {
                if (scope.ngIntroOncomplete) {
                    introService.onComplete(scope.ngIntroOncomplete);
                }
                if (scope.ngIntroOnexit) {
                    introService.onExit(scope.ngIntroOnexit);
                }
                if (scope.ngIntroOnbeforechange) {
                    introService.onBeforeChange(scope.ngIntroOnbeforechange);
                }
                if (scope.ngIntroOnchange) {
                    introService.onChange(scope.ngIntroOnchange);
                }
                if (scope.ngIntroOnafterchange) {
                    introService.onAfterChange(scope.ngIntroOnafterchange);
                }
                scope.ngIntroMethod = function(step) {
                    introService.setOptions(scope.ngIntroOptions);
                    introService.start(step);
                };
                scope.ngIntroHintsMethod = function(step) {
                    introService.setOptions(scope.ngIntroOptions);
                    introService.start(step);
                    if (scope.ngIntroOnhintsadded) {
                        introService.onHintsAdded(scope.ngIntroOnbeforechange);
                    }
                    if (scope.ngIntroOnhintclick) {
                        introService.onHintClick(scope.ngIntroOnbeforechange);
                    }
                    if (scope.ngIntroOnhintclose) {
                        introService.onHintClick(scope.ngIntroOnbeforechange);
                    }
                    introService.addHints();
                };
                scope.ngIntroShowHint = function(id) {
                    introService.showHint(id);
                };
                scope.ngIntroShowHints = function() {
                    introService.showHints();
                };
                scope.ngIntroHideHint = function(id) {
                    introService.hideHint(id);
                };
                scope.ngIntroHideHints = function() {
                    introService.hideHints();
                };
                scope.ngIntroNextMethod = function() {
                    introService.next();
                };
                scope.ngIntroPreviousMethod = function() {
                    introService.previous();
                };
                scope.ngIntroExitMethod = function(callback) {
                    introService.exit();
                    if (angular.isFunction(callback)) callback();
                };
                scope.ngIntroRefreshMethod = function() {
                    introService.refresh();
                };
                var autoStartWatch = scope.$watch("ngIntroAutostart", function() {
                    if (scope.ngIntroAutostart) {
                        $timeout(function() {
                            scope.ngIntroMethod();
                        });
                    }
                    autoStartWatch();
                });
                _this.destroy.push(scope.$on("$locationChangeStart", function() {
                    introService.exit();
                }));
                _this.destroy.push(scope.$on("$locationChangeSuccess", function() {
                    introService.exit();
                }));
                if (scope.ngIntroAutorefresh) {
                    _this.destroy.push(scope.$watch(function() {
                        introService.refresh();
                    }));
                }
                _this.destroy.push(scope.$on("$destroy", function() {
                    introService.exit();
                }));
                scope.$on("$destroy", function() {
                    clearWatches();
                });
                var clearWatches = function() {
                    for (var _i = 0, _a = _this.destroy; _i < _a.length; _i++) {
                        var d = _a[_i];
                        d();
                    }
                };
            };
        }
        NgIntroDirective.factory = function() {
            var directive = function(introService, $timeout) {
                return new NgIntroDirective(introService, $timeout);
            };
            directive.$inject = [ "ngIntroService", "$timeout" ];
            return directive;
        };
        return NgIntroDirective;
    }();
    angular.module(moduleName, []).service("ngIntroService", NgIntroService).directive("ngIntroOptions", NgIntroDirective.factory()).directive("ngIntroDisableButton", [ "ngIntroService", function(ngIntroService) {
        var id = 0;
        return {
            restrict: "A",
            priority: 1,
            link: function(scope, elm, attrs) {
                var uniqueId = "disabledBtn" + id++;
                ngIntroService.addListener(uniqueId, function(value) {
                    if (value === introStatus.open) {
                        attrs.$set("disabled", "disabled");
                    } else {
                        delete attrs.disabled;
                        elm.removeAttr("disabled");
                    }
                });
                scope.$on("$destroy", function() {
                    ngIntroService.removeListener(uniqueId);
                });
            }
        };
    } ]);
});
//# sourceMappingURL=angular-intro.js.map