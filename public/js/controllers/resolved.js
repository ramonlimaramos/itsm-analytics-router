var resolved = {
    preparePropChart: function(result) {
        return {
            categories: result[0].data.map(function(e) { return e.team }),
            series: result.map(function(element) {
                return {
                    data: element.data.map(function(e) { return parseInt(e.val) }),
                    name: element.val
                }
            })
        }
    },
    drawResolutionTable: function(result, table, isDays) {
        $("." + table + " thead").html("")
        var teamHeader = '<th scope="col" class="rounded-company">Team</th>';
        var header = result.map(function(n, i) {
            i++;
            var td = '<th scope="col" class="rounded-q' +
                i + '">' + n.val + '</th>';
            return td;
        }).join('');
        $("." + table + " thead").append("<tr>" + teamHeader + header + "</tr>");
        $(".resolved-foot-line").attr("colspan", (result.length + 1))

        $("." + table + " tbody").html("");
        var teams = result[0].data.map(function(t) {
            return t.team;
        })
        teams.forEach(function(t) {
            var tr = "<tr><td>" + t + "</td>";
            result.forEach(function(el, ix) {

                var number = parseInt(el.data.filter(function(o) {
                    return o.team === t
                })[0].val);

                tr += "<td>" + number + " " + (isDays ? 'd' : '') + "</td>";

            }, this);
            tr += "</tr>";
            $("." + table + " tbody").append(tr);
        }, this);
    }
}

var socket = io(global.socket_url);
socket.on("connect", function() {

    socket.on('lastExecutionMiddleware', function(stringTime) {
        $('.title-pages .last .medium').html('');
        $('.title-pages .last .medium').append(stringTime);
    });

    socket.on("resolvedAvgTimeResolution", function(result) {
        resolved.drawResolutionTable(result, 'table-resolved-team', true);
        global.chartBarStacked({
            id: 'resolved-chart-bar',
            legend: true,
            result: resolved.preparePropChart(result),
            color: ["rgba(242,141,78,0.8)", "rgba(36,208,193,0.8)",
                "rgba(255,99,132,0.8)", "rgba(221,221,221,0.8)"
            ]
        });
    })

    socket.on("resolvedQtdTimeResolution", function(result) {
        resolved.drawResolutionTable(result, 'table-resolved-team-qtd');
        global.chartBarStacked({
            id: 'resolved-chart-bar-qtd',
            legend: true,
            result: resolved.preparePropChart(result),
            color: ["rgba(242,141,78,0.8)", "rgba(36,208,193,0.8)",
                "rgba(255,99,132,0.8)", "rgba(221,221,221,0.8)"
            ]
        });
    })
});

// Http Handlers
var request = new HttpHandler(global.api_url);
request.requester(global.resolved.index, request);

$(request).on('data', function(result) {
    resolved.drawResolutionTable(result.state.qty, 'table-resolved-team-qtd');
    global.chartBarStacked({
        id: 'resolved-chart-bar-qtd',
        legend: true,
        result: resolved.preparePropChart(result.state.qty),
        color: ["rgba(242,141,78,0.8)", "rgba(36,208,193,0.8)",
            "rgba(255,99,132,0.8)", "rgba(221,221,221,0.8)"
        ]
    });
    resolved.drawResolutionTable(result.state.avg, 'table-resolved-team', true);
    global.chartBarStacked({
        id: 'resolved-chart-bar',
        legend: true,
        result: resolved.preparePropChart(result.state.avg),
        color: ["rgba(242,141,78,0.8)", "rgba(36,208,193,0.8)",
            "rgba(255,99,132,0.8)", "rgba(221,221,221,0.8)"
        ]
    });
});

$(request).on('error', function(msg) {
    console.log(msg.state);
});