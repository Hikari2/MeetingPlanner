/**
 * Created by Jian Sun on 4/14/16.
 */
function closeTab() {
    window.close();
}

$('#myTab a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
})

function uploadImg() {
    window.open('views/uploadProfile.html', 'Upload Img', 'height=400,width=400,top = 200, left=200, toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no')
}
