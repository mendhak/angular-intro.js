angular-intro.js
================

An angularjs directive that wraps [intro.js](http://usablica.github.io/intro.js/) functionality.

![angularintro](http://farm8.staticflickr.com/7382/9741892196_ccc16b8a16_o.png)

See [the project page](http://code.mendhak.com/angular-intro.js/) for an overview.


## Details

The two main directives are `ng-intro-options` and `ng-intro-method`.

`ng-intro-options` needs to point at a `$scope` object which contains the intro.js options. The options are exactly the same as [the original](https://github.com/usablica/intro.js#options).  This also allows you to modify the options as part of your controller behavior if necessary.

`ng-intro-method` is a method name that you want to use later.  In other words, put any name in there that doesn't exist on the `$scope` already.  The directive will create a method with that name so that you can call it yourself later.

For example, if you set `ng-intro-method="CallMe"`, then you can later call `ng-click="CallMe();"` as long as you are still in the same controller scope.  You can also specify a step number in the method call, `CallMe(3);`.

There are also directives that link to the intro.js callbacks, namely `ng-intro-oncomplete`, `ng-intro-onexit`, `ng-intro-onchange` and `ng-intro-onbeforechange`.


## License

As with intro.js, this is under the [MIT license](https://github.com/mendhak/angular-intro.js/blob/master/LICENSE).






