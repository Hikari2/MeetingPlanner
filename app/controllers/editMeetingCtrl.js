/**
 * Controller for edit meeting page
 */

meetingAgendaBuilder.controller('EditMeetingCtrl', function ($scope, $routeParams, currentAuth, MeetingService) {

    /**
     * index for day in being handled
     */
    $scope.id = $routeParams.meetingId;
    $scope.parkedActivities = MeetingService.parkedActivities;

    //When data from firebase is loaded initialize the variables
    MeetingService.days.$loaded().then(function () {

        $scope.day = MeetingService.days[$scope.id];

        $scope.startTime = formatTime($scope.day.start);
        $scope.endTime = formatTime($scope.day.end);

        $scope.loadActivities();
    });

    /**
     * Load activities and their start time
     */
    $scope.loadActivities = function () {
        $scope.activities = $scope.day.activities;

        $scope.activities_startTime = [];
        if ($scope.activities) {
            $.each($scope.activities, function (index) {
                var st = Day.fromJson($scope.day).getActivityStart(index);
                $scope.activities_startTime.push(st);
            });
        }
    };

    /**
     * 
     */
    $scope.addActivity = function () {
        MeetingService.addActivity(new Activity("Coffee break", 20, 1, "Help me"));
        MeetingService.addActivity(new Activity("Coffee break", 20, 2, "Help me"));
        MeetingService.addActivity(new Activity("Coffee break", 20, 3, "Help me"));
    };

    $scope.deleteActivity = function (position, day) {
        MeetingService.removeParkedActivity(position);
    };

    $scope.setStart = function (timestamp) {
        var startH = timestamp.getHours();
        var startM = timestamp.getMinutes();

        $scope.day.setStart(startH, startM);
        $scope.endTime = $scope.day.getEnd();
    };

    $scope.getActivityStart = function (index) {
        return Day.fromJson($scope.day).getActivityStart(index);
    };

    $scope.getPendingActivities = function () {
        return MeetingService.parkedActivities;
    };

    $scope.getActivityType = function (typeId) {
        return MeetingService.getActivityType(typeId);
    };

    $scope.moveActivity = function (oldQueue, oldPosition, newQueue, newPosition) {

        if (oldQueue === "pendingActivity")
            oldQueue = -1;
        else
            oldQueue = $scope.id;

        if (newQueue === "pendingActivity")
            newQueue = -1;
        else
            newQueue = $scope.id;

        MeetingService.moveActivity(oldQueue, oldPosition, newQueue, newPosition);

        $scope.startTime = formatTime($scope.day.start);
        $scope.endTime = formatTime($scope.day.end);

        $scope.loadActivities();
    };












    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
                mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date(tomorrow);
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    function getDayClass(data) {
        var date = data.date,
                mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
});