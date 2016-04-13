meetingAgendaBuilder.controller('UserPageCtrl', function ($scope, $location, $uibModal, $log, currentAuth, MeetingService) {

    $scope.user = currentAuth;
    $scope.dragedTarget = null;
    $scope.viewMore = [];
    $scope.addMoreState = "not-in";
    $scope.addMoreAbled = false;

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

    $scope.setViewMore = function (index, newValue)
    {
        $scope.viewMore[index] = newValue;
    };

    $scope.meetingViewMore = false;

    $scope.setMeetingViewMore = function (newValue)
    {
        $scope.meetingViewMore = newValue;
    };

    $scope.setMouseInAddMore = function (val)
    {
        if (val === 1)// mouse in the add more but not clicked
        {
            $scope.addMoreState = "in";
            $scope.addMoreAbled = false;
        } else if (val === 0) {// the mouse is not in the filde
            $scope.addMoreState = "not-in";
            $scope.addMoreAbled = false;
        } else// mouse in the add more and is active
        {
            $scope.addMoreState = "active";
            $scope.addMoreAbled = true;
        }
    };

    $scope.reverseImportantTag = function (index)
    {
        if ($scope.meetingList[index].Info.Important === "false")
            $scope.meetingList[index].Info.Important = "true";
        else
            $scope.meetingList[index].Info.Important = "false";
        sortMeetingList();
    };

    $scope.meetingList = [];
    var m1 = {
        ID: "1",
        Title: "Project Meeting",
        Date: "2016-6-8",
        Time: "10:00-14:00",
        Type: "Normal",
        Holder: "Hao Wang",
        Important: "false",
        Members: ["Eric R", "Hao Wang", "Jian Sun"],
        Remark: "Windows and solar panels in the future could be made from one of the best — and cheapest — construction materials known: wood. Researchers at Stockholm's KTH Royal Institute of Technology have developed a new transparent wood material that's suitable for mass production."
    };

    var m2 = {
        ID: "2",
        Title: "20th Annual Comference in KTH",
        Date: "2017-10-25",
        Time: "All day, 08:00-20:00",
        Type: "Important",
        Holder: "xMan",
        Important: "true",
        Members: ["Hicari", "Eric R", "Hao Wang", "Jian Sun", "Yan Ma"],
        Remark: "Research at KTH's is to a large extent conducted in co-operation with companies and various societal bodies. The co-operations are often organized as competence centres, connected to a certain KTH Department, but still conducting research on its own. Most of the centres have a board, with representatives from trade, business and society."
    };

    var m3 = {
        ID: "3",
        Title: "Blabla Abracadabra Meetings",
        Date: "2004-6-6",
        Time: "All day, 08:00-20:00",
        Type: "Normal",
        Holder: "Haha",
        Important: "false",
        Members: ["Hicari", "Eric R", "Hao Wang", "Jian Sun", "Yan Ma","Lei","Haha","Shashank"],
        Remark: "Your account has been created successfully! Take a look at these resources to help you get started."
    };
    
    var m4 = {
        ID: "4",
        Title: "Really Do Not What Should Be Callled Meeting",
        Date: "2008-6-6",
        Time: "08:00-20:00",
        Type: "Weekly",
        Holder: "Ok",
        Important: "false",
        Members: [ "Yan Ma","Lei","Haha","Shashank"],
        Remark: "Your account has been created successfully! Take a look at these resources to help you get started."
    };
    
    var m5 = {
        ID: "5",
        Title: "Dickbutt Meeting",
        Date: "2222-2-22",
        Time: "2:22-22:22",
        Type: "Other",
        Holder: "Dickbutt",
        Important: "false",
        Members: [ "Yan Ma","Lei","Haha","Dickbutt"],
        Remark: "Happy everyone!!"
    };
    
    var list = [];
    list.push(m1);
    list.push(m2);
    list.push(m3);
    list.push(m4);
    list.push(m5);
    for (var i = 0; i < list.length; i++)
    {
        var me = {
            Info: list[i],
            Index: i
        };
        $scope.meetingList.push(me);
    }
    var sortMeetingList = function () {
        var ilist = [];
        var nlist = [];
        for (var i = 0; i < $scope.meetingList.length; i++)
        {
            if ($scope.meetingList[i].Info.Important === "true")
                ilist.push($scope.meetingList[i]);
            else
                nlist.push($scope.meetingList[i]);
        }
        $scope.meetingList.length = 0;
        var k = 0;
        for (var i = 0; i < ilist.length; i++)
        {
            $scope.meetingList.push(ilist[i]);
            $scope.meetingList[k].Index = k;
            k = k + 1;
        }
        for (var i = 0; i < nlist.length; i++)
        {
            $scope.meetingList.push(nlist[i]);
            $scope.meetingList[k].Index = k;
            k = k + 1;
        }
    };
    var refreshIndex = function()
    {
        for(var i=0;i<$scope.meetingList.length;i++)
        {
            $scope.meetingList[i].Index=i;
        }
    };
    sortMeetingList();
    $scope.deleteFromList = function(index)
    {
        $scope.meetingList.splice(index,1);
        refreshIndex();
    };

    $scope.open = function (meeting) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: './views/myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'md',
            resolve: {
                meeting: function () {
                    return meeting;
                }
            }
        });

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
        modalInstance.result.then(function (newMeeting) {
            $scope.updateNewMeeting(newMeeting);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.messageList = [];
    $scope.noMessage = false;
    var ms1 = {
        Title: "Welcome Letter",
        Date: "2016-4-8",
        Time: "10:50",
        Content: "We are pleased to welcome you as a new credit account customer with Doe Corporation. We are always happy when\
                we can extend the privileges of a Doe credit card to customers like you. We are sure that you will find your credit \
                card a convenient way to make purchases. In addition, you will now receive advance notification of all of our sales, and \
                an extra discount available to credit customers only.As an example of the benefits to come, we are sending you a coupon for \
                20% off any regularly-priced item. You will find it attached to the enclosed statement that details the terms of your account. \
                Please read the statement carefully and call our customer service department at 555-5555 if you have any questions.Thanks for \
                choosing Doe Corporation for all of your business supply needs. We look forward to serving you."
    }
    $scope.messageList.push(ms1);
    if ($scope.messageList.length === 0)
        $scope.noMessage = true;

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

meetingAgendaBuilder.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, meeting) {

    $scope.meeting = meeting;
    $scope.time = $scope.meeting.Time;
    $scope.oldTime = meeting.Time;

    $scope.getTime = function () {
        return $scope.time;
    };

    $scope.shortenDateInput = {
        "width": "300px"
    };
    $scope.getTime = function () {
        return $scope.time;
    };
    $scope.isEdit = false;
    $scope.onClose = function () {
        $uibModalInstance.close($scope.meeting);
    };

    $scope.onSave = function () {
        //$uibModalInstance.dismiss('cancel');
        $scope.meeting.Time = document.getElementById("modal-time-input").value;
        $scope.meeting.Type = document.getElementById("modal-type-input").value;
        $scope.meeting.Holder = document.getElementById("modal-holder-input").value;
        $scope.meeting.Remark = document.getElementById("modal-remark-input").value;
        $scope.meeting.Date = $scope.dt.getFullYear() + "-" + ($scope.dt.getMonth() + 1) + "-" + $scope.dt.getDate();
        console.log($scope.meeting.Date);
        $scope.isEdit = false;
        $scope.shortenDateInput = {
            "width": "300px"
        };
    };

    $scope.onEdit = function () {
        //$uibModalInstance.dismiss('cancel');
        $scope.isEdit = true;
        $scope.shortenDateInput = {
            "width": "252px"
        };
    };

    $scope.onCancel = function () {
        // reset input fields to initial value
        document.getElementById("modal-time-input").value = meeting.Time;
        document.getElementById("modal-type-input").value = meeting.Type;
        document.getElementById("modal-holder-input").value = meeting.Holder;
        document.getElementById("modal-remark-input").value = meeting.Remark;
        var s = new String(meeting.Date);
        var sd = s.split("-");
        $scope.setDate(sd[0], sd[1] - 1, sd[2]);
        // set finished
        $scope.isEdit = false;
        $scope.shortenDateInput = {
            "width": "300px"
        };
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

    // Disable weekend selection
    function disabled(data) {
        /*
         var date = data.date,
         mode = data.mode;
         return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);*/
    }

    $scope.toggleMin = function () {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.dt = new Date(year, month, day);
    };


    $scope.format = 'dd-MMMM-yyyy';
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date(tomorrow);
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
    // set the date input field to the date specified in the meeting information
    var s = new String(meeting.Date);
    var sd = s.split("-");
    $scope.setDate(sd[0], sd[1] - 1, sd[2]);
    //
});