/**
 * Created by Jiansun on 4/25/16.
 */
function ButtonClicked() {
    //document.getElementById("formsubmitbutton").style.display = "none"; // to undisplay
    document.getElementById("buttonreplacement").style.display = ""; // to display
    return true;
}

var FirstLoading = true;
function RestoreSubmitButton() {
    if (FirstLoading) {
        FirstLoading = false;
        return;
    }
    document.getElementById("formsubmitbutton").style.display = ""; // to display
    document.getElementById("buttonreplacement").style.display = ""; //
}

document.onfocus = RestoreSubmitButton;