
function User() {

    this._firstName = "John";
    this._lastName = "Doe";
    this._gender = " ";
    this._birthday = " ";
    this._address = "Narnia";

    this._email = " ";
    this._phone = " ";


    this.toJson = function () {
        var json = {
            firstName: this._firstName,
            lastName: this._lastName,
            gender: this._gender,
            birthday: this._birthday,
            address: this._address,
            email: this._email,
            phone: this._phone,
        };
        return json;
    };
}

User.fromJson = function (json) {

    var user = new User();
    user._firstName = json.firstName;
    user._lastName = json.lastName;
    user._gender = json.gender;
    user._birthday = json.birthday;
    user._address = json.address;
    user._email = json.email;
    user._phone = json.phone;

    return user;
};