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

  }
}());