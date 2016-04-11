/*
 * Functions to format times
 */


function formatTime(totalMin) {

    var hours = Math.floor(totalMin / 60);
    var mins = totalMin % 60;

    if (hours < 10)
        hours = "0" + hours;

    if (mins < 10)
        mins = "0" + mins;

    return hours + ":" + mins;
}