var app = angular.module('myApp', ['angular-intro']);

app.controller('MyController', function ($scope) {

    $scope.IntroSnippets = {
                   steps:[
                       {
                           element: document.querySelector('#step1'),
                           intro: "This is the first tooltip."
                       },
                       {
                           element: document.querySelectorAll('#step2')[0],
                           intro: "<strong>You</strong> can also <em>include</em> HTML",
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
               };

});

