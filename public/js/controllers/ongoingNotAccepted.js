// itsm-analystics/public/js/controllers/ongoingNotAccepted.js

var ongoing = {
    drawTableNotAcceptedHaeb: function(result) {
        $('.table-ongoing-notaccept tbody').html("");
        result.notDelayed.forEach(function(el) {
            var openDate = moment(el.OPEN_DATE).format('YYYY-MM-DD'),
                targetDate = moment(el.TARGET_DATE).format('YYYY-MM-DD'),
                isDelayed = result.delayed.filter(function(o) { return o.ID == el.ID }),
                color = (isDelayed.length > 0) ? 'class="tr-red"' : '';
            $('.table-ongoing-notaccept tbody').append("" +
                "<tr " + color + "><td>" + el.ID + "</td>" +
                "<td>" + el.OPERATING_TEAM + "</td>" +
                "<td>" + global.getTitle(el.TITLE) + "</td>" +
                "<td>" + el.REQUESTER_DEPT + "</td>" +
                "<td>" + openDate + "</td>" +
                "<td>" + targetDate + "</td>" +
                +"</tr>");
        }, this);
    }
}

// Socket Listeners
var socket = io.connect(global.socket_url);
socket.on('connect', function() {
    socket.on('ongoingNotAcceptedHaeb', function(result) {
        ongoing.drawTableNotAcceptedHaeb(result);
    });
})

// Http Handlers
var request = new HttpHandler(global.api_url);
request.requester(global.ongoing.notAccepted, request);

$(request).on('data', function(result) {
    ongoing.drawTableNotAcceptedHaeb(result.state);
});

$(request).on('error', function(msg) {
    console.log(msg.state);
});