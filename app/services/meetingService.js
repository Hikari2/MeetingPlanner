
meetingAgendaBuilder.factory('MeetingService', function ($resource, $cookieStore, FireBaseDataService) {

    var rkey;
    var ActivityType = ["Presentation", "Group_Work", "Discussion", "Break"]

    this.currentAuth = 12;

    this.setCurrentAuth = function (auth) {
        currentAuth = auth;
    };

    this.getAllData = function () {
        return FireBaseDataService;
    }

    this.save = function () {
        FireBaseDataService.$add(this.days[0].toJson());
        //rkey = $keyAt(this.days[0]);
        //return rkey;
    }

    this.retrieve = function () {
        FireBaseDataService.$getRecord(rkey);
    }

    this.days = [];
    this.parkedActivities = [];

    // adds a new day. if startH and startM (start hours and minutes)
    // are not provided it will set the default start of the day to 08:00
    this.addDay = function (startH, startM) {
        var day;
        if (startH) {
            day = new Day(startH, startM, this.currentAuth.uid);
        } else {
            day = new Day(8, 0, this.currentAuth.uid);
        }
        //alert(day);
        this.days.push(day);
        return day;
    };

    // add an activity to model
    this.addActivity = function (activity, day, position) {
        if (day != null) {
            this.days[day]._addActivity(activity, position);
        } else {
            if (position != null) {
                this.parkedActivities.splice(position, 0, activity);
            }
            else
                this.parkedActivities.push(activity);
        }
    };

    // add an activity to parked activities
    this.addParkedActivity = function (activity, position) {
        this.addActivity(activity, null, position);
    };

    // remove an activity on provided position from parked activites 
    this.removeParkedActivity = function (position) {
        act = this.parkedActivities.splice(position, 1)[0];
        return act;
    };

    // moves activity between the days, or day and parked activities.
    // to park activity you need to set the new day to null
    // to move a parked activity to let's say day 0 you set oldday to null
    // and new day to 0
    this.moveActivity = function (oldday, oldposition, newday, newposition) {

        if (oldday != -1 && oldday == newday) {
            this.days[oldday]._moveActivity(oldposition, newposition);
        } else if (oldday == -1 && newday == -1) {
            var activity = this.removeParkedActivity(oldposition);
            this.addParkedActivity(activity, newposition);
        } else if (oldday == -1) {
            var activity = this.removeParkedActivity(oldposition);
            this.days[newday]._addActivity(activity, newposition);
        } else if (newday == -1) {
            var activity = this.days[oldday]._removeActivity(oldposition);
            this.addParkedActivity(activity, newposition);
        } else {
            var activity = this.days[oldday]._removeActivity(oldposition);
            this.days[newday]._addActivity(activity, newposition);
        }
    };
    // Return all available activity types
    this.getActivityTypes = function () {
        return ActivityType;
    }

    // Return an acitivity type of a specific acitivity id
    this.getActivityType = function (activityTypeId) {
        return ActivityType[activityTypeId];
    }

    // you can use this method to create some test data and test your implementation
    // Used to test parkedActivity.
    this.createData = function () {
        this.addDay();
        this.addActivity(new Activity("Introduction", 10, 0, ""));
        this.addActivity(new Activity("Introduction in the cellar", 25, 1, ""));

        this.addActivity(new Activity("Idea 1 discussion", 15, 0, ""), 0);
        this.addActivity(new Activity("Coffee break", 20, 1, ""), 0);
        this.addActivity(new Activity("Idea 1 discussion", 15, 2, ""), 0);
        this.addActivity(new Activity("Coffee break", 20, 3, ""), 0);

        this.addDay();
        this.addActivity(new Activity("Drinking", 45, 2, ""), 1, 0);
        this.addActivity(new Activity("Running", 20, 3, ""), 1, 0);

        this.addDay();

        //$.each(ActivityType, function (index, type) {
        //    console.log("Day '" + ActivityType[index] + "' Length: " + this.days[0].getLengthByType(index) + " min");
        //});
    };
    this.createData();
    return this;
});