// This is a day consturctor. You can use it to create days,
// but there is also a specific function in the Model that adds
// days to the model, so you don't need call this yourself.
function Day(startH, startM, userId) {

    var MeetingType = ["Once", "Daily", "Weekly", "Monthly"];
    
    this._uid = userId;
    this._title = "No title";
    this._date = "Today";
    this._description = " ";
    this._important = false;
    this._type = 0;
    this._activities = [];

    this._start = startH * 60 + startM;
    this._end = startH * 60 + startM;
    
    this.setTitle = function (title) {
        this._title = title;
    };
    
    this.getTitle = function () {
        return this._title;
    };
    
    this.setDate =  function (date) {
        this._date = date;
    };
    
    this.getDate = function () {
        return this._date;
    };
    
    this.setDescription = function (description) {
        this._description = description;
    };
    this.getDescription = function () {
        return this._description;
    };
    this.setImportant = function (b) {
        this._important = b;
    };
    this.getImportant = function () {
        return this._important;
    };
    this.setType = function (typeId) {
        this._type = MeetingType[typeId];
    };
    this.getType = function () {
        return MeetingType[this._type];
    };
    // sets the start time to new value
    this.setStart = function (startH, startM) {
        this._start = startH * 60 + startM;
    }

// returns the total length of the acitivities in
// a day in minutes
    this.getTotalLength = function () {
        var totalLength = 0;
        $.each(this._activities, function (index, activity) {
            totalLength += activity.getLength();
        });
        return totalLength;
    };
    // returns the string representation Hours:Minutes of
    // the end time of the day
    this.getEnd = function () {
        this._end = this._start + this.getTotalLength();
        return this._end;
    };
    // returns the string representation Hours:Minutes of
    // the start time of the day
    this.getStart = function () {
        return this._start;
    };
    // returns the length (in minutes) of activities of certain type
    this.getLengthByType = function (typeid) {
        var length = 0;
        $.each(this._activities, function (index, activity) {
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
        if (position != null) {
            this._activities.splice(position, 0, activity);
        } else {
            this._activities.push(activity);
        }
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

        return counter;
    };
    
    this.toJson = function () {
        var json = {
            uid: this._uid,
            title: this._title,
            date: this._date,
            description: this._description,
            important: this._important,
            type: this._type,
            start: this._start,
            end: this._end + this.getTotalLength(),
            activities: []
        };
        $.each(this._activities, function (index, activity) {
            json.activities.push(activity.toJson());
        });
        return json;
    };
}

Day.fromJson = function (json) {

    if(json === undefined)
        return new Day(null, null, json.uid);
    
    var day = new Day(Math.floor(json.start / 60), json.start % 60, json.uid);

    day._title = json.title;
    day._date = json.date;
    day._description = json.description;
    day._important = json.important;
    day._type = json.type;

    if (json.activities) {
        $.each(json.activities, function (index, activity) {
            day._activities.push(Activity.fromJson(activity));
        });
    }

    return day;
};