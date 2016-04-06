
meetingAgendaBuilder.controller('UserPageCtrl', function ($scope, $location, currentAuth, MeetingService) {
    $scope.user = currentAuth;
    MeetingService.retrieve();
});
