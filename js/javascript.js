let breadscrums = [];
let breadscrumName;

$(document).ready(function () {
    let currentUrl = window.location.href;

    if ($.cookie('breadscrums')) {
        breadscrums = JSON.parse($.cookie('breadscrums'));
    }

    if (breadscrums.length >= 5)
        breadscrums.shift();

    let menuPath = window.location.pathname.split('/~xrichterova/Zfinal')[1];
    let menuArray;

    $.getJSON('/~xrichterova/Zfinal/data/menu.json', function(json) {
        menuArray = json;
    }).done(function(){
        traverseJSON(menuArray, currentUrl);
        breadscrums.push([breadscrumName === undefined ? "Domov" : breadscrumName, currentUrl])

        //console.log(breadscrums);
        $.cookie('breadscrums', JSON.stringify(breadscrums), {path: '/'});

        let navBreadcrumbs = $('nav ol.breadcrumbs');
        $(breadscrums).each(function (index, value) {
            if (index != 4)
                navBreadcrumbs.append('<li class="breadcrumb-item"><a href="'+ value[1] +'">' + value[0] +'</a></li>');
            else
                navBreadcrumbs.append('<li class="breadcrumb-item active"  aria-current="page"><a href="'+ value[1] +'">' + value[0] +'</a></li>');
        });
    });
});

function traverseJSON(json, currentUrl) {
    $.each(json, function(key, value) {
        //console.log(window.location.protocol + '//' + window.location.host + '/~xrichterova/Zfinal' + value.href);
        //console.log(currentUrl);
        if (window.location.protocol + '//' + window.location.host + '/~xrichterova/Zfinal' + value.href == currentUrl) {
            //console.log(value.text);
            breadscrumName = value.text;
        } else {
            traverseJSON(value.children, currentUrl);
        }
    });
}