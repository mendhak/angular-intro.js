var ngIntroDirective = angular.module('angular-intro',[]);

// TODO: Use isolate scope, but requires angular 1.2: http://plnkr.co/edit/a2c14O?p=preview
// See: http://stackoverflow.com/questions/18796023/in-a-directive-handle-calls-to-a-user-defined-method-name

ngIntroDirective.directive('ngIntroOptions', [function () {

   return {
       restrict: 'A',

       link: function(scope, element, attrs){

           scope[attrs.ngIntroMethod] = function(step) {

               if(typeof(step)=="string"){
                   var intro = introJs(step);
               }
               else{
                   var intro = introJs();
               }

               intro.setOptions(scope.$eval(attrs.ngIntroOptions));

               if(attrs.ngIntroOncomplete){
                   intro.oncomplete(scope[attrs.ngIntroOncomplete]);
               }

               if(attrs.ngIntroOnexit){
                   intro.onexit(scope[attrs.ngIntroOnexit]);
               }

               if(attrs.ngIntroOnchange){
                   intro.onchange(scope[attrs.ngIntroOnchange]);
               }

               if(attrs.ngIntroOnbeforechange){
                   intro.onbeforechange(scope[attrs.ngIntroOnbeforechange]);
               }

               if(typeof(step)=="number"){
                   intro.goToStep(step).start();
               }
               else{
                   intro.start();

               }

           };
       }
   }
}]);