namespace ngIntroJs {
	export interface INgIntroService {
		intro: IntroJs.IntroJs,
		addListener(name: string, callback: Function): void
		removeListener(name: string): void
		setOptions: IntroJs.Options,
		start(stepId?: number): IntroJs.IntroJs,
		exit(): IntroJs.IntroJs,
		clear(callback: Function): IntroJs.IntroJs,

		addHints(): IntroJs.IntroJs,
		showHint(hintIdx: number): IntroJs.IntroJs,
		showHints(): IntroJs.IntroJs,
		hideHint(hintIdx: number): IntroJs.IntroJs,
		hideHints(): IntroJs.IntroJs

		previous(): IntroJs.IntroJs,
		next(): IntroJs.IntroJs,

		refresh(): IntroJs.IntroJs,

		onComplete(callback: Function): void
		onExit(callback: Function): void
		onBeforeChange(callback: Function): void
		onAfterChange(callback: Function): void
		onChange(callback: Function): void
		onHintClick(callback: Function): void
		onHintClose(callback: Function): void
		onHintsAdded(callback: Function): void
	}
	export interface INgIntroDirectiveScope extends ng.IScope {
		ngIntroMethod(step?: number): void
		ngIntroExitMethod(cb?: Function): void
		ngIntroNextMethod(): void
		ngIntroPreviousMethod(): void
		ngIntroRefreshMethod(): void
		ngIntroOptions(): void
		ngIntroOncomplete(): void
		ngIntroOnexit(): void
		ngIntroOnchange(): void
		ngIntroOnbeforechange(): void
		ngIntroOnafterchange(): void
		ngIntroAutostart(): void
		ngIntroAutorefresh(): void

