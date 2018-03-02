// itsm-analystics/public/js/controllers/received.js

// Received Controllers Rules
var received = {
    drawTableTeam: function(result) {
        $(".table-received-team thead").html("");
        var teamHeader = '<th scope="col" class="rounded-company">Team</th>';
        var header = result.highcharts.series.map(function(n, i) {
            i++;
            var td = '<th scope="col" class="rounded-q' +
                i + '">' + n.name + '</th>';
            return td;
        }).join('');

        $(".table-received-team thead").append("<tr>" + teamHeader + header + "</tr>");
        $(".resolved-foot-line").attr("colspan", (result.highcharts.series.length + 1))
        $(".table-received-team tbody").html("");

        var series = result.highcharts.series;
        result.highcharts.categories.forEach(function(master, index) {
            var tr = "<tr><td>" + master + "</td>";
            series.forEach(function(el, ix) {
                tr += "<td>" + el.data[index] + "</td>";
            }, this);
            tr += "</tr>";
            $(".table-received-team tbody").append(tr);
        }, this);
    },
    generateChartGranTotal: function(data) {
        //console.log(data);
    },
    drawTableDepartment: function(result) {
        $(".table-received-dept thead").html("");
        $(".table-received-dept1 thead").html("");

        var deptHeader = '<th scope="col" class="rounded-company">Department</th>';
        var header = result.highcharts.series.map(function(n, i) {
            i++;
            var td = '<th scope="col" class="rounded-q' +
                i + '">' + n.name + '</th>';
            return td;
        }).join('');

        $(".table-received-dept thead").append("<tr>" + deptHeader + header + "</tr>");
        $(".table-received-dept1 thead").append("<tr>" + deptHeader + header + "</tr>");
        $(".resolved-foot-line").attr("colspan", (result.highcharts.series.length + 1))
        $(".table-received-dept tbody").html("");
        $(".table-received-dept1 tbody").html("");

        var series = result.highcharts.series;
        result.highcharts.categories.forEach(function(master, index) {
            var tableToApd = index >= 5 ? ".table-received-dept1 tbody" : ".table-received-dept tbody";
            var tr = "<tr><td>" + global.getDepartmentName(master) + "</td>";
            series.forEach(function(el, ix) {
                tr += "<td>" + el.data[index] + "</td>";
            }, this);
            tr += "</tr>";
            $(tableToApd).append(tr);
        }, this);
    }
}

// Socket listeners
var socket = io.connect(global.socket_url);
socket.on('connect', function() {

    socket.on('lastExecutionMiddleware', function(stringTime) {
        $('.title-pages .last .medium').html('');
        $('.title-pages .last .medium').append(stringTime);
    });

    socket.on('receivedReceivedAndApprovedTeam', function(result) {
        global.chartBarStacked({
            id: 'received-chart-bar',
            legend: true,
            result: result.highcharts,
            color: ["rgba(242,141,78,0.8)", "rgba(36,208,193,0.8)",
                "rgba(255,99,132,0.8)", "rgba(221,221,221,0.8)"
            ]
        });
        received.drawTableTeam(result);
    });

    socket.on('receivedReceivedAndApprovedDept', function(result) {
        received.drawTableDepartment(result);
        result.highcharts.categories = result.highcharts.categories.slice(0, 4);
        global.chartBarStacked({
            id: 'received-chart-bar-dept',
            legend: true,
            result: result.highcharts,
            color: ["rgba(0,155,0,0.8)", "rgba(204,47,51,0.8)",
                "rgba(255,255,15,0.8)", "rgba(244,80,0,0.8)"
            ]
        });
    });

    socket.on('receivedGranTotal', function(result) {
        received.generateChartGranTotal(result);
    });
});

// Http Handlers
var request = new HttpHandler(global.api_url);
request.requester(global.received.index, request);

$(request).on('data', function(result) {
    global.chartBarStacked({
        id: 'received-chart-bar',
        legend: true,
        result: result.state.team.highcharts,
        color: ["rgba(242,141,78,0.8)", "rgba(36,208,193,0.8)",
            "rgba(255,99,132,0.8)", "rgba(221,221,221,0.8)"
        ]
    });
    received.drawTableTeam(result.state.team);
    received.drawTableDepartment(result.state.dept);
    result.state.dept.highcharts.categories = result.state.dept.highcharts.categories.slice(0, 4);
    global.chartBarStacked({
        id: 'received-chart-bar-dept',
        legend: true,
        result: result.state.dept.highcharts,
        color: ["rgba(0,155,0,0.8)", "rgba(204,47,51,0.8)",
            "rgba(255,255,15,0.8)", "rgba(244,80,0,0.8)"
        ]
    });
});

$(request).on('error', function(msg) {
    console.log(msg.state);
});