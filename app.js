/**
 * Created by vadimdez on 07/01/16.
 */
(function () {
  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';
  d3.json(url, function (err, data) {
    if (err) {
      console.warn(err);
      return;
    }

    drawChart(data);
  });

  function drawChart(data) {
    var margins = {
      top: 0,
      bottom: 40,
      left: 30,
      right: 80
    };
    var chartWidth = 960;
    var chartHeight = 500;
    var width = chartWidth - margins.left - margins.right;
    var height = chartHeight - margins.top - margins.bottom;

    var maxPlace = d3.max(data, function(array) {
      return array.Place;
    });
    function getSeconds(array) {
      return array.Seconds;
    }
    var minSeconds = d3.min(data, getSeconds);
    var maxSeconds = d3.max(data, getSeconds);

    var yScale = d3.scale.linear()
      .domain([1, maxPlace])
      .range([margins.bottom, height]);

    var xScale = d3.scale.linear()
      .domain([maxSeconds, minSeconds])
      .range([margins.left, width]);

    var $tooltip = d3.select('.tooltip');

    var $chart = d3.select('.chart')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .append('g')
      .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

    // y axis
    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left');

    $chart.append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -40)
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Place');

    // x axis
    var xAxis = d3.svg.axis()
      .scale(xScale)
      .ticks(15)
      .tickFormat(function (d) {
        return parseInt(d / 60) + ':' + (d % 60 || '00');
      })
      .orient('bottom');

    $chart.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + (height + 10) + ')')
      .call(xAxis);


    var $points = $chart.selectAll('.athlete-group')
      .data(data);

    // create groups
    var $g = $points.enter()
      .append('g')
      .attr('class', 'athlete-group')
      .attr('transform', function (d) {
        return 'translate(' + xScale(d.Seconds) + ',' + yScale(d.Place) + ')';
      });

    // add circle
    $g.append('circle')
      .attr('class', function (d) {
        return 'athlete ' + ((d.Doping) ? 'doping' : '');
      })
      .attr('r', '6px');

    // add text
    $g.append('text')
      .attr('class', 'name')
      .attr('x', 10)
      .attr('y', 4)
      .text(function (d) {
        return d.Name;
      });


    // mouse interactions
    $points
      .on('mouseover', function () {
        return $tooltip.classed('active', true);
      })
      .on('mousemove', function (d) {
        d3.select(this).classed('active', true);

        ['Name', 'Nationality', 'Year', 'Time', 'Doping'].forEach(function (name) {
          $tooltip.select('.' + name.toLowerCase()).text(d[name] || '');
        });

        return $tooltip
          .style('top', event.pageY + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseleave', function () {
        d3.select(this).classed('active', false);
        return $tooltip.classed('active', false);
      });
  }
}());