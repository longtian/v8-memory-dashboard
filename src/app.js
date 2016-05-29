$(function () {

  var memory_property = 'physical_space_size';
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
          connectNulls: true
        },
        area: {
          stacking: 'normal'
        }
      },
      series: [{
        id: 'rss',
        name: 'rss',
        type: 'area',
        stack: 0
      }, {
        id: 'heapTotal',
        name: 'heapTotal',
        type: 'area',
        stack: 1
      }, {
        id: 'heapUsed',
        name: 'heapUsed',
        type: 'area',
        stack: 1
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

    function drawHeapSpaces(){
      var data = lastHeapSpaces.map(item => ({
        name: item.space_name,
        value: item[memory_property]
      }));
      treemap.series[0].setData(data);
      treemap.setTitle({
        text:`heapSpaceStatistics - ${memory_property}`
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


      const now = Date.now();
      addSeriesData('heapTotal', now, hostInfo.memoryUsage.heapTotal);
      addSeriesData('heapUsed', now, hostInfo.memoryUsage.heapUsed);
      addSeriesData('rss', now, hostInfo.memoryUsage.rss);
      addSeriesData('freemem', now, hostInfo.freemem);

    });

    $('#memory_property button').click(function(){
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