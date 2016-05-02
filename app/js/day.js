// This is a day consturctor. You can use it to create days,
// but there is also a specific function in the Model that adds
// days to the model, so you don't need call this yourself.
function Day(startH, startM, userId) {

    var MeetingType = ["Once", "Daily", "Weekly", "Monthly"];

    this._uid = userId;
    this._id = " ";
    this._title = "No title";
    this._days = [];
    this._description = " ";
    this._important = false;
    this._type = 0;
    this._activities = [];
    this._participants = [this._uid];

    this._start = startH * 60 + startM;
    this._end = startH * 60 + startM;

    this.setStart = function (startH, startM) {

        if ((this._start < (startH * 60 + startM)) && (this.getTotalLength() + startH * 60 + startM) > 1440) {
            throw ("Not enough time left for activities");
        }

        this._start = startH * 60 + startM;
        this._end = this._start + this.getTotalLength();
    };

    // returns the total length of the acitivities in
    // a day in minutes
    this.getTotalLength = function () {
        var totalLength = 0;
        angular.forEach(this._activities, function (activity, index) {
            totalLength += activity.getLength();
        });
        return totalLength;
    };

    // returns the string representation Hours:Minutes of
    // the end time of the day
    this.getEnd = function () {
        this._end = this._start + this.getTotalLength();
        return formatTime(this._end);
    };
    // returns the string representation Hours:Minutes of
    // the start time of the day
    this.getStart = function () {
        return formatTime(this._start);
    };
    // returns the length (in minutes) of activities of certain type
    this.getLengthByType = function (typeid) {
        var length = 0;
        angular.forEach(this._activities, function (activity, index) {
            if (activity.getTypeId() == typeid) {
                length += activity.getLength();
            }
        });
        return length;
    };
    //  returns the activies set for this day
    this.getActivities = function () {
        return this._activities;
    };
    // adds an activity to specific position
    // if the position is not provided then it will add it to the
    // end of the list
    this._addActivity = function (activity, position) {
        if ((activity._length + this.getTotalLength() + this._start) > 1440) {
            throw ("Not enough time of day left");
        }
        if (position !== null) {
            this._activities.splice(position, 0, activity);
        } else {
            this._activities.push(activity);
        }
    };

    this._editActivity = function (activity, position) {
        if ((activity._length + this.getTotalLength() + this._start - this._activities[position]._length) > 1440) {                          
            throw ("Not enough time of day left");
        }
        this._activities[position] = activity;
    };

    // removes an activity from specific position
    // this method will be called when needed from the model
    // don't call it directly
    this._removeActivity = function (position) {
        return this._activities.splice(position, 1)[0];
    };
    // moves activity inside one day
    // this method will be called when needed from the model
    // don't call it directly
    this._moveActivity = function (oldposition, newposition) {
        // In case new position is greater than the old position and we are not moving
        // to the last position of the array
        if (newposition > oldposition && newposition < this._activities.length - 1) {
            //newposition--;
        }
        var activity = this._removeActivity(oldposition);
        this._addActivity(activity, newposition);
        return this._activities;
    };

    this.getActivityStart = function (index) {

        var counter = this._start;
        for (var i = 0; i < this._activities.length; i++) {
            if (i == index)
                break;
            counter += this._activities[i].getLength();
        }

        return formatTime(counter);
    };

    this.addParticipant = function (user, position) {
        var id;
        if (user.$id !== undefined)
            id = user.$id;
        else
            id = user;

        for (var i = 0; i < this._participants.length; i++) {
            if (this._participants[i] === id)
                return undefined;
        }

        if (position !== null) {
            this._participants.splice(position, 0, id);
        } else {
            this._participants.push(id);
        }
        return id;
    };

    this.removeParticipant = function (position) {
        return this._participants.splice(position, 1)[0];
    };

    this.moveParticipant = function (oldposition, newposition) {
        if (newposition > oldposition && newposition < this._participants.length - 1) {
            //newposition--;
        }
        var participant = this.removeParticipant(oldposition);
        this._participants.splice(newposition, 0, participant);
        return this._participants;
    };

    var formatTime = function (totalMin) {
        var hours = Math.floor(totalMin / 60);
        var mins = totalMin % 60;

        if (hours < 10)
            hours = "0" + hours;

        if (mins < 10)
            mins = "0" + mins;

        return hours + ":" + mins;
    };

    this.toJson = function () {
        var json = {
            uid: this._uid,
            title: this._title,
            days: [],
            description: this._description,
            important: this._important,
            type: this._type,
            start: this._start,
            end: this._start + this.getTotalLength(),
            activities: [],
            participants: []
        };

        angular.forEach(this._days, function (date, index) {
            json.days.push(date);
        });

        angular.forEach(this._activities, function (activity, index) {
            json.activities.push(activity.toJson());
        });

        angular.forEach(this._participants, function (participant, index) {
            json.participants.push(participant);
        });
        return json;
    };
}

Day.fromJson = function (json) {

    if (json === undefined)
        return new Day(null, null, json.uid);

    var day = new Day(Math.floor(json.start / 60), json.start % 60, json.uid);
    day._id = json.$id;
    day._title = json.title;
    day._description = json.description;
    day._important = json.important;
    day._type = json.type;
    this._start = json.start;
    this._end = json.end;

    if (json.days) {
        angular.forEach(json.days, function (date, index) {
            day._days.push(date);
        });
    }

    if (json.activities) {
        angular.forEach(json.activities, function (activity, index) {
            day._activities.push(Activity.fromJson(activity));
        });
    }

    if (json.participants) {
        angular.forEach(json.participants, function (participant, index) {
            day.addParticipant(participant, null);
        });
    }

    return day;
};