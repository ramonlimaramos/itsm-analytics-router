var global = {
    base_url: baseUrl,
    socket_url: socketUrl,
    time_url: "http://localhost:5000/",
    api_url: "http://localhost:5111",
    ongoing: {
        notAccepted: '/api/itsm-analytics/v1/tickets/haeb',
        resolutionDelay: '/api/itsm-analytics/v1/tickets/delay',
    },
    open: {
        index: '/api/itsm-analytics/v1/tickets/open'
    },
    resolved: {
        index: '/api/itsm-analytics/v1/tickets/resolved'
    },
    received: {
        index: '/api/itsm-analytics/v1/tickets/received'
    },
    ongoing: {
        notAccepted: '/api/itsm-analytics/v1/tickets/haeb',
        resolutionDelay: '/api/itsm-analytics/v1/tickets/delay',
        nighteenDays: '/api/itsm-analytics/v1/tickets/nighteen/days/delay',
        sumary: '/api/itsm-analytics/v1/tickets/sumary'
    },
    getDepartmentName: function(str) {
        return (str.length >= 30) ?
            str.substr(0, 29) + "..." :
            str;
    },
    getTitle: function(str) {
        return (str.length >= 40) ?
            str.substr(0, 39) + "..." :
            str;
    },
    getTeamName: function(str) {
        return str.replace(' Service', '');
    },
    getNameOperator: function(obj) {
        var opName = 'N/A';
        if (obj.split('/')[2] !== undefined) {
            var opGeneralName = obj.split('/')[2].split(' '),
                expr = /\b[^\d\W]+\b/g,
                opName = (opGeneralName[(opGeneralName.length - 2)].match(expr)) ?
                opGeneralName[0] + ' ' + opGeneralName[(opGeneralName.length - 2)] :
                opGeneralName[0] + ' ' + opGeneralName[(opGeneralName.length - 3)];
        }
        return opName
    },
    getNameRequester: function(obj) {
        var reqName = "N/A",
            reqFullName = obj.split(" ");
        if (reqFullName[(reqFullName.length - 1)] !== undefined)
            reqName = reqFullName[0] + ' ' + reqFullName[(reqFullName.length - 1)];
        return reqName;
    },
    chartBarStacked: function(properties) {
        var chartLineObj = document.getElementById(properties.id),
            charData = {
                type: 'bar',
                data: {
                    labels: properties.result.series.map(function(elem) {
                        return elem.name;
                    }),
                    datasets: properties.result.categories.map(function(v, i) {
                        return {
                            label: global.getTeamName(v),
                            data: properties.result.series.map(function(e, j) {
                                return e.data[i];
                            }),
                            borderColor: "rgba(14,6,0,1)",
                            backgroundColor: properties.color[i],
                            stack: 2
                        };
                    })
                },
                options: {
                    responsive: true,
                    legend: {
                        display: properties.legend,
                        labels: { fontColor: "white" }
                    },
                    animation: {
                        duration: 0
                    },
                    scales: {
                        yAxes: [{
                            stacked: true,
                            ticks: {
                                fontColor: 'white'
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontColor: 'white'
                            }
                        }]
                    }
                }
            };

        window.myLine = new Chart(chartLineObj.getContext("2d"), charData);
    }
};

function HttpHandler(url) {
    this._url = url;

    // Events Triggers
    this._onError = function(state, self) {
        var evt = $.Event("error");
        evt.state = state;
        $(self).trigger(evt);
    };

    this._onData = function(state, self) {
        var evt = $.Event("data");
        evt.state = state;
        $(self).trigger(evt);
    };

    this.requester = function(api, obj) {
        $.getJSON(this._url + api)
            .done(function(res) {
                obj._onData(res, obj);
            })
            .fail(function(xhr, exception) {
                obj._onError(xhr.responseJSON, obj);
            })
    }

    return this;
}