		ngIntroHintsMethod(): void
		ngIntroOnhintsadded(): void
		ngIntroOnhintclick(): void
		ngIntroOnhintclose(): void
		ngIntroShowHint(id: number): void
		ngIntroShowHints(): void
		ngIntroHideHint(id: number): void
		ngIntroHideHints(): void
	}
	export interface NotifyItem {
		[name: string]: Function
	}
}
(function (root, factory) {
	// this is our custom loader
	if (typeof (<any>window).define === "function" && (<any>window).define.amd) {
		(<any>window).define(["angular", "intro.js"], factory);
	} else if (typeof (<any>window).exports === "object") {
		(<any>window).module.exports = factory((<any>window).require("angular"), (<any>window).require("intro.js"));
	} else {
		root.angularIntroJs = factory(root.angular, root.introJs);
	}
}(this, function (angular: ng.IAngularStatic, introJs: IntroJs.Factory) {

	let introStatus = { // i wanted to use enums, but for now it"ll work
		open: "open",
		closed: "closed"
	}
	let moduleName = "angular-intro";


	let notifyList: ngIntroJs.NotifyItem = {} // this is an objects that holds the current listeners.
	///when the intro opens or closes it"ll iterate through this list calling the callback;

	class NgIntroService implements ngIntroJs.INgIntroService {
		public intro: IntroJs.IntroJs
		// static $inject =  []

		constructor() {
			this.intro = introJs();
		}

		/// adds into notifyList, if there"s a valid callback.
		addListener(name: string, cb: Function) {
			if (angular.isFunction(cb))
				notifyList[name] = cb;
		}
		// remove from notifyList.
		removeListener(name: string) {
			delete notifyList[name];
		}

		///iterate through notifyList and call each callback.
		private notifyListeners(status: string) {
			for (let key in notifyList) {
				if (notifyList.hasOwnProperty(key)) {
					if (angular.isFunction(notifyList[key]))
						notifyList[key](status);
				}
			}
		}

		setOptions(options: IntroJs.Options) {
			return this.intro.setOptions(options);
		}

		start(step?: number) {
			if (typeof (step) === "number") {
				this.intro.start().goToStep(step);
			} else {
				this.intro.start();
			}
			this.notifyListeners(introStatus.open);

			return this.intro;
		}

		exit() {
			this.notifyListeners(introStatus.closed);
			return this.intro.exit();
		}

		clear(cb: Function) {
			if (typeof (this.intro) !== "undefined")
				this.intro.exit();

			this.intro = introJs();

			this.notifyListeners(introStatus.closed);

			if (angular.isFunction(cb)) cb();

			return this.intro;
		}

		addHints() {
			return this.intro.addHints();
		}
		showHint(hintIndex: number) {
			return this.intro.showHint(hintIndex);
		}
		showHints() {
			return this.intro.showHints();
		}

		hideHint(hintIndex: number) {
			return this.intro.hideHint(hintIndex);
		}

		hideHints() {
			return this.intro.hideHints();
		}

		previous() {
			this.notifyListeners(introStatus.open);
			return this.intro.previousStep();
		}
		next() {
			this.notifyListeners(introStatus.open);
			return this.intro.nextStep();

		}

		refresh() {
			return this.intro.refresh();
		}

		onComplete(cb: Function) {
			return this.intro.oncomplete(() => {
				if (angular.isFunction(cb)) cb();
				this.notifyListeners(introStatus.closed);
			});
		}
		onExit(cb: Function) {
			return this.intro.onexit(() => {
				this.notifyListeners(introStatus.closed);
				if (angular.isFunction(cb)) cb();
			});
		}
		onBeforeChange(cb: Function) {
			return this.intro.onbeforechange((targetElement) => {
				if (angular.isFunction(cb)) cb(targetElement);
			});
		}
		onChange(cb: Function) {
			return this.intro.onchange((targetElement) => {
				if (angular.isFunction(cb)) cb(targetElement);
			});
		}
		onAfterChange(cb: Function) {
			return this.intro.onafterchange((targetElement) => {
				if (angular.isFunction(cb)) cb(targetElement);
			});
		}

		onHintClick(cb: Function) {
			return this.intro.onhintclick(() => {
				if (angular.isFunction(cb)) cb();
			});
		}

		onHintClose(cb: Function) {
			return this.intro.onhintclose(() => {
				if (angular.isFunction(cb)) cb();
			});
		}
		onHintsAdded(cb: Function) {
			return this.intro.onhintclose(() => {
				if (angular.isFunction(cb)) cb();
			});
		}

	}

	class NgIntroDirective implements ng.IDirective {
		public restrict = "A";
		public link: (scope: ngIntroJs.INgIntroDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
		public scope = {
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
		destroy: any = []

		static factory(): ng.IDirectiveFactory {
			const directive = (introService: NgIntroService, $timeout: ng.ITimeoutService) => new NgIntroDirective(introService, $timeout);
			directive.$inject = ["ngIntroService", "$timeout"];
			return directive;
		}
		constructor(introService: NgIntroService, $timeout: ng.ITimeoutService) {
			this.link = (scope: ngIntroJs.INgIntroDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
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

				scope.ngIntroMethod = (step) => {
					introService.setOptions(scope.ngIntroOptions);
					introService.start(step);
				};

				scope.ngIntroHintsMethod = (step?: number) => {
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

				scope.ngIntroShowHint = (id) => {
					introService.showHint(id);
				};

				scope.ngIntroShowHints = () => {
					introService.showHints();
				};

				scope.ngIntroHideHint = (id) => {
					introService.hideHint(id);
				};

				scope.ngIntroHideHints = () => {
					introService.hideHints();
				};

				scope.ngIntroNextMethod = () => {
					introService.next();
				};

				scope.ngIntroPreviousMethod = () => {
					introService.previous();
				};

				scope.ngIntroExitMethod = (callback) => {
					introService.exit();
					if (angular.isFunction(callback)) callback();
				};

				scope.ngIntroRefreshMethod = () => {
					introService.refresh();
				};

				let autoStartWatch = scope.$watch("ngIntroAutostart", () => {
					if (scope.ngIntroAutostart) {
						$timeout(() => {
							scope.ngIntroMethod();
						});
					}
					autoStartWatch();
				});

				this.destroy.push(scope.$on("$locationChangeStart", () => {
					introService.exit();
				}));

				this.destroy.push(scope.$on("$locationChangeSuccess", () => {
					introService.exit();
				}));

				if (scope.ngIntroAutorefresh) {
					this.destroy.push(scope.$watch(() => {
						introService.refresh();
					}));
				}

				this.destroy.push(scope.$on("$destroy", () => {
					introService.exit();
				}));

				scope.$on("$destroy", () => {
					clearWatches();
				});

				function clearWatches() {
					for (let d of this.destroy)
						d();
				}
			};
		}
	}

	angular.module(moduleName, [])
		.service("ngIntroService", NgIntroService)

		// 1st way to create the directive using typescript.
		.directive("ngIntroOptions", NgIntroDirective.factory())

		/// this is another
		.directive("ngIntroDisableButton", ["ngIntroService", function (ngIntroService) {
			let id = 0;
			return <ng.IDirective>{
				restrict: "A",
				priority: 1,
				link: function (scope, elm, attrs) {
					let uniqueId = "disabledBtn" + id++;
					ngIntroService.addListener(uniqueId, function (value: string) {
						if (value === introStatus.open) {
							attrs.$set("disabled", "disabled");
						} else {
							delete attrs.disabled;
							elm.removeAttr("disabled");
						}
					});

					scope.$on("$destroy", function () {
						ngIntroService.removeListener(uniqueId);
					});

				}
			};
		}]);
}))