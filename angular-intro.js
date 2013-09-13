var ngIntroDirective = angular.module('angular-intro',[]);

ngIntroDirective.directive('ngIntro', [function () {



   return {
       restrict: 'A',

       scope:
       {
           callmethod: '=ngIntroFunction',
           opts: '=ngIntroOptions'

       },
       link: function(scope, element, attrs){

           scope.callmethod = function() {
               attrs.$observe('IntroSnippets', function(actualValue){
                   console.log(actualValue);
               });

               var intro = introJs();
               intro.setOptions({
                   steps:[
                       {
                           element: document.querySelector('#step1'),
                           intro: "This is a tooltip."
                       },
                       {
                           element: document.querySelectorAll('#step2')[0],
                           intro: "Ok, wasn't that fun?",
                           position: 'right'
                       },
                       {
                           element: '#step3',
                           intro: 'More features, more fun.',
                           position: 'left'
                       },
                       {
                           element: '#step4',
                           intro: "Another step.",
                           position: 'bottom'
                       },
                       {
                           element: '#step5',
                           intro: 'Get it, use it.'
                       }
                   ]
               });
               intro.start();
           };
       }
   }
}]);