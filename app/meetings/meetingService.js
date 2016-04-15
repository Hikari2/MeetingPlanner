
meetingAgendaBuilder.factory('MeetingService', function ($firebaseArray, FireBaseDataService) {

    var ActivityType = ["Presentation", "Group_Work", "Discussion", "Break"];

    this.parkedActivities = [];

    this.load = function (uid) {
        this.days = $firebaseArray(FireBaseDataService.meetings.child(uid));
    };

    this.save = function (day, index) {

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

        this.days.$save(this.days[index]).catch(function (error) {
            alert("Something went wrong when trying to save: " + error);
        });
    };

    this.getDay = function (index) {
        if(this.days[index] === undefined)
            return null;
        return Day.fromJson(this.days[index]);
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
            var tmp = Day.fromJson(this.days[day]);
            tmp._addActivity(activity, position);
            this.days[day].activities = tmp.toJson().activities;
            this.days.$save(day);

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
    this.moveActivity = function (oldDay, oldPosition, newDay, newPosition) {
        //alert(oldDay + ", " + oldPosition + " > " +newDay + ", " + newPosition);

        if (oldDay !== -1 && oldDay === newDay) {
            var day = Day.fromJson(this.days[oldDay]);
            day._moveActivity(oldPosition, newPosition);
            this.days[oldDay].activities = day.toJson().activities;
            this.days.$save(this.days[oldDay]).catch(function (error) {
                alert("Error:" + error);
            });
        } else if (oldDay === -1 && newDay === -1) {
            var activity = this.removeParkedActivity(oldPosition);
            this.addParkedActivity(activity, newPosition);
        } else if (oldDay == -1) {
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

    return this;
});