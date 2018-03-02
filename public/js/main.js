// itsm-analytics-router/public/js/main.js

function _init(exportScriptName) {
    var exportScriptName = location.pathname;
    var exportScript = document.createElement("script");
    switch (exportScriptName) {
        // Main pages
        case '/itsm-analytics':
            exportScript.src = global.base_url + "js/controllers/index.js";
            break;

        case '/itsm-analytics/':
            exportScript.src = global.base_url + "js/controllers/index.js";
            break;

        case '/itsm-analytics/received':
            exportScript.src = global.base_url + "js/controllers/received.js";
            break;

        case '/itsm-analytics/received/':
            exportScript.src = global.base_url + "js/controllers/received.js";
            break;

        case '/itsm-analytics/resolved':
            exportScript.src = global.base_url + "js/controllers/resolved.js";
            break;

        case '/itsm-analytics/resolved/':
            exportScript.src = global.base_url + "js/controllers/resolved.js";
            break;

        case '/itsm-analytics/ongoing':
            exportScript.src = global.base_url + "js/controllers/ongoing.js";
            break;

        case '/itsm-analytics/ongoing/':
            exportScript.src = global.base_url + "js/controllers/ongoing.js";
            break;

        case '/itsm-analytics/open':
            exportScript.src = global.base_url + "js/controllers/open.js";
            break;

        case '/itsm-analytics/open/':
            exportScript.src = global.base_url + "js/controllers/open.js";
            break;

            // Sub-Pages
        case '/itsm-analytics/ongoing/not-accepted-by-haeb':
            exportScript.src = global.base_url + "js/controllers/ongoingNotAccepted.js";
            break;

        case '/itsm-analytics/ongoing/not-accepted-by-haeb/':
            exportScript.src = global.base_url + "js/controllers/ongoingNotAccepted.js";
            break;

        case '/itsm-analytics/ongoing/delayed-more-than-nighteen-days':
            exportScript.src = global.base_url + "js/controllers/ongoingNighteenDays.js";
            break;

        case '/itsm-analytics/ongoing/delayed-more-than-nighteen-days/':
            exportScript.src = global.base_url + "js/controllers/ongoingNighteenDays.js";
            break;

        case '/itsm-analytics/ongoing/resolution-delay':
            exportScript.src = global.base_url + "js/controllers/ongoingResolutionDelay.js";
            break;

        case '/itsm-analytics/ongoing/resolution-delay/':
            exportScript.src = global.base_url + "js/controllers/ongoingResolutionDelay.js";
            break;

        default:
            console.log('404');
            break;
    }
    document.querySelector('head').appendChild(exportScript);
}

function _render(obj) {
    var script = document.createElement("script");
    script.src = obj
    document.querySelector('head').appendChild(script);
}

// Initializing ..
_render(baseUrl + "js/plugins/moment.js");
_render(baseUrl + "js/plugins/easypiechart.js");
_render(baseUrl + "js/plugins/gauge.js");
_render(baseUrl + "js/plugins/Chart-2.7.js");
_render(baseUrl + "js/vendor/socket.io-client/dist/socket.io.js");
_render(baseUrl + "js/plugins/jquery.sparklines.js");
_render(baseUrl + "js/plugins/controlfrog-plugins.js");
_render(baseUrl + "js/vendor/bootstrap/dist/js/bootstrap.min.js");
_render(baseUrl + "js/plugins/control-frog-fn.js");
_render(baseUrl + "js/plugins/jquery-datatable/skin/bootstrap/js/dataTables.bootstrap.js");
_render(baseUrl + "js/properties.js");

var themeColour = 'black';
_render(baseUrl + "js/plugins/controlfrog.js");


if (window.addEventListener)
    window.addEventListener("load", _init, false);
else if (window.attachEvent)
    window.attachEvent("onload", _init);
else
    window.onload = _init;