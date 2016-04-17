
meetingAgendaBuilder.factory('MeetingService', function ($firebaseArray, FireBaseDataService) {

    var ActivityType = ["Presentation", "Group_Work", "Discussion", "Break"];

    this.parkedActivities = [];

    this.load = function (uid) {
        this.days = $firebaseArray(FireBaseDataService.meetings.child(uid));
    };

    this.save = function (day) {

        var index = this.getDayIndex(day._id);

        this.days[index].start = day.getStart();
        this.days[index].end = day.getEnd();

        day = day.toJson();
        this.days[index].uid = day.uid;
        this.days[index].title = day.title;
        this.days[index].date = day.date;
        this.days[index].description = day.description;
        this.days[index].important = day.important;
        this.days[index].type = day.type;
        this.days[index].activities = day.activities;
        this.days[index].participants = day.participants;

        this.days.$save(this.days[index]).catch(function (error) {
            alert("Something went wrong when trying to save: " + error);
        });
    };

    this.getDay = function (id) {
        for (var i = 0; i < this.days.length; i++) {
            if (this.days[i].$id === id)
                return Day.fromJson(this.days[i]);
        }
    };

    this.getDayIndex = function (id) {
        for (var i = 0; i < this.days.length; i++) {
            if (this.days[i].$id === id)
                return i;
        }
    }

    this.getAllDays = function () {
        var days = [];
        for (var i = 0; i < this.days.length; i++) {
            days[i] = Day.fromJson(this.days[i]);
        }
        return days;
    }

    // adds a new day. if startH and startM (start hours and minutes)
    // are not provided it will set the default start of the day to 08:00
    this.addDay = function (startH, startM, uid) {
        var day;
        if (startH) {
            day = new Day(startH, startM, uid);
        } else {
            day = new Day(8, 0, uid);
        }
        this.days.$add(day.toJson());
        return day;
    };

    this.getActivities = function (day) {
        return activities = Day.fromJson(this.days[day]).getActivities();
    }

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
        var act = this.parkedActivities.splice(position, 1)[0];
        return act;
    };

    // remove an activity on provided position from parked activites 
    this.removeActivity = function (day, position) {
        day._removeActivity(position);
        this.save(day);
    };

    // moves activity between the days, or day and parked activities.
    // to park activity you need to set the new day to null
    // to move a parked activity to let's say day 0 you set oldday to null
    // and new day to 0
    this.moveActivity = function (oldday, oldposition, newday, newposition) {

        if (oldday !== null && oldday === newday) {
            oldday._moveActivity(oldposition, newposition);
            this.save(oldday);
        } else if (oldday === null && newday === null) {
            var activity = this.removeParkedActivity(oldposition);
            this.addParkedActivity(activity, newposition);
        } else if (oldday === null) {
            var activity = this.removeParkedActivity(oldposition);
            newday._addActivity(activity, newposition);
            this.save(newday);
        } else if (newday === null) {
            var activity = oldday._removeActivity(oldposition);
            this.addParkedActivity(activity, newposition);
            this.save(oldday);
        } else {
            //var activity = this.days[oldday]._removeActivity(oldposition);
            //this.days[newday]._addActivity(activity, newposition);
        }
    };

    // Return all available activity types
    this.getActivityTypes = function () {
        return ActivityType;
    };

    // Return an acitivity type of a specific acitivity id
    this.getActivityType = function (activityTypeId) {
        return ActivityType[activityTypeId];
    };

    this.addParticipant = function (day, user, position) {
        day.addParticipant(user, position);
        this.save(day);
    };

    this.removeParticipant = function (day, position) {

        day.removeParticipant(position);
        this.save(day);
    };

    this.moveParticipant = function (oldday, oldPosition, newday, newPosition) {
        oldday.moveParticipant(oldPosition, newPosition);
        this.save(oldday);
    };



    return this;
});