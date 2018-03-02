// itsm-analystics/public/js/controllers/ongoingNotAccepted.js

var ongoing = {
    drawTableNighteenDaysDelayed: function(result) {
        $('.table-ongoing-nighteendays tbody').html("");
        result.forEach(function(el) {
            var openDate = moment(el.OPEN_DATE).format('YYYY-MM-DD'),
                targetDate = moment(el.TARGET_DATE).format('YYYY-MM-DD');
            $('.table-ongoing-nighteendays tbody').append("" +
                "<tr><td>" + el.ID + "</td>" +
                "<td>" + el.OPERATING_TEAM + "</td>" +
                "<td>" + global.getNameRequester(el.REQUESTER) + "</td>" +
                "<td>" + global.getDepartmentName(el.SERVICE_NAME) + "</td>" +
                "<td>" + global.getNameOperator(el.ASSIGNEE_P) + "</td>" +
                "<td>" + openDate + "</td>" +
                "<td>" + targetDate + "</td>" +
                +"</tr>");
        }, this);
    }
}

// Socket Listeners
var socket = io.connect(global.socket_url);
socket.on('connect', function() {
    socket.on('ongoingPeriodDaysDelayed', function(result) {
        ongoing.drawTableNighteenDaysDelayed(result);
    });
})

// Http Handlers
var request = new HttpHandler(global.api_url);
request.requester(global.ongoing.nighteenDays, request);

$(request).on('data', function(result) {
    ongoing.drawTableNighteenDaysDelayed(result.state);
});

$(request).on('error', function(msg) {
    console.log(msg.state);
});