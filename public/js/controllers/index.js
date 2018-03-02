// itsm-analystics/public/js/controllers/ongoing.js

// Clock Rule
(function updateTime() {
    $.getJSON(global.time_url + 'timezone/country/alabama')
        .done(function(msg) {
            var day = msg.dayDescription.split(',');
            $('.cf-td-custom').each(function() {
                if ($(this).hasClass('alabama')) {
                    $('.cf-td-time', $(this)).html(msg.hour);
                    $('.cf-td-day', $(this)).html(day[0]);
                    $('.cf-td-date', $(this)).html(day[1]);
                }
            });
        });
    $.getJSON(global.time_url + 'timezone/country/saopaulo')
        .done(function(msg) {
            var day = msg.dayDescription.split(',');
            $('.cf-td-custom').each(function() {
                if ($(this).hasClass('saopaulo')) {
                    $('.cf-td-time', $(this)).html(msg.hour);
                    $('.cf-td-day', $(this)).html(day[0]);
                    $('.cf-td-date', $(this)).html(day[1]);
                }
            });
        });
    $.getJSON(global.time_url + 'timezone/country/seoul')
        .done(function(msg) {
            var day = msg.dayDescription.split(',');
            $('.cf-td-custom').each(function() {
                if ($(this).hasClass('seoul')) {
                    $('.cf-td-time', $(this)).html(msg.hour);
                    $('.cf-td-day', $(this)).html(day[0]);
                    $('.cf-td-date', $(this)).html(day[1]);
                }
            });
        });
    setTimeout(updateTime, 3000);
})();

// Index Controllers Rules
var index = {
    drawTableNotAcceptedHaeb: function(result) {
        $('.table-ongoing-notaccept tbody').html("");
        result.notDelayed.forEach(function(el) {
            var openDate = moment(el.OPEN_DATE).format('YYYY-MM-DD'),
                targetDate = moment(el.TARGET_DATE).format('YYYY-MM-DD'),
                isDelayed = result.delayed.filter(function(o) { return o.ID == el.ID }),
                color = (isDelayed.length > 0) ? 'class="tr-red"' : '';

            $('.table-ongoing-notaccept tbody').append("" +
                "<tr " + color + "><td>" + el.ID + "</td>" +
                "<td>" + global.getTeamName(el.OPERATING_TEAM) + "</td>" +
                "<td>" + global.getDepartmentName(el.REQUESTER_DEPT) + "</td>" +
                "<td>" + openDate + "</td>" +
                "<td>" + targetDate + "</td>" +
                +"</tr>");
        }, this);
    },
    drawTableNighteenDaysDelayed: function(result) {
        $('.table-ongoing-nighteendays tbody').html("");
        result.forEach(function(el) {
            var openDate = moment(el.OPEN_DATE).format('YYYY-MM-DD'),
                targetDate = moment(el.TARGET_DATE).format('YYYY-MM-DD');

            $('.table-ongoing-nighteendays tbody').append("" +
                "<tr><td>" + el.ID + "</td>" +
                "<td>" + global.getTeamName(el.OPERATING_TEAM) + "</td>" +
                "<td>" + global.getDepartmentName(el.REQUESTER_DEPT) + "</td>" +
                "<td>" + openDate + "</td>" +
                "<td>" + targetDate + "</td>" +
                +"</tr>");
        }, this);
    },
    drawTableResolutionDelay: function(result) {
        $('.table-ongoing-resdelay tbody').html("");
        result.forEach(function(el) {
            var openDate = moment(el.OPEN_DATE).format('YYYY-MM-DD'),
                targetDate = moment(el.TARGET_DATE).format('YYYY-MM-DD');

            $('.table-ongoing-resdelay tbody').append("" +
                "<tr><td>" + el.ID + "</td>" +
                "<td>" + global.getTeamName(el.OPERATING_TEAM) + "</td>" +
                "<td>" + global.getDepartmentName(el.REQUESTER_DEPT) + "</td>" +
                "<td>" + openDate + "</td>" +
                "<td>" + targetDate + "</td>" +
                +"</tr>");
        }, this);
    },
    drawChartSLASatisfaction: function(result) {
        var pieChart = "percent-SATISFACTION";
        var percent = result.avgSatisfaction.toFixed(2);

        // Call EasyPieChart update function
        if (cf_rSVPs[pieChart] !== undefined) {
            cf_rSVPs[pieChart].chart.update(percent);
            // Update the data-percent so it redraws on resize properly
            $('#' + pieChart + ' .chart').data('percent', percent);
            // Update the UI metric
            $('.metric', $('#' + pieChart)).html('' + percent);
        }
    },
    drawChartSLAAcceptence: function(result) {
        var pieChart = "percent-SLAACPT";
        // Call EasyPieChart update function
        if (cf_rSVPs[pieChart] !== undefined) {
            cf_rSVPs[pieChart].chart.update(result.percent);
            // Update the data-percent so it redraws on resize properly
            $('#' + pieChart + ' .chart').data('percent', result.percent);
            // Update the UI metric
            $('.metric', $('#' + pieChart)).html('' + result.percent);
        }
    },
    drawChartResolution: function(result) {
        var pieChart = "percent-RESOLUTION";
        // Call EasyPieChart update function
        if (cf_rSVPs[pieChart] !== undefined) {
            cf_rSVPs[pieChart].chart.update(result.percent);
            // Update the data-percent so it redraws on resize properly
            $('#' + pieChart + ' .chart').data('percent', result.percent);
            // Update the UI metric
            $('.metric', $('#' + pieChart)).html('' + result.percent);
        }
    },
    drawTotalMetrics: function(result) {
        $("#total-count-place").html('');
        $('#atual-success').html('');
        $('#atual-error').html('');
        $("#total-count-place").html(result.total);

        var s = result.percentResolved.split('.');
        var e = result.percentNotResolved.split('.');
        var success = $('<!--<div class="arrow-up"></div>-->' +
            '<span class="large"> ' + s[0] + '<span class="small">.' + s[1] + '%</span></span>');
        var error = $('<!--<div class="arrow-down"></div>-->' +
            '<span class="large"> ' + e[0] + '<span class="small">.' + e[1] + '%</span></span>');

        $('#atual-success').append(success);
        $('#atual-error').append(error);
    },
    drawChartLineMonth: function(result) {
        var chartLineObj = document.getElementById('index-chart-line');

        // creating chart js
        var charData = {
            type: 'line',
            data: {
                labels: result.map(function(elem) {
                    return elem.val;
                }),
                datasets: [{
                    borderColor: "rgba(255,0,0,1)",
                    backgroundColor: "rgba(255,0,0,0.2)",
                    pointBackgroundColor: "#f23c25",
                    pointRadius: 0,
                    data: result.map(function(elem) {
                        return elem.notResolved;
                    })
                }, {
                    borderColor: "rgba(102,206,57,1)",
                    backgroundColor: "rgba(102,206,57,0.2)",
                    pointBackgroundColor: "#66ce39",
                    pointRadius: 0,
                    data: result.map(function(elem) {
                        return elem.resolved;
                    })
                }, {
                    borderColor: "rgba(221,221,221,1)",
                    backgroundColor: "rgba(221,221,221,0.2)",
                    pointBackgroundColor: "#FFF",
                    pointRadius: 0,
                    data: result.map(function(elem) {
                        return elem.total;
                    })
                }]
            },
            options: {
                responsive: true,
                legend: false,
                tooltips: {
                    mode: 'index',
                    axis: 'y'
                },
                animation: {
                    duration: 0
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: 'white'
                        },
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: 'white'
                        },
                    }]
                }
            }
        }

        var ctx = chartLineObj.getContext("2d");
        window.myLine = new Chart(ctx, charData);
    }
}

