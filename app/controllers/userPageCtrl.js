
meetingAgendaBuilder.controller('UserPageCtrl', function ($scope, $location, $uibModal, $log, currentAuth, MeetingService, UserService) {

    $scope.user = currentAuth;
    $scope.dragedTarget = null;
    $scope.sortingType = "Time";
    $scope.addMoreState = "not-in";
    $scope.addMoreAbled = true;
    $scope.week = [];
    $scope.month = [];
    var today = new Date();
    var weekDays = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    var types = new Array("Once", "Daily", "Weekly", "Monthly", "Yearly");
    var newMeeting;
    var sharedRowList = [];
    var shoredLoadedNum = 0;
    var sortListGlobal = false;
    $scope.typeList = new Array("Once", "Daily", "Weekly", "Monthly", "Yearly");
    $scope.monthList = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    $scope.lastdaySelected = false;
    $scope.monthChoice = "Jan";
    $scope.dayChoice = 1;
    $scope.dayList = [];
    $scope.fullDayList = [];
    $scope.yearlySelectedDayList = [];
    $scope.model = {
        newTitle: "",
        typeChoice: "Once",
        newDescription: ""
    };
    $scope.emptyTitle = false;
    $scope.emptyDate = false;
    $scope.rawList = [];
    $scope.loading = true;
    $scope.meetingList = [];
    $scope.titleList = new Array("Title & Type", "Dates", "Description");


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
    var getMonthDayNum = function (month, year)
    {
        var num = 30;
        if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12)
        {
            num = 31;
        } else if (month === 2)
        {
            if (checkLeapYear(year))
                num = 29;
            else
                num = 28;
        }
        return num;
    };

    var dateComparator = function (a, b) {
        var dif = $scope.monthList.indexOf(a.Month) - $scope.monthList.indexOf(b.Month);
        if (dif > 0)
        {
            return 1;
        } else if (dif < 0)
        {
            return -1;
        } else {
            var difDay = a.Day - b.Day;
            if (difDay > 0)
                return 1;
            else if (difDay < 0)
                return -1;
            else
                return 0;
        }
    };
    // put the meetings with important tag at the top
    var sortByType = function (a, b) {
        if (a.isNewMeeting && !b.isNewMeeting)
            return 1;
        else if (!a.isNewMeeting && b.isNewMeeting)
            return -1;
        else if (!a.isNewMeeting && !b.isNewMeeting)
        {
            if (a.Info.important && !b.Info.important)
                return -1;
            else if (!a.Info.important && b.Info.important)
                return 1;
            else
            {
                var typeDif = a.Info.type - b.Info.type;
                if (typeDif > 0)
                    return 1;
                else if (typeDif < 0)
                    return -1;
                else
                {
                    if (a.Info.type === 0)
                    {
                        var yearDif = a.Info.days[0] - b.Info.days[0];
                        if (yearDif > 0)
                            return 1;
                        else if (yearDif < 0)
                            return -1;
                        else
                        {
                            var monthDif = a.Info.days[1] - b.Info.days[1];
                            if (monthDif > 0)
                                return 1;
                            else if (monthDif < 0)
                                return -1;
                            else {

                            }
                        }
                    } else
                        return 0;
                }
            }
        }
    };

    var getNeraestDayOfMeeting = function (m)
    {
        var dif = 0;
        if (m.Info.type === 0) // once 
        {
            var year = m.Info.days[0];
            var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var month = m.Info.days[1] - 1;
            var day = m.Info.days[2];
            var meetingDate = new Date(year, month, day);
            dif = Math.round((meetingDate - todayDate) / (1000 * 60 * 60 * 24));
        } else if (m.Info.type === 1) // daily
            dif = 0;
        else if (m.Info.type === 2) // weekly
        {
            var todayDay = today.getDay();
            var bool=false;
            var minBool=false;
            var min = 0;
            var max=0;
            var last=0;
            for (var i = 0; i < 7; i++)
            {
                if (m.Info.days[i])
                {
                    last = i;
                    if(!minBool)
                    {
                        min = i;
                        minBool = true;
                    }
                    if(i>todayDay)
                    {
                        max=i;
                        break;
                    }
                }
            }
            if(!bool) max=last;
            if(max<todayDay)
            {
                dif = dif - todayDay + 7;
                dif = dif +min;
            }else dif=max-todayDay;
        } else if (m.Info.type === 3) // monthly
        {
            var max = 0;
            var min = 0;

            var bool = false;
            var minBool = false;
            for (var i = 1; i < 31; i++)
            {
                if (m.Info.days[i])
                {
                    if (!minBool)
                        min = i + 1;
                    minBool = true;
                    if (i + 1 >= today.getDate())
                    {
                        max = i + 1;
                        bool = true;
                        break;
                    }
                }
            }
            if (!minBool)
                min = getMonthDayNum(today.getMonth() + 1, today.getFullYear());
            if (!bool && m.Info.days[31])
                max = getMonthDayNum(today.getMonth() + 1, today.getFullYear());
            if (max < today.getDate())
            {
                dif = dif - today.getDate() + getMonthDayNum(today.getMonth() + 1, today.getFullYear());
                dif = dif + min;
            } else
                dif = dif - today.getDate() + max;
        } else if (m.Info.type === 4) // yearly
        {
            m.Info.days.sort(dateComparator);
            var last = m.Info.days[m.Info.days.length - 1];
            var max = null;
            var bool = false;
            var min = m.Info.days[0];
            for (var i = 0; i < m.Info.days.length; i++)
            {
                var mon = $scope.monthList.indexOf(m.Info.days[i].Month);
                if (mon > today.getMonth())
                {
                    max = m.Info.days[i];
                    bool = true;
                    break;
                } else if (mon === today.getMonth())
                {
                    if (m.Info.days[i].Day >= today.getDate())
                    {
                        max = m.Info.days[i];
                        bool = true;
                        break;
                    }
                }
            }
            if (!bool)
                max = last;
            var theDate = new Date(today.getFullYear(), $scope.monthList.indexOf(max.Month), max.Day);
            var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            dif = Math.round((theDate - todayDate) / (1000 * 60 * 60 * 24));
            if (dif < 0)
            {
                theDate = new Date(today.getFullYear() + 1, $scope.monthList.indexOf(min.Month), min.Day);
                dif = Math.round((theDate - todayDate) / (1000 * 60 * 60 * 24));
            }
        }

        if (dif < 0)
            m.latestDate = "Passed";
        else if (dif === 0)
            m.latestDate = "Today";
        else if (dif === 1)
            m.latestDate = "Tomorrow";
        else if (dif === 2)
            m.latestDate = "Day-After-Tomorrow";
        else {
            var ms = today.getTime() + (dif * 1000 * 60 * 60 * 24);
            var date = new Date(ms);
            m.latestDate = date.getFullYear() + " - " + (date.getMonth() + 1) + " - " + date.getDate();
        }
        return dif;
    };

    var sortByTime = function (a, b)
    {
        if (a.isNewMeeting)
            return 1;
        else if (b.isNewMeeting)
            return -1;
        else
        {
            var ad = getNeraestDayOfMeeting(a);
            var bd = getNeraestDayOfMeeting(b);
            var dateDif = ad - bd;
            if ((ad >= 0 && bd >= 0) || (ad < 0 && bd < 0))
            {
                if (dateDif > 0)
                    return 1;
                else if (dateDif < 0)
                    return -1;
                else
                    return 0;
            } else if (ad >= 0 && bd < 0)
                return -1;
            else if (ad < 0 && bd >= 0)
                return 1;
        }
    };

    var sortMeetingList = function () {
        for (var i = 0; i < $scope.meetingList.length - 1; i++)
            if ($scope.meetingList[i].Info.important === true)
                $scope.meetingList[i].Importanttag = "true";
        if ($scope.sortingType === "Type")
            $scope.meetingList.sort(sortByType);
        else if ($scope.sortingType === "Time")
        {
            // only one meeting in the list tag the time label
            if ($scope.meetingList.length === 2)
                sortByTime($scope.meetingList[0], $scope.meetingList[0]);
            $scope.meetingList.sort(sortByTime);
        }
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

    var fillMeetingList = function (sortList)
    {
        // no meetings available
        if ($scope.day === null) {
            $scope.loading = false;
            $scope.status = "No meeting found, make sure you have the right id";
            return;
        }
        $scope.meetingList.length = 0;
        var normalNum = $scope.rawList.length - sharedRowList.length;
        for (var i = 0; i < $scope.rawList.length + 1; i++)
        {
            var newMeetingBool = false;
            var editTagBool = false;
            var meeting = null;
            var card = "normal";
            var link = "";
            if (i >= normalNum && i !== $scope.rawList.length) // shared meetings
            {

                meeting = $scope.rawList[i];
                card = "shared";
                link = "#/spectateMeeting/" + sharedRowList[i - normalNum].$id;
            } else if (i === $scope.rawList.length)
            {
                newMeetingBool = true;
                editTagBool = true;
            } else
            {
                meeting = $scope.rawList[i];
                link = "#/editMeeting/" + meeting.$id;
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
                onceYearChoice: today.getFullYear(),
                onceMonthChoice: today.getMonth()+1,
                onceDayChoice: today.getDate(),
                onceMonthDisplay: today.getMonth()+1,
                onceYearDisplay: today.getFullYear(),
                onceDayList: [],
                isNewMeeting: newMeetingBool,
                cardType: card,
                linkToDetail: link,
                latestDate: "2016-4-5"
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
                if (i === 0) {
                    $scope.month.push(day);
                }
                me.fullDayList.push(day);
                me.dayList.push(day);
            }
            $scope.meetingList.push(me);
            refillOnceDayList($scope.meetingList.length - 1);
            if ($scope.meetingList[i].isNewMeeting === false)
                sortYearlySelectedDayList(i);
        }
        if (sortList)
        {
            UserService.load();
            UserService.users.$loaded().then(function () {
                $scope.users = UserService.users;
                for (var i = 0; i < $scope.meetingList.length - 1; i++)
                {
                    $scope.meetingList[i].Memberstag = UserService.getProfiles($scope.meetingList[i].Info.participants);
                }
            });
            sortMeetingList();
        }
    };
    var loadSharedMeetingAtNo = function (index, sortList)
    {
        if (MeetingService.sharedDays.length === 0)
        {
            fillMeetingList(sortList);
            return;
        }
        MeetingService.loadSharedMeeting(MeetingService.sharedDays[index].$id);
        sortListGlobal = sortList;
        MeetingService.sharedDay.$loaded().then(function ()
        {
            var day = MeetingService.getDay(MeetingService.sharedDays[index].$id);
            $scope.rawList.push(day.toJson());
            // load one more shared meeting
            shoredLoadedNum = shoredLoadedNum + 1;
            if (shoredLoadedNum < sharedRowList.length)
            {
                loadSharedMeetingAtNo(shoredLoadedNum, sortListGlobal);
            } else
            {
                fillMeetingList(sortListGlobal);
            }
        });
    };

    var refreshMeetingList = function (sortList)
    {
        $scope.rawList.length = 0;
        $scope.month.length = 0;

        $scope.rawList = MeetingService.days;
        sharedRowList = MeetingService.sharedDays;
        shoredLoadedNum = 0;
        // start from the first one in the shared list
        loadSharedMeetingAtNo(shoredLoadedNum, sortList);
    };

    var checkDisbledDays = function (index)
    {
        var canAdd = true;
        for (var i = 0; i < $scope.meetingList[index].yearlySelectedDayList.length; i++)
        {
            if ($scope.meetingList[index].yearlySelectedDayList[i].Month === $scope.meetingList[index].yearlyMonthChoice)
            {
                $scope.meetingList[index].dayList[$scope.meetingList[index].yearlySelectedDayList[i].Day - 1].Disabled = true;
                if ($scope.meetingList[index].yearlySelectedDayList[i].Day === $scope.meetingList[index].yearlyDayChoice)
                    canAdd = false;
            }
        }
        $scope.meetingList[index].canAddDay = canAdd;
    };

    var setSlectedDates = function (index)
    {
        var type = $scope.meetingList[index].Info.type;
        if (type === 0) // once
        {
            var year = $scope.meetingList[index].Info.days[0];
            var month = $scope.meetingList[index].Info.days[1];
            var day = $scope.meetingList[index].Info.days[2];
            $scope.meetingList[index].onceYearChoice = year;
            $scope.meetingList[index].onceMonthChoice = month;
            $scope.meetingList[index].onceDayChoice = day;
            $scope.meetingList[index].onceYearDisplay = year;
            $scope.meetingList[index].onceMonthDisplay = month;
            $scope.meetingList[index].onceDayDisplay = day;
        } else if (type === 2) // weekly
        {
            $scope.meetingList[index].weekSelected.length = 0;
            $scope.meetingList[index].weekSelected = $scope.meetingList[index].Info.days;
        } // monhtly
        else if (type === 3)
        {
            $scope.meetingList[index].monthSelected.length = 0;
            for (var i = 0; i < 31; i++)
            {
                $scope.meetingList[index].monthSelected.push($scope.meetingList[index].Info.days[i]);
            }
            $scope.meetingList[index].lastdaySelected = $scope.meetingList[index].Info.days[31];
        } else if (type === 4)
        {
            $scope.meetingList[index].yearlySelectedDayList.length = 0;
            $scope.meetingList[index].yearlySelectedDayList = $scope.meetingList[index].Info.days;
            checkDisbledDays(index);
        }
    };

    var sortYearlySelectedDayList = function (index)
    {
        if ($scope.meetingList[index].Info.type !== 4)
            return;
        $scope.meetingList[index].Info.days.sort(dateComparator);
    }

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
    var loadData = function (sortList)
    {
        // load the meetings created by the user first
        MeetingService.loadMeetings(currentAuth.uid);
        MeetingService.days.$loaded().then(function () {
            // then lolad the meetings shared by other users
            MeetingService.loadSharedMeetings(currentAuth.uid);
            MeetingService.sharedDays.$loaded().then(function () {

                refreshMeetingList(sortList);
                $scope.loading = false;

            });
        });
    };
    loadData(true);

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

    var fun = function ()
    {
        canViewMore = true;
    };

    $scope.setSortingType = function (val)
    {
        if (val !== $scope.sortingType)
        {
            $scope.sortingType = val;
            sortMeetingList();
        }
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
            getNeraestDayOfMeeting($scope.meetingList[index]);
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




    var refillOnceDayList = function (index)
    {
        var month = $scope.meetingList[index].onceMonthDisplay;
        var year = $scope.meetingList[index].onceYearDisplay;
        var num = getMonthDayNum(month, year);
        $scope.meetingList[index].onceDayList.length = 0;
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
        refillOnceDayList(index);
    };

    $scope.onPreMonth = function (index)
    {
        if ($scope.meetingList[index].onceMonthDisplay > 1)
            $scope.meetingList[index].onceMonthDisplay = $scope.meetingList[index].onceMonthDisplay - 1;
        else
            return;
        refillOnceDayList(index);
    };

    $scope.onNextMonth = function (index)
    {
        if ($scope.meetingList[index].onceMonthDisplay < 12)
            $scope.meetingList[index].onceMonthDisplay = $scope.meetingList[index].onceMonthDisplay + 1;
        else
            return;
        refillOnceDayList(index);
    };

    $scope.onNextYear = function (index)
    {
        $scope.meetingList[index].onceYearDisplay = $scope.meetingList[index].onceYearDisplay + 1;
        refillOnceDayList(index);
    };

    var updateAddDay = function (index)
    {
        $scope.meetingList[index].canAddDay = true;
    };

    var getDateArray = function (index, type)
    {
        var dates = [];
        if (type === 0) // once meeting
        {
            if (index === -1)
            {
                dates.push($scope.model.onceYearChoice);
                dates.push($scope.model.onceMonthChoice);
                dates.push($scope.model.onceDayChoice);
            } else {
                dates.push($scope.meetingList[index].onceYearChoice);
                dates.push($scope.meetingList[index].onceMonthChoice);
                dates.push($scope.meetingList[index].onceDayChoice);
            }
        } else if (type === 1)
        {
            dates = [];
        } else if (type === 2) // weekly meeting
        {
            if (index === -1)
                dates = $scope.model.weekSelected;
            else
                dates = $scope.meetingList[index].weekSelected;
        } else if (type === 3) // monthly meeting
        {
            if (index === -1)
            {
                dates = $scope.model.monthSelected;
                dates.push($scope.model.lastdaySelected);
            } else {
                dates = $scope.meetingList[index].monthSelected;
                dates.push($scope.meetingList[index].lastdaySelected);
            }
        } else {
            if (index === -1)
                dates = $scope.model.yearlySelectedDayList;
            else
                dates = $scope.meetingList[index].yearlySelectedDayList;
        }
        return dates;
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
        refillOnceDayList(index);
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
            checkDisbledDays(index);
        }
    };

    $scope.reverseImportantTag = function (index)
    {
        if ($scope.meetingList[index].cardType !== "normal")
            return;
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
            $scope.meetingList.splice($scope.meetingList.length - 1, 0, tmp);
        }
        sortMeetingList();
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
        var theDay = Day.fromJson($scope.meetingList[index].Info);
        if ($scope.meetingList[index].cardType === "normal")
            MeetingService.removeDay(theDay);
        else if ($scope.meetingList[index].cardType === "shared")
            MeetingService.removeSharedDay(theDay, currentAuth.uid);
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
            $scope.model.typeChoice = getIntType($scope.meetingList[index].typeChoice);
            $scope.model.newDescription = $scope.meetingList[index].newDescription;
            $scope.model.weekSelected = $scope.meetingList[index].weekSelected;
            $scope.model.monthSelected = $scope.meetingList[index].monthSelected;
            $scope.model.lastdaySelected = $scope.meetingList[index].lastdaySelected;
            $scope.model.onceYearChoice = $scope.meetingList[index].onceYearChoice;
            $scope.model.onceMonthChoice = $scope.meetingList[index].onceMonthChoice;
            $scope.model.onceDayChoice = $scope.meetingList[index].onceDayChoice;
            $scope.model.yearlySelectedDayList = $scope.meetingList[index].yearlySelectedDayList;
            newMeeting = MeetingService.addDay(null, null, currentAuth.uid);
            MeetingService.loadMeetings(currentAuth.uid);
            MeetingService.days.$loaded().then(function () {
                refreshMeetingList(false); // do not sort the list
                newMeeting._title = $scope.model.newTitle;
                newMeeting._type = $scope.model.typeChoice;
                newMeeting._days = getDateArray(-1, $scope.model.typeChoice);
                newMeeting._description = $scope.model.newDescription;
                MeetingService.save(newMeeting);
                loadData(true);
            });
        } else {
            $scope.meetingList[index].Info.title = $scope.meetingList[index].newTitle;
            $scope.meetingList[index].Info.type = getIntType($scope.meetingList[index].typeChoice);
            $scope.meetingList[index].Info.description = $scope.meetingList[index].newDescription;
            $scope.meetingList[index].Info.days = getDateArray(index, $scope.meetingList[index].Info.type);
            var day = Day.fromJson($scope.meetingList[index].Info);
            MeetingService.save(day);
            $scope.meetingList[index].Edittag = false;
            loadData(true);
        }
    };

    $scope.editMeeting = function (id)
    {
        $scope.meetingList[id].Edittag = true;
        $scope.meetingList[id].newTitle = $scope.meetingList[id].Info.title;
        $scope.meetingList[id].typeChoice = getStringType($scope.meetingList[id].Info.type);
        $scope.meetingList[id].newDescription = $scope.meetingList[id].Info.description;
        setSlectedDates(id);
        refillOnceDayList(id);
    };

});
