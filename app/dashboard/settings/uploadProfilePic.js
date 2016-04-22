/**
 * Created by Jian Sun on 4/14/16.
 */
function uploadImg() {
    window.open('dashboard/settings/uploadProfilePic.html', 'Upload Img', 'height=400,width=400,top = 200, left=200, toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
}
function previewImage(file)
{
    var MAXWIDTH  = 100;
    var MAXHEIGHT = 100;
    var div = document.getElementById('preview');
    if (file.files && file.files[0])
    {
        div.innerHTML = '<img id=imghead>';
        var img = document.getElementById('imghead');
        img.onload = function(){
            var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            img.width = rect.width;
            img.height = rect.height;
            img.style.marginLeft = rect.left+'px';
            img.style.marginTop = rect.top+'px';
        }
        var reader = new FileReader();
        reader.onload = function(evt){img.src = evt.target.result;}
        reader.readAsDataURL(file.files[0]);
    }
    else
    {
        var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
        div.innerHTML = '<img id=imghead>';
        var img = document.getElementById('imghead');
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
        div.innerHTML = "<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;margin-left:"+rect.left+"px;"+sFilter+src+"\"'></div>";
    }
}
function clacImgZoomParam( maxWidth, maxHeight, width, height ){
    var param = {top:0, left:0, width:width, height:height};
    if( width>maxWidth || height>maxHeight )
    {
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if( rateWidth > rateHeight )
        {
            param.width =  maxWidth;
            param.height = Math.round(height / rateWidth);
        }else
        {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }

    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}
//
// (function() {
//     var filename='http://tympanus.net/codrops/adpacks/demoadpacks.css?' + new Date().getTime();
//     var fileref=document.createElement("link");
//     fileref.setAttribute("rel", "stylesheet");
//     fileref.setAttribute("type", "text/css");
//     fileref.setAttribute("href", filename);
//     document.getElementsByTagName("head")[0].appendChild(fileref);
//
//     var demoad = document.createElement('div');
//     demoad.id = 'cdawrap';
//     demoad.innerHTML = '<span id="cda-remove" class="cda-remove" data-content="Continue to demo" aria-label="Close ad"></span>';
//     document.getElementsByTagName('body')[0].appendChild(demoad);
//
//     document.getElementById('cda-remove').addEventListener('click',function(e){
//         demoad.style.display = 'none';
//         e.preventDefault();
//     });
//
//     var bsa = document.createElement('script');
//     bsa.type = 'text/javascript';
//     bsa.async = true;
//     bsa.id = '_carbonads_js';
//     bsa.src = '//cdn.carbonads.com/carbon.js?zoneid=1673&serve=C6AILKT&placement=codrops';
//     demoad.appendChild(bsa);
//
//     var adChecked = false;
//     var attempts = 5;
//     var cntAttempts = 0;
//     var adInterval;
//
//     function checkAd() {
//         if (adChecked || cntAttempts >= attempts) {
//             clearInterval(adInterval);
//             return;
//         }
//
//         cntAttempts++;
//
//         var carbonImg = document.querySelector('.carbon-img');
//
//         if (!carbonImg) return;
//
//         var adImgHeight = carbonImg.offsetHeight;
//
//         if (adImgHeight >= 30) {
//             _gaq.push(['_trackEvent', 'Codrops Demo Ad', 'Carbon Ad VISIBLE','Carbon Ad']);
//
//             adChecked = true;
//         }
//     }
//
//     if(window._gaq) {
//         _gaq.push(['_trackEvent', 'Codrops Demo Ad', 'Carbon ad included', '1']);
//
//         adInterval = setInterval(checkAd, 3000);
//     }
// })();
//
//
//
//
//
