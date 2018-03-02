// itsm-analystics/public/js/controllers/ongoing.js

// Ongoing Controllers Rules
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
    },
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
    },
    drawTableResolutionDelay: function(result) {
        $('.table-ongoing-resdelay tbody').html("");
        result.forEach(function(el) {
            var openDate = moment(el.OPEN_DATE).format('YYYY-MM-DD'),
                targetDate = moment(el.TARGET_DATE).format('YYYY-MM-DD');
            $('.table-ongoing-resdelay tbody').append("" +
                "<tr><td>" + el.ID + "</td>" +
                "<td>" + el.OPERATING_TEAM + "</td>" +
                "<td>" + global.getNameRequester(el.REQUESTER) + "</td>" +
                "<td>" + global.getDepartmentName(el.SERVICE_NAME) + "</td>" +
                "<td>" + global.getNameOperator(el.ASSIGNEE_P) + "</td>" +
                "<td>" + openDate + "</td>" +
                "<td>" + targetDate + "</td>" +
                +"</tr>");
        }, this);
    },
    drawChartSLAByTeam: function(result) {
        result.currentTeams.forEach(function(elem) {
            var teamPie = elem._id.split(' ')[0],
                teamAvg = elem.avgSatisfaction.toFixed(2),
                pieChart = "percent-" + teamPie;
            // Call EasyPieChart update function
            if (cf_rSVPs[pieChart] !== undefined) {
                cf_rSVPs[pieChart].chart.update(teamAvg);
                // Update the data-percent so it redraws on resize properly
                $('#' + pieChart + ' .chart').data('percent', teamAvg);
                // Update the UI metric
                $('.metric', $('#' + pieChart)).html('' + teamAvg);
            }
        }, this);
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
    }
};

// Socket Listeners
var socket = io.connect(global.socket_url);
socket.on('connect', function() {

    socket.on('lastExecutionMiddleware', function(stringTime) {
        $('.title-pages .last .medium').html('');
        $('.title-pages .last .medium').append(stringTime);
    });

    socket.on('ongoingNotAcceptedHaeb', function(result) {
        ongoing.drawTableNotAcceptedHaeb(result);
    });

    socket.on('ongoingPeriodDaysDelayed', function(result) {
        ongoing.drawTableNighteenDaysDelayed(result);
    });

    socket.on('ongoingResolutionDelay', function(result) {
        ongoing.drawTableResolutionDelay(result);
    });

    socket.on('ongoingSLASatisfactionTeam', function(result) {
        ongoing.drawChartSLAByTeam(result);
    });

    socket.on('ongoingSLAAcceptence', function(result) {
        ongoing.drawChartSLAAcceptence(result);
    });
});