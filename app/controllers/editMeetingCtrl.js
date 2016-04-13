/**
 * Controller for edit meeting page
 */

meetingAgendaBuilder.controller('EditMeetingCtrl', function ($scope, $routeParams, currentAuth, MeetingService) {

    /**
     * index for day in being handled
     */
    $scope.id = $routeParams.meetingId;
    $scope.loading = true;

    $scope.parkedActivities = MeetingService.parkedActivities;
    $scope.bin = [];
    
    MeetingService.load(currentAuth.uid);

    //When data from firebase is loaded initialize the variables
    MeetingService.days.$loaded().then(function () {
        $scope.day = MeetingService.getDay($scope.id);

        $scope.date = new Date();
        $scope.date.setHours(Math.floor($scope.day.getStart() / 60));
        $scope.date.setMinutes($scope.day.getStart() % 60);
        $scope.date.setSeconds(0);
        $scope.date.setMilliseconds(0); 

        $scope.loading = false;
    });

    //Called on drop
    $scope.dropCallback = function (event, ui) {
        $scope.save();
    };

    //Save changes made to database
    $scope.save = function () {
        MeetingService.save($scope.day, $scope.id);
    };

    //Add new activity to parkedActivities
    $scope.addActivity = function () {
        MeetingService.addActivity(new Activity("Cellar party 1", 20, 1, "Help me"));
        MeetingService.addActivity(new Activity("Cellar party 2", 20, 2, "Help me"));
        MeetingService.addActivity(new Activity("Cellar party 3", 20, 3, "Help me"));


        //MeetingService.addDay (null, null, currentAuth.uid);

        /*
         $scope.day = MeetingService.getDay($scope.id);
         $scope.day.setTitle("Meeting in dungeon");
         $scope.day.setDate("today");
         $scope.day.setDescription ("He he he");
         $scope.day.setImportant (true);
         $scope.day.setType (1);
         $scope.save();
         MeetingService.addActivity(new Activity("Coffee break 1", 20, 1, "Help me! They got me locked in the cellar"), 0);
         MeetingService.addActivity(new Activity("Coffee break 2", 20, 2, "They ate my foot. lol what can you do."), 0);
         MeetingService.addActivity(new Activity("Coffee break 3", 20, 3, "Ahhhhhhhhhhhhhhhhhhhhhhhhhhh...aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"), 0);
         */
    };

    $scope.setStart = function (timestamp) {
        var startH = timestamp.getHours();
        var startM = timestamp.getMinutes();

        $scope.day.setStart(startH, startM);
        $scope.save();
    };

    //Retrieve activity type 
    $scope.getActivityType = function (typeId) {
        return MeetingService.getActivityType(typeId);
    };

    $scope.formatTime = function (totalMin) {
        var hours = Math.floor(totalMin / 60);
        var mins = totalMin % 60;

        if (hours < 10)
            hours = "0" + hours;

        if (mins < 10)
            mins = "0" + mins;

        return hours + ":" + mins;
    }

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
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