// Socket listeners
var socket = io.connect(global.socket_url);
socket.on('connect', function() {

    socket.on('lastExecutionMiddleware', function(stringTime) {
        $('.title-pages .last .medium').html('');
        $('.title-pages .last .medium').append(stringTime);
    });

    socket.on('ongoingNotAcceptedHaeb', function(result) {
        index.drawTableNotAcceptedHaeb(result);
    });

    socket.on('ongoingPeriodDaysDelayed', function(result) {
        index.drawTableNighteenDaysDelayed(result);
    });

    socket.on('ongoingResolutionDelay', function(result) {
        index.drawTableResolutionDelay(result);
    });

    socket.on('ongoingSLASatisfaction', function(result) {
        index.drawChartSLASatisfaction(result);
    });

    socket.on('ongoingSLAAcceptence', function(result) {
        index.drawChartSLAAcceptence(result);
    });

    socket.on('ongoingResolution', function(result) {
        index.drawChartResolution(result);
    });

    socket.on('ongoingTotalMetrics', function(result) {
        index.drawTotalMetrics(result)
        index.drawChartLineMonth(result.data)
    })
});

// Http Handlers
var request = new HttpHandler(global.api_url);
request.requester(global.ongoing.sumary, request);

$(request).on('data', function(result) {
    index.drawTableNotAcceptedHaeb(result.state.notAcceptedHaeb);
    index.drawTableNighteenDaysDelayed(result.state.periodDaysDelayed);
    index.drawTableResolutionDelay(result.state.resolutionDelay);
    index.drawChartSLASatisfaction(result.state.slaSatisfaction);
    index.drawChartSLAAcceptence(result.state.slaAcceptence);
    index.drawChartResolution(result.state.slaResolution);
    index.drawTotalMetrics(result.state.metrics)
    index.drawChartLineMonth(result.state.metrics.data)
});

$(request).on('error', function(msg) {
    console.log(msg.state);
});