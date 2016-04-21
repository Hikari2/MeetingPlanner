
meetingAgendaBuilder.factory('MeetingService', function ($firebaseArray, $firebaseObject, FireBaseDataService) {

    var ActivityType = ["Presentation", "Group_Work", "Discussion", "Break"];
    this.days = [];
    this.sharedDays = [];
    this.parkedActivities = [];

    this.loadMeetings = function (uid) {
        this.days = $firebaseArray(FireBaseDataService.meetings.child(uid));
    };

    this.loadSharedMeetings = function (uid) {
        this.sharedDays = $firebaseArray(FireBaseDataService.shared.child(uid));
    };

    this.loadSharedMeeting = function (id) {
        for (var i = 0; i < this.sharedDays.length; i++) {
            if (this.sharedDays[i].$id === id) {
                this.sharedDay = $firebaseObject(FireBaseDataService.meetings.child(this.sharedDays[i].owner).child(id));
                return;
            }
        }
        this.sharedDay = $firebaseObject(FireBaseDataService.meetings.child("Some string").child("Some string"));
    };

    this.save = function (day) {

        var index = this.getDayIndex(day._id);

        day = day.toJson();
        this.days[index].uid = day.uid;
        this.days[index].title = day.title;
        this.days[index].days = day.days;
        this.days[index].start = day.start;
        this.days[index].end = day.end;
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

        if (this.sharedDay === undefined)
            return null;

        if (this.sharedDay.$id === id)
            return Day.fromJson(this.sharedDay);

        return null;
    };

    this.getDayIndex = function (id) {
        for (var i = 0; i < this.days.length; i++) {
            if (this.days[i].$id === id)
                return i;
        }
        // must return a value
        return this.days.length - 1;
    };

    this.getAllDays = function () {
        var days = [];
        for (var i = 0; i < this.days.length; i++) {
            days[i] = Day.fromJson(this.days[i]);
        }
        ;

        return days;
    };

    this.getAllSharedDays = function () {
        var sharedDays = [];
        for (var i = 0; i < this.sharedDays.length; i++) {
            sharedDays[i] = Day.fromJson(this.sharedDays[i]);
        }
        ;

        return sharedDays;
    };

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

    this.removeDay = function (day) {

        day = day.toJson();
        var participants = day.participants;

        if (participants) {
            $.each(participants, function (index, participant) {

                if (day.removeParticipant(index) !== undefined) {
                    var index = this.getDayIndex(day._id);
                    var id = this.days[index].$id;
                    FireBaseDataService.shared.child(participant + "/" + id).remove().catch(function (error) {
                        alert("Something went wrong while trying to remove a shared meeting: " + error);
                    });
                }
            });
        }
    };

    this.getActivities = function (day) {
        return activities = Day.fromJson(this.days[day]).getActivities();
    }

    // add an activity to model
    this.addActivity = function (activity, day, position) {
        if (day != null) {
            var index = this.getDayIndex(day);
            this.days[index]._addActivity(activity, position);
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

        if (day.addParticipant(user, position) !== undefined) {
            var index = this.getDayIndex(day._id);
            var id = this.days[index].$id;
            var owner = this.days[index].uid;
            var sharedMeeting = $firebaseObject(FireBaseDataService.shared.child(user + "/" + id));

            sharedMeeting.$loaded().then(function () {
                sharedMeeting.owner = owner;
                sharedMeeting.$save().catch(function (error) {
                    alert("Something went wrong when trying to share the meeting: " + error);
                });
            });
        }

        this.save(day);
    };

    this.removeParticipant = function (day, position) {

        var participant = day.removeParticipant(position);

        if (participant !== undefined) {

            var index = this.getDayIndex(day._id);
            var id = this.days[index].$id;
            var sharedMeeting = $firebaseObject(FireBaseDataService.shared.child(participant + "/" + id));

            sharedMeeting.$loaded().then(function () {
                sharedMeeting.$remove().catch(function (error) {
                    alert("Something went wrong when trying to unshare the meeting: " + error);
                });
            });
        }

        this.save(day);
    };

    this.moveParticipant = function (oldday, oldPosition, newday, newPosition) {
        oldday.moveParticipant(oldPosition, newPosition);
        this.save(oldday);
    };



    return this;
});