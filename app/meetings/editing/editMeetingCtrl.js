
meetingAgendaBuilder.controller('EditMeetingCtrl', function ($scope, $routeParams, currentAuth, MeetingService, UserService, $uibModal) {

    $scope.id = $routeParams.meetingId;
    $scope.loading = true;
    $scope.parkedActivities = MeetingService.parkedActivities;
    $scope.participants = [];
    /*
     * Load activity and participant from database
     */
    MeetingService.loadMeetings(currentAuth.uid);
    MeetingService.days.$loaded().then(function () {

        $scope.day = MeetingService.getDay($scope.id);
        if ($scope.day === null) {
            $scope.loading = false;
            $scope.status = "No meeting found, make sure you have the right id";
            return;
        }

        UserService.load();
        UserService.users.$loaded().then(function () {
            $scope.users = UserService.users;
            $scope.participants = UserService.getProfiles($scope.day._participants);
        });
        $scope.date = new Date();
        $scope.date.setHours(Math.floor($scope.day._start / 60));
        $scope.date.setMinutes($scope.day._start % 60);
        $scope.date.setSeconds(0);
        $scope.date.setMilliseconds(0);
        $scope.loading = false;
    });
    $scope.dropCallback = function (draggedItem, oldPosition, targetItem, newPosition, uid) {
        $scope.exception = undefined;
        //Dropped in bin
        if (targetItem === -1) {
            if (draggedItem === null) {
                MeetingService.removeParkedActivity(oldPosition);
                return;
            }
            if (draggedItem === 0) {
                MeetingService.removeActivity($scope.day, oldPosition);
                return;
            }
            if (draggedItem === 2) {
                MeetingService.removeParticipant($scope.day, oldPosition);
                $scope.participants = UserService.getProfiles($scope.day._participants);
                return;
            }
        }

        if (draggedItem === 2 && draggedItem === targetItem) {
            MeetingService.moveParticipant($scope.day, oldPosition, $scope.day, newPosition);
            $scope.participants = UserService.getProfiles($scope.day._participants);
            return;
        }
        else if (draggedItem === 1 && targetItem === 2) {
            MeetingService.addParticipant($scope.day, uid, newPosition);
            $scope.participants = UserService.getProfiles($scope.day._participants);
            return;
        }

        var oldDay = null;
        if (draggedItem === 0)
            oldDay = $scope.day;
        var newDay = null;
        if (targetItem === 0)
            newDay = $scope.day;
        try {
            MeetingService.moveActivity(oldDay, oldPosition, newDay, newPosition);
        }
        catch (except) {
            $scope.exception = except + " !";
        }
    };
    //Add new activity to parkedActivities
    $scope.addActivity = function (activity) {
        MeetingService.addActivity(activity);
    };
    $scope.editActivity = function () {
        alert("!");
    };
    $scope.setStart = function (timestamp) {
        $scope.exception = undefined;
        var startH = timestamp.getHours();
        var startM = timestamp.getMinutes();
        try {
            $scope.day.setStart(startH, startM);
        }
        catch (except) {
            var d = new Date();
            d.setHours(Math.floor($scope.day._start / 60));
            d.setMinutes($scope.day._start % 60);
            $scope.date = d;
            $scope.exception = except + " ";
        }
        MeetingService.save($scope.day);
    };
    //Retrieve activity type 
    $scope.getActivityType = function (typeId) {
        return MeetingService.getActivityType(typeId);
    };
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };
    $scope.searchTerm = "";
    $scope.searchFilter = {$: undefined};
    $scope.setFilter = function () {
        $scope.searchFilter = {};
        $scope.userFilter[$scope.selectedPropertyOption || '$'] = $scope.searchTerm;
    };
    $scope.animationsEnabled = true;
    $scope.open = function (act, day, position, queue) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'meetings/editing/activityModal.html',
            controller: 'ActivityModalCtrl',
            resolve: {
                activity: function () {
                    return act;
                },
                day: function () {
                    return day;
                },
                position: function () {
                    return position;
                },
                queue: function () {
                    return queue;
                }
            }
        });
        $scope.name;
    };
});