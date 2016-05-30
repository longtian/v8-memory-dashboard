$(function () {

  var memory_property = 'space_used_size';
  var lastHeapSpaces = {};

  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });

  hljs.initHighlightingOnLoad();
  var token = $('meta[name=WILDDOG_TOKEN]').attr('content');
  var ref = new Wilddog($('meta[name=WILDDOG_REF]').attr('content'));

  function init() {
    var treemap = new Highcharts.Chart({
      chart: {
        type: 'treemap',
        renderTo: $('#heap')[0]
      },
      title: {
        text: 'heapSpaceStatistics'
      },
      series: [{
        dataLabels: {
          formatter: function () {
            return `${this.point.name}<br/>${numeral(this.point.value).format('0.00 b')}`;
          }
        }
      }]
    });

    var lines = new Highcharts.Chart({
      chart: {
        renderTo: $('#mem')[0]
      },
      title: {
        text: 'memory'
      },
      xAxis: {
        type: 'datetime'
      },
      plotOptions: {
        series: {
          tooltip: {
            pointFormatter: function () {
              return this.series.name + ':' + numeral(this.y).format('0.00 b')
            },
            shared: true
          },
          connectNulls: true,
          marker: {
            enabled: false
          }
        },
        area: {
          stacking: 'normal'
        }
      },
      series: [{
        id: 'rss',
        name: 'rss',
        type: 'areaspline'
      }, {
        id: 'heapTotal',
        name: 'heapTotal',
        type: 'areaspline',
        dashStyle: 'dot',
        fillOpacity: 0.3
      }, {
        id: 'heapUsed',
        name: 'heapUsed',
        type: 'areaspline'
      }]
    });


    function addSeriesData(name, x, y) {
      var series = lines.get(name);
      if (!series) {
        series = lines.addSeries({
          id: name,
          name: name,
          visible: false
        });
      }
      if (series.points && series.points.length > 30) {
        series.points[0].remove(false);
      }
      series.addPoint({
        x: x,
        y: y
      });
    }

    function drawHeapSpaces() {
      var data = lastHeapSpaces.map(item => ({
        name: item.space_name,
        value: item[memory_property]
      }));
      treemap.series[0].setData(data);
      treemap.setTitle({
        text: `heapSpaceStatistics - ${memory_property}`
      })
    }

    ref.on('value', function (snapshot) {
      var hostInfo = snapshot.val();

      lastHeapSpaces = hostInfo.heapSpaceStatistics;
      drawHeapSpaces();

      $('#info code').text(JSON.stringify(hostInfo, null, 2));
      $('#info').each(function (i, block) {
        hljs.highlightBlock(block);
      });

      addSeriesData('heapTotal', hostInfo.timestamp, hostInfo.memoryUsage.heapTotal);
      addSeriesData('heapUsed', hostInfo.timestamp, hostInfo.memoryUsage.heapUsed);
      addSeriesData('rss', hostInfo.timestamp, hostInfo.memoryUsage.rss);
      addSeriesData('freemem', hostInfo.timestamp, hostInfo.freemem);

    });

    $('#memory_property button').click(function () {
      memory_property = $(this).text();
      mixpanel.track('ChangeMemoryType', {
        memoryType: memory_property
      });
      $('#memory_property button.active').removeClass('active');
      $(this).addClass('active');
      drawHeapSpaces();
    });

  };

  ref.authWithCustomToken(token, init);

});
