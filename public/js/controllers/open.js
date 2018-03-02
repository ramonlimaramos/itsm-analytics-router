var open = {
    drawTableOpenTickets: function(data) {
        $('#rounded-corner>tbody').html('');
        var dataTable = $('#rounded-corner').DataTable();
        dataTable.clear().draw();
        dataTable.order([4, 'asc']);
        data.forEach(function(el) {
            var id = el.ID,
                requester = global.getNameRequester(el.REQUESTER),
                team = el.OPERATING_TEAM,
                assignee = global.getNameOperator(el.ASSIGNEE_P),
                openDate = moment(el.OPEN_DATE).format('YYYY-MM-DD'),
                targetDate = moment(el.TARGET_DATE).format('YYYY-MM-DD');
            dataTable.row.add([id, requester, team, assignee, openDate, targetDate]).draw(false);
        }, this);
    }
}

// Http Handlers
var request = new HttpHandler(global.api_url);
request.requester(global.open.index, request);

$(request).on('data', function(result) {
    open.drawTableOpenTickets(result.state);
});

$(request).on('error', function(msg) {
    console.log(msg.state);
})