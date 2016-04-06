
meetingAgendaBuilder.controller('UserPageCtrl', function ($scope, $location, currentAuth) {
    $scope.user = currentAuth;
});
