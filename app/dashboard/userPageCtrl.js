
meetingAgendaBuilder.controller('UserPageCtrl', function ($scope, $location, $uibModal, $log, currentAuth, MeetingService, UserService) {

    $scope.user = currentAuth;
    $scope.dragedTarget = null;
    $scope.addMoreState = "not-in";
    $scope.addMoreAbled = true;
    $scope.typeChoice = "Once";
    $scope.week = [];
    $scope.month = [];
    var weekDays = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    var types = new Array("Once", "Daily", "Weekly", "Monthly", "Yearly");
    var canAddDay = true;
    var newMeeting;
    $scope.typeList = new Array("Once", "Daily", "Weekly", "Monthly", "Yearly");
    $scope.monthList = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    $scope.lastdaySelected = false;
    $scope.monthChoice = "Jan";
    $scope.dayChoice = 1;
    $scope.dayList = [];
    $scope.fullDayList = [];
    $scope.yearlySelectedDayList = [];
    $scope.model = {
        newTitle: ""
    };
    $scope.emptyTitle = false;
    $scope.emptyDate = false;
    $scope.rawList = [];
    $scope.loading = true;
    $scope.meetingList = [];
    $scope.titleList = new Array("Title & Type", "Dates", "Description");

    // put the meetings with important tag at the top
    var sortMeetingList = function () {
        var ilist = [];
        var nlist = [];
        var addNew = $scope.meetingList.pop();
        for (var i = 0; i < $scope.meetingList.length; i++)
        {
            if ($scope.meetingList[i].Info.important === true)
            {
                $scope.meetingList[i].Importanttag = "true";
                ilist.push($scope.meetingList[i]);
            } else
                nlist.push($scope.meetingList[i]);
        }
        $scope.meetingList.length = 0;
        for (var i = 0; i < ilist.length; i++)
        {
            $scope.meetingList.push(ilist[i]);
        }
        for (var i = 0; i < nlist.length; i++)
        {
            $scope.meetingList.push(nlist[i]);
        }
        $scope.meetingList.push(addNew);
    };

    var getStringType = function (i)
    {
        return types[i];
    };

    var getIntType = function (str)
    {
        for (var i = 0; i < types.length; i++)
        {
            if (types[i] === str)
                return i;
        }
        return null;
    };

    var refreshMeetingList = function ()
    {
        $scope.rawList.length = 0;
        $scope.rawList = MeetingService.days;
        console.log($scope.rawList);
        // no meetings available
        if ($scope.day === null) {
            $scope.loading = false;
            $scope.status = "No meeting found, make sure you have the right id";
            return;
        }
        $scope.meetingList.length = 0;
        for (var i = 0; i < $scope.rawList.length + 1; i++)
        {
            var newMeetingBool = false;
            var editTagBool = false;
            var meeting = null;
            if (i === $scope.rawList.length)
            {
                newMeetingBool = true;
                editTagBool = true;
            } else {
                meeting = $scope.rawList[i];
            }
            var theType = "not-in";
            if (!newMeetingBool)
                theType = getStringType($scope.rawList[i].type);
            var time_tag = "00:00 - 00:00";
            if (!newMeetingBool)
                time_tag = getTimeTag($scope.rawList[i].start) + " - " + getTimeTag($scope.rawList[i].end);
            var me = {
                Info: meeting,
                Oldindex: i,
                Importanttag: "false",
                Viewmore: false,
                Typetag: theType,
                Timetag: time_tag,
                Memberstag: [],
                Userprofile: false,
                Selecteduser: 0,
                Edittag: editTagBool,
                Tabshow: [true, false, false],
                Selectedtab: 0,
                emptyTitle: false,
                emptyDate: false,
                typeChoice: "Once",
                weekSelected: [],
                monthSelected: [],
                lastdaySelected: false,
                yearlyMonthChoice: "Jan",
                yearlyDayChoice: 1,
                canAddDay: true,
                dayList: [],
                yearlySelectedDayList: [],
                fullDayList: [],
                newDescription: "",
                newTitle: "",
                onceYearChoice: 2016,
                onceMonthChoice: 1,
                onceDayChoice: 20,
                onceMonthDisplay: 1,
                onceYearDisplay: 2016,
                onceDayList: [],
                isNewMeeting: newMeetingBool
            };
            for (var j = 0; j < 7; j++)
            {
                me.weekSelected.push(false);
            }
            for (var j = 0; j < 31; j++)
            {
                me.monthSelected.push(false);
            }
            for (var j = 1; j <= 31; j++)
            {
                var day = {
                    ID: j,
                    Day: j,
                    Selected: false,
                    Disabled: false
                };
                if (i === 0)
                    $scope.month.push(day);
                me.fullDayList.push(day);
                me.dayList.push(day);
                me.onceDayList.push(day);
            }
            $scope.meetingList.push(me);
        }
        sortMeetingList();
        UserService.load();

        UserService.users.$loaded().then(function () {
            $scope.users = UserService.users;
            for (var i = 0; i < $scope.rawList.length; i++)
            {
                $scope.meetingList[i].Memberstag = UserService.getProfiles($scope.rawList[i].participants);
                console.log($scope.meetingList[i].Memberstag);
            }
        });
    };
    var getTimeTag = function (time)
    {
        var minute = time % 60;
        var hour = (time - minute) / 60;
        var minute_tag = "";
        if (minute < 10)
            minute_tag = "0" + minute;
        else
            minute_tag = "" + minute;
        var hour_tag = "";
        if (hour < 10)
            hour_tag = "0" + hour;
        else
            hour_tag = "" + hour;
        return hour_tag + ":" + minute_tag;
        ;
    };
    // load data
    var loadData = function ()
    {
        MeetingService.loadMeetings(currentAuth.uid);
        MeetingService.days.$loaded().then(function () {

            refreshMeetingList();
            $scope.loading = false;

        });
    };
    loadData();

    {
        for (var i = 0; i < 7; i++)
        {
            var day = {
                Day: weekDays[i],
                Selected: false
            };
            $scope.week.push(day);
        }
    }

    var canViewMore = true;

    $scope.userInfo = {
        Firstname: "Erik",
        Lastname: "Shasha",
        Email: "eric@kth.se",
        Phoneno: "076-123456",
        Gender: "Male",
        Birthday: "1993-8-8",
        Company: "KTH",
        Position: "None",
        Address: "Björksätravägen XX XX, Skärholmen",
        Description: "Welcome to your personal menu! Personal menu is displayed at the top of the entire kth.se website, so you always can reach your personal pages and functions e.g. academic overview, schedule, registrations, examination, results etc."
    };
    var fun = function ()
    {
        canViewMore = true;
    };


    $scope.showProfile = function (id, parent)
    {
        var index = parent.$index;
        $scope.meetingList[index].Selecteduser = id;
        $scope.meetingList[index].Userprofile = true;
    };

    //****************************
    $scope.setSelectedTab = function (parent, index)
    {
        var id = parent.$index;
        $scope.meetingList[id].Selectedtab = index;
        for (var i = 0; i < 3; i++)
        {
            if (i <= index)
                $scope.meetingList[id].Tabshow[i] = true;
            else
                $scope.meetingList[id].Tabshow[i] = false;
        }
    };

    //******************************
    $scope.reverseViewMore = function (index)
    {
        if (canViewMore)
        {
            $scope.meetingList[index].Viewmore = !$scope.meetingList[index].Viewmore;
            canViewMore = false;
            window.setTimeout(fun, 500);
        }
    };
    $scope.reverseUserprofile = function (index)
    {
        $scope.meetingList[index].Userprofile = !$scope.meetingList[index].Userprofile;
    };

    var checkWeekDate = function (index)
    {
        var empty = true;
        for (var i = 0; i < 7; i++)
        {
            if ($scope.meetingList[index].weekSelected[i])
                empty = false;
        }
        $scope.meetingList[index].emptyDate = empty;
        return empty;
    };

    $scope.reverseWeekSelection = function (parent, id)
    {
        var index = parent.$index;
        $scope.meetingList[index].weekSelected[id] = !$scope.meetingList[index].weekSelected[id];
        checkWeekDate(index);
    };

    var checkMonthDate = function (index)
    {
        var empty = true;
        for (var i = 0; i < 31; i++)
        {
            if ($scope.meetingList[index].monthSelected[i])
                empty = false;
        }
        if ($scope.meetingList[index].lastdaySelected)
            empty = false;
        $scope.meetingList[index].emptyDate = empty;
        return empty;
    };

    $scope.reverseMonthSelection = function (parent, id)
    {
        var index = parent.$index;
        $scope.meetingList[index].monthSelected[id] = !$scope.meetingList[index].monthSelected[id];
        checkMonthDate(index);
    };

    $scope.reverseLastdaySelection = function (id)
    {
        $scope.meetingList[id].lastdaySelected = !$scope.meetingList[id].lastdaySelected;
        checkMonthDate(id);
    };

    $scope.checkTitle = function (id)
    {
        if ($scope.meetingList[id].newTitle.length === 0)
        {
            $scope.meetingList[id].emptyTitle = true;
            return true;
        } else
        {
            $scope.meetingList[id].emptyTitle = false;
            return false;
        }
    };

    var checkYearDate = function (index)
    {
        var empty = false;
        if ($scope.meetingList[index].yearlySelectedDayList.length === 0)
            empty = true;
        $scope.meetingList[index].emptyDate = empty;
        return empty;
    };

    $scope.addDay = function (index)
    {
        if ($scope.meetingList[index].canAddDay)
        {
            var day = {
                Month: $scope.meetingList[index].yearlyMonthChoice,
                Day: $scope.meetingList[index].yearlyDayChoice
            };
            $scope.meetingList[index].dayList[$scope.meetingList[index].yearlyDayChoice - 1].Disabled = true;
            $scope.meetingList[index].yearlySelectedDayList.push(day);
            $scope.meetingList[index].emptyDate = false;
            $scope.meetingList[index].canAddDay = false;
        }
    };

    $scope.deleteDay = function (parent, id)
    {
        var index = parent.$index;
        var theDay = $scope.meetingList[index].yearlySelectedDayList[id];
        $scope.meetingList[index].yearlySelectedDayList.splice(id, 1);
        checkYearDate(index);
        $scope.meetingList[index].dayList[theDay.Day - 1].Disabled = false;
        $scope.meetingList[index].canAddDay = true;
    };

    var checkLeapYear = function (year)
    {
        if (year % 4 !== 0)
        {
            return false;
        } else
        {
            if (year % 100 === 0)
            {
                if (year % 400 === 0)
                    return true;
                else
                    return false;
            } else
                return true;
        }
    };
    var refileOnceDayList = function (index)
    {
        var month = $scope.meetingList[index].onceMonthDisplay;
        var year = $scope.meetingList[index].onceYearDisplay;
        var num = 30;
        if (month === 1 || month === 3 || month == 5 || month === 7 || month === 8 || month == 10 || month === 12)
        {
            num = 31;
        } else if (month === 2)
        {
            if (checkLeapYear(year))
                num = 29;
            else
                num = 28;
        }
        $scope.meetingList[index].onceDayList.length = 0;
        console.log("y " + $scope.meetingList[index].onceYearChoice + " m " + $scope.meetingList[index].onceMonthChoice + " d " + $scope.meetingList[index].onceDayChoice)
        for (var i = 0; i < num; i++)
        {
            if (year === $scope.meetingList[index].onceYearChoice && month === $scope.meetingList[index].onceMonthChoice && i === ($scope.meetingList[index].onceDayChoice - 1))
                $scope.meetingList[[index]].fullDayList[i].Selected = true;
            else
                $scope.meetingList[[index]].fullDayList[i].Selected = false;
            $scope.meetingList[index].onceDayList.push($scope.meetingList[[index]].fullDayList[i]);
        }
    };
    $scope.onPreYear = function (index)
    {
        $scope.meetingList[index].onceYearDisplay = $scope.meetingList[index].onceYearDisplay - 1;
        refileOnceDayList(index);
    };

    $scope.onPreMonth = function (index)
    {
        if ($scope.meetingList[index].onceMonthDisplay > 1)
            $scope.meetingList[index].onceMonthDisplay = $scope.meetingList[index].onceMonthDisplay - 1;
        else
            return;
        refileOnceDayList(index);
    };

    $scope.onNextMonth = function (index)
    {
        if ($scope.meetingList[index].onceMonthDisplay < 12)
            $scope.meetingList[index].onceMonthDisplay = $scope.meetingList[index].onceMonthDisplay + 1;
        else
            return;
        refileOnceDayList(index);
    };

    $scope.onNextYear = function (index)
    {
        $scope.meetingList[index].onceYearDisplay = $scope.meetingList[index].onceYearDisplay + 1;
        refileOnceDayList(index);
    };

    var updateAddDay = function (index)
    {
        $scope.meetingList[index].canAddDay = true;
    };

    /*
     $scope.meetingViewMore = false;
     $scope.setMeetingViewMore = function (newValue)
     {
     $scope.meetingViewMore = newValue;
     };*/

    $scope.setMouseInAddMore = function (id, val)
    {
        if (id !== $scope.meetingList.length - 1)
            return;
        if (val === 1)// mouse in the add more but not clicked
        {
            if ($scope.meetingList[id].Typetag === "not-in")
            {
                $scope.meetingList[id].Typetag = "in";
                $scope.addMoreAbled = false;
            }
        } else if (val === 0) {// the mouse is not in
            $scope.meetingList[id].Typetag = "not-in";
            $scope.addMoreAbled = false;
        } else// mouse in the add more and is active
        {
            $scope.meetingList[id].Typetag = "active";
            $scope.addMoreAbled = true;
        }
    };

    $scope.setTypeChoice = function (parent, value)
    {
        var index = parent.$index;
        if ($scope.meetingList[index].typeChoice === value)
            return;
        $scope.meetingList[index].typeChoice = value;
        $scope.meetingList[index].emptyDate = false;
    };

    $scope.setOnceDaySlected = function (parent, id)
    {
        var index = parent.$index;
        $scope.meetingList[index].onceMonthChoice = $scope.meetingList[index].onceMonthDisplay;
        $scope.meetingList[index].onceYearChoice = $scope.meetingList[index].onceYearDisplay;
        $scope.meetingList[index].onceDayChoice = id + 1;
        refileOnceDayList(index);
    };

    $scope.setDayChoice = function (parent, value)
    {
        var index = parent.$index;
        $scope.meetingList[index].yearlyDayChoice = value;
        updateAddDay(index);
    };

    $scope.setMonthChoice = function (parent, value)
    {
        var index = parent.$index;
        if ($scope.meetingList[index].yearlyMonthChoice !== value)
        {
            $scope.meetingList[index].yearlyMonthChoice = value;
            var num = 30;
            if (value === "Jan" || value === "Mar" || value === "May" || value === "Jul" || value === "Aug" || value === "Oct" || value === "Dec")
            {
                num = 31;
            } else if (value === "Feb")
            {
                num = 29;
            }
            $scope.meetingList[index].dayList.length = 0;
            for (var i = 0; i < num; i++)
            {
                $scope.meetingList[index].dayList.push($scope.meetingList[index].fullDayList[i]);
                $scope.meetingList[index].dayList[i].Disabled = false;
            }
            for (var j = 0; j < $scope.meetingList[index].yearlySelectedDayList.length; j++)
            {
                if ($scope.meetingList[index].yearlySelectedDayList[j].Month === value)
                    $scope.dayList[$scope.meetingList[index].yearlySelectedDayList[j].Day - 1].Disabled = true;
            }
            if ($scope.dayList[$scope.meetingList[index].yearlyDayChoice - 1].Disabled === false)
                updateAddDay(index);
        }
    };

    $scope.reverseImportantTag = function (index)
    {
        if ($scope.meetingList[index].Info.important === false)// mark the meeting as important, put it at the top pf the list
        {
            $scope.meetingList[index].Info.important = true;
            var day = Day.fromJson($scope.meetingList[index].Info);
            MeetingService.save(day);
            $scope.meetingList[index].Importanttag = "true";
            var tmp = $scope.meetingList[index];
            $scope.meetingList.splice(index, 1);
            $scope.meetingList.splice(0, 0, tmp);
        } else
        {
            $scope.meetingList[index].Info.important = false;
            $scope.meetingList[index].Importanttag = "false";
            var day = Day.fromJson($scope.meetingList[index].Info);
            MeetingService.save(day);
            var tmp = $scope.meetingList[index];
            $scope.meetingList.splice(index, 1);
            $scope.meetingList.splice($scope.meetingList.length, 0, tmp);
        }
    };

    $scope.reverseEdittag = function (id)
    {
        $scope.meetingList[id].Edittag = false;
    };

    $scope.onCalendar = function ()
    {
        $scope.open1();
    };

    $scope.deleteFromList = function (index)
    {
        $scope.meetingList.splice(index, 1);
    };
    $scope.saveMeetingChange = function (index)
    {
        if ($scope.meetingList[index].emptyTitle || $scope.meetingList[index].emptyDate)
            return;
        var empty = false;
        if ($scope.checkTitle(index))
            return;
        if ($scope.meetingList[index].typeChoice === "Weekly")
            empty = checkWeekDate(index);
        else if ($scope.meetingList[index].typeChoice === "Monthly")
            empty = checkMonthDate(index);
        else if ($scope.meetingList[index].typeChoice === "Yearly")
            empty = checkYearDate(index);
        if (empty)
            return;
        if (index === $scope.meetingList.length - 1)
        {
            $scope.loading = true;
            $scope.model.newTitle = $scope.meetingList[index].newTitle;
            $scope.typeChoice = getIntType($scope.meetingList[index].typeChoice);
            newMeeting = MeetingService.addDay(null, null, currentAuth.uid);
            MeetingService.loadMeetings(currentAuth.uid);
            MeetingService.days.$loaded().then(function () {
                refreshMeetingList();
                newMeeting._title = $scope.model.newTitle;
                newMeeting._type = $scope.typeChoice;
                MeetingService.save(newMeeting);
                loadData();
            });
        } else {
            $scope.meetingList[index].Info.title = $scope.meetingList[index].newTitle;
            $scope.meetingList[index].Info.type = getIntType($scope.meetingList[index].typeChoice);
            $scope.meetingList[index].Info.description = $scope.meetingList[index].newDescription;
            var day = Day.fromJson($scope.meetingList[index].Info);
            MeetingService.save(day);
            $scope.meetingList[index].Edittag = false;
            loadData();
        }
    };

    $scope.updateNewMeeting = function (newVal)
    {
        for (var i = 0; i < $scope.meetingList.length; i++)
        {
            if ($scope.meetingList[i].ID === newVal.ID)
            {
                // update the corrtesponding data
                $scope.meetingList[i].Time = newVal.Time;
                $scope.meetingList[i].Type = newVal.Type;
                $scope.meetingList[i].Holder = newVal.Holder;
                $scope.meetingList[i].Date = newVal.Date;
                $scope.meetingList[i].Remark = newVal.Remark;
                break;
            }
        }
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

    $scope.editMeeting = function (id)
    {
        $scope.meetingList[id].Edittag = true;
        $scope.meetingList[id].newTitle = $scope.meetingList[id].Info.title;
        $scope.meetingList[id].typeChoice = getStringType($scope.meetingList[id].Info.type);
        $scope.meetingList[id].newDescription = $scope.meetingList[id].Info.description;
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
    var afterTomorrow = new Date();
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
