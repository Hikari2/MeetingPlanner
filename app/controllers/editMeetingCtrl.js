
meetingAgendaBuilder.controller('EditMeetingCtrl', function ($scope, $routeParams, currentAuth, MeetingService) {
    $scope.user = currentAuth;
    $scope.id = $routeParams.meetingId;
    $scope.day = MeetingService.days[$scope.id];

    $scope.startTime = MeetingService.days[$scope.id].getStart();
    $scope.endTime = MeetingService.days[$scope.id].getEnd();
    $scope.dayLength = MeetingService.days[$scope.id].getTotalLength();

    MeetingService.setCurrentAuth(currentAuth);

    $scope.setStart = function (timestamp) {
        var startH = timestamp.getHours();
        var startM = timestamp.getMinutes();

        $scope.day.setStart(startH, startM);
        $scope.endTime = $scope.day.getEnd();
    };

    $scope.addActivity = function () {
        MeetingService.addActivity();
    };

    $scope.getActivities = function () {
        return $scope.day.getActivities();
    };

    $scope.getActivityStart = function (index) {
        return $scope.day.getActivityStart(index);
    };

    $scope.getPendingActivities = function () {
        return MeetingService.parkedActivities;
    };

    $scope.getActivityType = function (typeId) {
        return MeetingService.getActivityType(typeId);
    };

    $scope.moveActivity = function (oldday, oldposition, newday, newposition) {
        MeetingService.moveActivity(oldday, oldposition, newday, newposition);
    }
});