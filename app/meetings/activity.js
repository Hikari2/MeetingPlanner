

function Activity(name, length, typeid, description) {
    this._name = name;
    this._length = length;
    this._typeid = typeid;
    this._description = description;

    // sets the name of the activity
    this.setName = function (name) {
        this._name = name;
    }

    // get the name of the activity
    this.getName = function () {
        return this._name;
    }

    // sets the length of the activity
    this.setLength = function (length) {
        this._length = length;
    }

    // get the length of the activity
    this.getLength = function () {
        return this._length;
    }

    // sets the typeid of the activity
    this.setTypeId = function (typeid) {
        this._typeid = typeid;
    }

    // get the type id of the activity
    this.getTypeId = function () {
        return this._typeid;
    }

    // sets the description of the activity
    this.setDescription = function (description) {
        this._description = description;
    }

    // get the description of the activity
    this.getDescription = function () {
        return this._description;
    }

    // This method returns the string representation of the
    // activity type.
    this.getType = function () {
        return ActivityType[_typeid];
    };

    this.toJson = function () {
        return {
            name: this._name,
            length: this._length,
            typeid: this._typeid,
            description: this._description
        };
    };
}

Activity.fromJson = function (json) {
    return new Activity(json.name, json.length, json.typeid, json.description);
};